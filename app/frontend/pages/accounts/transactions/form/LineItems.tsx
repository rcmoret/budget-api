import { useAppConfigContext } from "@/components/layout/Provider";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Label } from "@/pages/accounts/transactions/partials/label";
import { Icon } from "@/components/common/Icon";
import Select, { SingleValue, createFilter } from "react-select";
import { accrualFilter } from "@/lib/models/budget-items";
import {
  AmountInput,
  inputAmount,
  TInputAmount,
} from "@/components/common/AmountInput";
import { Button } from "@/components/common/Button";
import { moneyFormatter } from "@/lib/MoneyFormatter";
import { byNameAndAmount as sortByName } from "@/lib/sort_functions";
import { useTransactionFormContext } from "./context-provider";

const RemoveButton = ({ detailKey }: { detailKey: string }) => {
  const { removeDetail } = useTransactionFormContext();

  return (
    <Button type="button" onClick={() => removeDetail(detailKey)}>
      <span className="text-gray-600">
        <Icon name="times-circle" />
      </span>
    </Button>
  );
};

const AddButton = () => {
  const { addDetail } = useTransactionFormContext();

  return (
    <Button type="button" onClick={addDetail}>
      <span className="text-gray-600">
        <Icon name="plus-circle" />
      </span>
    </Button>
  );
};

const LineItemComponent = (props: {
  detail: { key: string; budgetItemKey: string | null; amount: TInputAmount };
}) => {
  const { appConfig } = useAppConfigContext();
  const { items, month, year } = appConfig.budget.data;
  const { showAccruals } = appConfig.budget;
  const { detail } = props;
  const { key, amount, budgetItemKey } = detail;

  const { data, formDetails, updateDetailItem, updateDetailAmount } =
    useTransactionFormContext();

  const { isBudgetExclusion } = data;
  const detailCount = formDetails.length;

  const availableItems = [...items].filter((item) => {
    if (item.key === budgetItemKey) {
      return true;
    } else if (item.isDeleted) {
      return false;
    } else if (item.month !== month || item.year !== year) {
      return false;
    } else if (item.isMonthly && item.transactionDetails.length) {
      return false;
    } else {
      return accrualFilter({ item, showAccruals, month, year });
    }
  });

  const options = availableItems.sort(sortByName).map((item) => ({
    label: `${item.name} (${moneyFormatter(item.remaining, { decorate: true })})`,
    value: item.key,
  }));

  const handleSelectChange = (
    ev: SingleValue<{ value: string | null; label: string }>,
  ) => {
    const item = items.find((item) => item.key === ev?.value) || null;

    if (!!item && amount.cents === 0 && item.isMonthly) {
      updateDetailItem({
        key,
        value: String(ev?.value),
        amount: inputAmount({ cents: item.remaining }),
      });
    } else {
      updateDetailItem({ key, value: String(ev?.value) });
    }
  };

  const handleAmountChange = (amt: string) => {
    updateDetailAmount({ key, value: inputAmount({ display: amt }) });
  };

  const value = options.find((item) => item.value === budgetItemKey) || "";

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="hidden">{key}</div>
      <div className="w-6/12 min-h-12 pr-2">
        <AmountInput
          name="detailAmountDecimal"
          style={{ width: "100%" }}
          classes={["border border-gray-300 h-input-lg px-1"]}
          onChange={handleAmountChange}
          amount={amount}
        />
      </div>
      <div className="w-5/12 min-h-12 pl-2">
        <div className="hidden">{budgetItemKey}</div>
        <Select
          options={options}
          // @ts-ignore
          onChange={handleSelectChange}
          value={value}
          isDisabled={isBudgetExclusion}
          filterOption={createFilter({ matchFrom: "start" })}
        />
      </div>
      <div className="w-1/12 text-right">
        {detailCount > 1 ? (
          <RemoveButton detailKey={detail.key} />
        ) : (
          <AddButton />
        )}
      </div>
    </div>
  );
};

const Total = () => {
  const { formDetails } = useTransactionFormContext();

  if (formDetails.length === 1) {
    return null;
  }

  const total = formDetails.reduce((sum, detail) => {
    return Number(detail.amount.cents) + sum;
  }, 0);

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row justify-between w-5/12 text-sm py-1">
        <Label label="Total" classes={["w-1/2 pl-2"]} />
        <AmountSpan amount={total} />
      </div>
      <div className="w-1/12 text-right">
        <AddButton />
      </div>
    </div>
  );
};

const BudgetItemsComponent = () => {
  const { formDetails } = useTransactionFormContext();

  return (
    <div className="flex flex-col w-full md:w-[450px] md:mr-8">
      <div className="flex flex-row w-full justify-between">
        <Label label="Line Items Amount" classes={["w-6/12"]} />
        <Label label="Budget Category" classes={["w-5/12 pl-2"]} />
      </div>
      <Total />
      <div className="w-full">
        {formDetails.map((detail) => (
          <LineItemComponent key={detail.key} detail={detail} />
        ))}
      </div>
    </div>
  );
};

export { BudgetItemsComponent };
