import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { BudgetItemCreateEventType } from "@/types/budget/events";
import { EditRow, useEditStore } from "./store";

type ChangePayload = {
  budgetItemKey: string;
  budgetCategoryKey: string;
  amount: number;
  eventType: "item_adjust" | BudgetItemCreateEventType;
  key?: string;
  month?: string | number;
  year?: string | number;
};

const rowToChangePayload = (row: EditRow, newTotalCents: number): ChangePayload => {
  if (row.eventType === "item_create" && row.createEvent) {
    return { ...row.createEvent, amount: newTotalCents };
  }

  return {
    budgetItemKey: row.budgetItemKey,
    budgetCategoryKey: row.budgetCategoryKey,
    amount: newTotalCents,
    eventType: "item_adjust",
  };
};

const useChangePayloads = (): Array<ChangePayload> => {
  const rows = useEditStore((s) => s.rows);
  const adjustments = useAdjustmentStore((s) => s.adjustments);

  return rows.map((row) => {
    const adjustment = adjustments.find((a) => a.objectKey === row.budgetItemKey);
    return rowToChangePayload(row, adjustment?.newTotal.cents ?? 0);
  });
};

const useRowDisplayDeltas = (): Record<string, number> => {
  const rows = useEditStore((s) => s.rows);
  const adjustments = useAdjustmentStore((s) => s.adjustments);

  return Object.fromEntries(
    rows.map((row) => {
      const adjustment = adjustments.find((a) => a.objectKey === row.budgetItemKey);
      const delta =
        row.eventType === "item_create"
          ? (adjustment?.newTotal.cents ?? 0)
          : (adjustment?.adjustmentAmount.cents ?? 0);

      return [row.budgetItemKey, delta];
    }),
  );
};

export { type ChangePayload, useChangePayloads, useRowDisplayDeltas };
