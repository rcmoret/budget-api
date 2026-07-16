import { CardRow } from "@/components/card";
import { AmountSpan } from "@/components/amount-span";
import { useBudgetItemContext } from "./context-provider";
import {
  AdjustmentInput,
  TotalInput,
  useAdjustmentInputsContext,
} from "@/components/adjustment-input";

const inputClasses = ["bg-base-100/40"];

const AmountSpanButton = (props: { amount: number; onClick: () => void }) => {
  return (
    <div>
      <button type="button" onClick={props.onClick}>
        <AmountSpan amount={props.amount} colorize="none" />
      </button>
    </div>
  );
};

const TotalBudgeted = () => {
  const { item } = useBudgetItemContext();
  const {
    adjustment,
    editingTotal,
    hasAdjustment,
    showTotalInput,
    totalInputId,
  } = useAdjustmentInputsContext();

  const label = "Budgeted";

  if (!hasAdjustment) {
    return (
      <CardRow>
        <div>{label}</div>
        <AmountSpan amount={item.amount.cents} />
      </CardRow>
    );
  } else if (!editingTotal) {
    return (
      <CardRow minHeight="lg">
        <div>{label}</div>
        <div>
          <AmountSpanButton
            onClick={showTotalInput}
            amount={adjustment.newTotal.cents}
          />
        </div>
      </CardRow>
    );
  } else {
    return (
      <CardRow minHeight="lg">
        <label htmlFor={totalInputId}>{label}</label>
        <div>
          <TotalInput classes={inputClasses} />
        </div>
      </CardRow>
    );
  }
};

const AdjustmentAmountInput = () => {
  const {
    adjustment,
    adjustmentInputId,
    editingAdjustment,
    showAdjustmentInput,
  } = useAdjustmentInputsContext();
  const label = "Adjust";

  if (editingAdjustment) {
    return (
      <CardRow className={FORM_ROW_HEIGHT}>
        <label htmlFor={adjustmentInputId}>{label}</label>
        <div>
          <AdjustmentInput classes={inputClasses} />
        </div>
      </CardRow>
    );
  } else {
    return (
      <CardRow className={FORM_ROW_HEIGHT}>
        <div>{label}</div>
        <div>
          <AmountSpanButton
            amount={adjustment.adjustmentAmount.cents}
            onClick={showAdjustmentInput}
          />
        </div>
      </CardRow>
    );
  }
};

const VariableItemCard = () => {
  const { item, itemContext } = useBudgetItemContext();
  const { hasAdjustment } = useAdjustmentInputsContext();

  return (
    <>
      {hasAdjustment && <AdjustmentAmountInput />}
      <TotalBudgeted />
      <CardRow>
        <div>{itemContext.transactionsTotalLabel}</div>
        <div>
          <AmountSpan
            amount={item.transactionDetailTotal.cents}
            colorize="none"
            absolute={true}
          />
        </div>
      </CardRow>
    </>
  );
};

export { VariableItemCard };
