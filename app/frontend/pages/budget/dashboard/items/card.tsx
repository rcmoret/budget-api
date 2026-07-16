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

const LabelMain = () => {
  const { item } = useBudgetItemContext();

  return (
    <div className="flex flex-row gap-2 items-center">
      <div>{item.name}</div>
      <div>
        <Icon name={item.iconClassName} />
      </div>
    </div>
  );
};

const BudgetItemCardLabel = () => {
  const { item } = useBudgetItemContext();

  return (
    <CardLabel label={<LabelMain />}>
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

const BudgetItemCard = (props: { item: BudgetItem }) => {
  const { item } = props;

  return (
    <AdjustmentInputsProvider objectKey={item.objectKey}>
      <ItemContextProvider item={item}>
        <ActiveItemCard
          key={item.objectKey}
          id={item.objectKey}
          label={<BudgetItemCardLabel />}
        >
          <InnerCard />
          <ClearedItemPill />
          <AccrualPill />
          <ItemCompositionDetails />
          <BottomRow />
        </ActiveItemCard>
      </ItemContextProvider>
    </AdjustmentInputsProvider>
  );
};

export { BudgetItemCard };
