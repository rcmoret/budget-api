import {
  FormatOptionLabelMeta,
  GroupBase,
  OptionsOrGroups,
} from "react-select";
import { ThemedSelect } from "@/components/themed-select";
import { DetailAttribute } from "./details-context";
import { useTransactionFormContent } from "./context-provider";
import { TotalInput } from "@/components/adjustment-input";
import {
  AdjustmentInputsProvider,
  useAdjustmentInputsContext,
} from "@/components/adjustment-input/context-provider";
import { getBudgetItems } from "../store";
import { AmountSpan } from "@/components/amount-span";
import { TransactionDetailBudgetItem } from "@/types/transaction";
import { FormRow } from "./row";

const ClearDetailButton = (props: { objectKey: string }) => {
  const { nullifyDetailBudgetItemKey } = useTransactionFormContent();
  const { updateItemByTotal } = useAdjustmentInputsContext();

  const onClick = () => {
    updateItemByTotal("");
    nullifyDetailBudgetItemKey(props.objectKey);
  };

  return (
    <button
      type="button"
      aria-label="clear line item"
      className="round-cta cta-sm bg-accent text-accent-content"
      onClick={onClick}
    >
      &#x2718;
    </button>
  );
};

const AddDetailButton = () => {
  const { addDetail } = useTransactionFormContent();

  return (
    <button
      type="button"
      aria-label="add line item"
      className="round-cta cta-sm bg-success text-success-content"
      onClick={() => addDetail()}
    >
      &#x2b;
    </button>
  );
};

type BudgetItemOption = {
  label: string;
  value: string;
  remaining: null | number;
};

const budgetItemOption = (
  item: TransactionDetailBudgetItem,
): BudgetItemOption => {
  const { key, name, remaining } = item;
  return {
    label: name,
    value: key,
    remaining: remaining.cents,
  };
};

const formatBudgetItemOption = (
  option: BudgetItemOption,
  meta: FormatOptionLabelMeta<BudgetItemOption>,
) => {
  if (meta.context === "value") return option.label;

  return (
    <div className="flex justify-between">
      <div className="truncate">{option.label}</div>
      <div>
        {option.remaining === null ? null : (
          <AmountSpan amount={option.remaining} showCents={false} />
        )}
      </div>
    </div>
  );
};

const findOption = (
  options: OptionsOrGroups<BudgetItemOption, GroupBase<BudgetItemOption>>,
  budgetItemKey: null | string,
): BudgetItemOption | null => {
  if (!budgetItemKey) return null;

  for (const entry of options) {
    if ("options" in entry) {
      const grouped = entry.options.find((o) => o.value === budgetItemKey);
      if (grouped) return grouped;
    } else if (entry.value === budgetItemKey) {
      return entry;
    }
  }

  return null;
};

// Edge case 1: when editing a transaction created in a different budget month,
// that month's item is absent from the serialized `budgetItems`. The detail
// still carries the key and name, so synthesize an option from it — otherwise
// the control has nothing to resolve its value against and renders as empty.
// There is no `remaining` to show, hence the null.
const carriedOverOption = (
  detail: DetailAttribute,
  budgetItems: Array<TransactionDetailBudgetItem>,
): null | BudgetItemOption => {
  const { budgetItemKey, budgetCategoryName } = detail;
  if (!budgetItemKey) return null;
  if (budgetItems.some(({ key }) => key === budgetItemKey)) return null;

  return {
    label: budgetCategoryName ?? "-",
    value: budgetItemKey,
    remaining: null,
  };
};

const useAvailableBudgetItems = (
  detail: DetailAttribute,
): OptionsOrGroups<BudgetItemOption, GroupBase<BudgetItemOption>> => {
  const budgetItems = getBudgetItems();
  const { details } = useTransactionFormContent();

  // Edge case 2: a budget item key has to be unique across the transaction, so
  // drop whatever the *other* line items have already claimed.
  const claimedKeys = details
    .filter(({ objectKey }) => objectKey !== detail.objectKey)
    .map(({ budgetItemKey }) => budgetItemKey);
  const selectable = budgetItems.filter(
    ({ key }) => !claimedKeys.includes(key),
  );

  const accruingItems = selectable.filter(
    (item) => item.isAccrual && !item.isMature,
  );
  // Skipped when empty, otherwise the exclusion above can leave a bare
  // "ACCRUING ITEMS" heading with nothing under it.
  const accruingItemGroup = accruingItems.length
    ? [
        {
          label: "Accruing Items",
          options: accruingItems.map(budgetItemOption),
        },
      ]
    : [];

  const carriedOver = carriedOverOption(detail, budgetItems);

  return [
    ...(carriedOver ? [carriedOver] : []),
    ...selectable
      .filter((item) => !item.isAccrual || item.isMature)
      .map(budgetItemOption),
    ...accruingItemGroup,
  ];
};

const LineItem = (props: { detail: DetailAttribute; isLast: boolean }) => {
  const { detail } = props;
  const { nullifyDetailBudgetItemKey, setDetailBudgetItemKey } =
    useTransactionFormContent();
  const budgetItemOptions = useAvailableBudgetItems(detail);

  const onChange = (option: BudgetItemOption | null) => {
    if (option) {
      setDetailBudgetItemKey(detail.objectKey, option.value, option.label);
    } else {
      nullifyDetailBudgetItemKey(detail.objectKey);
    }
  };

  return (
    <div className="grid col-span-full grid-cols-subgrid items-center">
      <div className="fields">
        <ThemedSelect
          options={budgetItemOptions}
          value={findOption(budgetItemOptions, detail.budgetItemKey)}
          onChange={onChange}
          formatOptionLabel={formatBudgetItemOption}
        />
        <div className="text-right">
          <TotalInput />
        </div>
      </div>
      <div>
        {props.isLast ? (
          <AddDetailButton />
        ) : (
          <ClearDetailButton objectKey={detail.objectKey} />
        )}
      </div>
    </div>
  );
};

const LineItems = () => {
  const { details } = useTransactionFormContent();
  return (
    <FormRow>
      <div className="line-items">
        <div className="fields">
          <div>
            <label htmlFor="category-col-label">Budget Category</label>
          </div>
          <div>
            <label htmlFor="amount-col-label">Amount</label>
          </div>
        </div>
      </div>
      {details.map((detail, index) => (
        <AdjustmentInputsProvider
          key={detail.objectKey}
          objectKey={detail.objectKey}
        >
          <FormRow>
            <LineItem
              key={detail.objectKey}
              detail={detail}
              isLast={index + 1 === details.length}
            />
          </FormRow>
        </AdjustmentInputsProvider>
      ))}
    </FormRow>
  );
};

export { LineItems };
