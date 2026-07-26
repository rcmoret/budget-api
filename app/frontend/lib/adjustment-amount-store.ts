import { MonetaryAmount } from "@/types/amount";
import { create } from "zustand";
import { decimalToInt, moneyFormatter } from "./money-formatter";
import { useEffect } from "react";

type InputAmountProps = {
  decimal?: string | number;
  cents?: number;
  display?: string;
};

const inputAmount = (props: InputAmountProps): MonetaryAmount => {
  const { cents, display } = props;

  if (display === "" || !!display) {
    return {
      cents: decimalToInt(display),
      display: display,
    };
  } else {
    const amount = cents || 0;

    return {
      cents: amount,
      display: moneyFormatter(amount),
    };
  }
};

type AdjustmentAmountItem = {
  objectKey: string;
  initialAmount: number;
  adjustmentAmount: MonetaryAmount;
  newTotal: MonetaryAmount;
};

// Derive the adjustment (total - initialAmount) and normalized total from a
// typed-in total. Shared by the store and callers that need the resulting
// adjustment before the store update has propagated.
const adjustmentFromTotal = (props: {
  total: string;
  initialAmount: number;
}): { adjustmentAmount: MonetaryAmount; newTotal: MonetaryAmount } => {
  const newTotal = inputAmount({ display: props.total });
  const adjustmentAmount = inputAmount({
    cents: newTotal.cents - props.initialAmount,
  });

  return { adjustmentAmount, newTotal };
};

type AdjustmentStoreState = {
  addItem: (i: {
    objectKey: string;
    amount: string;
    adjustment?: string;
  }) => void;
  adjustments: Array<AdjustmentAmountItem>;
  getItem: (objectKey: string) => AdjustmentAmountItem;
  removeItem: (objectKey: string) => void;
  resetItems: () => void;
  setAdjustments: (adjustments: Array<AdjustmentAmountItem>) => void;
  updateItemByAmount: (props: { objectKey: string; amount: string }) => void;
  updateItemByTotal: (props: { objectKey: string; amount: string }) => void;
};

const buildNewItem = (item: {
  objectKey: string;
  amount: string;
  adjustment?: string;
}): AdjustmentAmountItem => {
  const initialAmount = decimalToInt(item.amount);
  // Seed the adjustment from any already-saved value so a page refresh
  // restores the input instead of clearing it back to empty.
  const adjustmentAmount = inputAmount({ display: item.adjustment ?? "" });
  const newTotalCents = initialAmount + adjustmentAmount.cents;
  const newTotal = {
    cents: newTotalCents,
    display:
      newTotalCents === 0 ? "" : inputAmount({ cents: newTotalCents }).display,
  };

  return {
    objectKey: item.objectKey,
    initialAmount,
    adjustmentAmount,
    newTotal,
  };
};

const useAdjustmentStore = create<AdjustmentStoreState>((set, get) => ({
  adjustments: [],
  addItem: (item: {
    objectKey: string;
    amount: string;
    adjustment?: string;
  }) => {
    const newItem = buildNewItem(item);
    const existingItems = get().adjustments.filter(
      ({ objectKey }) => objectKey !== newItem.objectKey,
    );
    set({ adjustments: [...existingItems, newItem] });
  },
  getItem: (key: string) => {
    return (
      get().adjustments.find(({ objectKey }) => objectKey === key) ??
      buildNewItem({ objectKey: key, amount: "" })
    );
  },
  resetItems: () => set({ adjustments: [] }),
  removeItem: (objectKey: string) => {
    const filteredItems = get().adjustments.filter(
      (item) => item.objectKey !== objectKey,
    );
    set({ adjustments: filteredItems });
  },
  setAdjustments: (adjustments: Array<AdjustmentAmountItem>) =>
    set({ adjustments }),
  updateItemByAmount: (props: { objectKey: string; amount: string }) => {
    const { adjustments: items } = get();

    const updatedItems = items.map((item) => {
      if (item.objectKey === props.objectKey) {
        const amount = inputAmount({ display: props.amount });
        const newTotalCents = item.initialAmount + amount.cents;
        const updatedItem = {
          ...item,
          adjustmentAmount: amount,
          newTotal: inputAmount({ cents: newTotalCents }),
        };
        return updatedItem;
      } else {
        return item;
      }
    });
    set({ adjustments: updatedItems });
  },
  updateItemByTotal: (props: { objectKey: string; amount: string }) => {
    const { adjustments: items } = get();

    const updatedItems = items.map((item) => {
      if (item.objectKey === props.objectKey) {
        const { adjustmentAmount, newTotal } = adjustmentFromTotal({
          total: props.amount,
          initialAmount: item.initialAmount,
        });
        const updatedItem = {
          ...item,
          adjustmentAmount,
          newTotal,
        };
        return updatedItem;
      } else {
        return item;
      }
    });
    set({ adjustments: updatedItems });
  },
}));

const useAdjustmentsTotals = () => {
  const adjustments = useAdjustmentStore((s) => s.adjustments);

  const newTotal = adjustments.reduce((sum, adjustment) => {
    return sum + adjustment.newTotal.cents;
  }, 0);
  const totalAdjustment = adjustments.reduce((sum, adjustment) => {
    return sum + adjustment.adjustmentAmount.cents;
  }, 0);

  return { newTotal, totalAdjustment };
};

const useInitAdjustmentStore = () => {
  useEffect(() => {
    const { resetItems } = useAdjustmentStore.getState();
    resetItems();
  }, []);
};

type AdjustmentSetProps = Array<{
  objectKey: string;
  amount: string;
  adjustment?: string;
}>;

const useAdjustementSet = (adjustments: AdjustmentSetProps) => {
  const addItem = useAdjustmentStore((s) => s.addItem);
  const resetItems = useAdjustmentStore((s) => s.resetItems);
  // Re-seed only when the set of items actually changes (e.g. switching
  // categories). Joining into a string keeps the dep stable across prop
  // refreshes (like a PUT response) so in-progress edits held in the store
  // aren't wiped back to empty by resetItems.
  const keys = adjustments
    .map(({ objectKey }) => objectKey)
    .sort()
    .join(",");

  useEffect(() => {
    resetItems();
    adjustments.forEach((adjustment) => {
      addItem(adjustment);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);
};

export {
  type AdjustmentAmountItem,
  type AdjustmentSetProps,
  adjustmentFromTotal,
  buildNewItem,
  inputAmount,
  useAdjustementSet,
  useAdjustmentStore,
  useAdjustmentsTotals,
  useInitAdjustmentStore,
};
