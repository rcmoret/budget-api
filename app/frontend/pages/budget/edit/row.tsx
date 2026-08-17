import { ActiveItemCard, CardLabel, CardRow } from "@/components/card";
import { CloseButton } from "@/components/cta";
import { AdjustmentInputsProvider } from "@/components/adjustment-input/context-provider";
import { TotalInput } from "@/components/adjustment-input";
import { AmountSpan } from "@/components/amount-span";
import { BudgetItem } from "@/types/budget";
import { EditRow, useEditStore } from "./store";

const EditRowCard = (props: { row: EditRow; currentItem?: BudgetItem }) => {
  const { row, currentItem } = props;
  const removeRow = useEditStore((s) => s.removeRow);

  const label = (
    <CardLabel label={row.name}>
      <CloseButton
        ariaLabel={`Remove ${row.name}`}
        title={`Remove ${row.name}`}
        onClick={() => removeRow(row.budgetItemKey)}
      />
    </CardLabel>
  );

  return (
    <ActiveItemCard id={`edit-item-${row.budgetItemKey}`} label={label} isFormShown>
      <AdjustmentInputsProvider objectKey={row.budgetItemKey} editing="total">
        {currentItem && (
          <CardRow>
            <span className="opacity-60">Currently budgeted</span>
            <AmountSpan amount={currentItem.amount.cents} colorize="none" />
          </CardRow>
        )}
        <CardRow>
          <span>{row.eventType === "item_create" ? "Amount" : "New total"}</span>
          <TotalInput />
        </CardRow>
      </AdjustmentInputsProvider>
    </ActiveItemCard>
  );
};

export { EditRowCard };
