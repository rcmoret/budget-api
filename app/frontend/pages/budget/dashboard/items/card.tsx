import { ActiveItemCard, CardLabel, CardRow } from "@/components/card";
import { ItemContextProvider, useBudgetItemContext } from "./context-provider";
import { BudgetItem } from "@/types/budget";
import { AmountSpan } from "@/components/amount-span";
import { Icon } from "@/components/icon";
import { VariableItemCard } from "./variable-item-card";
import { ItemCompositionDetails } from "./previous-current-budget-indicator";
import { AccrualPill, ClearedItemPill } from "./pills";
import { BottomRow } from "./bottom-row";
import {
  useAdjustmentInputsContext,
  AdjustmentInputsProvider,
} from "@/components/adjustment-input/context-provider";
import { TotalInput } from "@/components/adjustment-input";
import { Link } from "@inertiajs/react";

const itemsPath = (item: BudgetItem) =>
  `/budget/${item.month}/${item.year}/items/${item.budgetCategorySlug}`;

const LabelMain = (props: { linkToItems: boolean }) => {
  const { item } = useBudgetItemContext();

  return (
    <div className="flex flex-row gap-2 items-center">
      {props.linkToItems ? (
        <Link href={itemsPath(item)} className="hover:underline">
          {item.name}
        </Link>
      ) : (
        <div>{item.name}</div>
      )}
      <div>
        <Icon name={item.iconClassName} />
      </div>
    </div>
  );
};

const BudgetItemCardLabel = (props: { linkToItems: boolean }) => {
  const { item } = useBudgetItemContext();

  return (
    <CardLabel label={<LabelMain linkToItems={props.linkToItems} />}>
      <AmountSpan
        amount={item.remaining.cents}
        colorize="none"
        absolute={true}
      />
    </CardLabel>
  );
};

const FixedItemCard = () => {
  const { editingTotal, totalInputId } = useAdjustmentInputsContext();

  if (!editingTotal) return null;

  return (
    <CardRow minHeight="lg">
      <label htmlFor={totalInputId}>Budgeted</label>
      <div>
        <TotalInput />
      </div>
    </CardRow>
  );
};

const InnerCard = () => {
  const { item } = useBudgetItemContext();

  if (item.isVariable) {
    return <VariableItemCard />;
  } else {
    return <FixedItemCard />;
  }
};

// `children` renders below the item's details, above the bottom row.
// `linkToItems` links the item's name to its category's items page.
const BudgetItemCard = (props: {
  item: BudgetItem;
  children?: React.ReactNode;
  linkToItems?: boolean;
}) => {
  const { item, children, linkToItems = false } = props;

  return (
    <AdjustmentInputsProvider objectKey={item.objectKey}>
      <ItemContextProvider item={item}>
        <ActiveItemCard
          key={item.objectKey}
          id={item.objectKey}
          label={<BudgetItemCardLabel linkToItems={linkToItems} />}
        >
          <InnerCard />
          <ClearedItemPill />
          <AccrualPill />
          <ItemCompositionDetails />
          {children}
          <BottomRow />
        </ActiveItemCard>
      </ItemContextProvider>
    </AdjustmentInputsProvider>
  );
};

export { BudgetItemCard };
