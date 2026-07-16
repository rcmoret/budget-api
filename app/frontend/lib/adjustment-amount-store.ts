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

type AdjustmentStoreState = {
  addItem: (i: { objectKey: string; amount: string }) => void;
  adjustments: Array<AdjustmentAmountItem>;
  removeItem: (objectKey: string) => void;
  resetItems: () => void;
  setAdjustments: (adjustments: Array<AdjustmentAmountItem>) => void;
  updateItemByAmount: (props: { objectKey: string; amount: string }) => void;
  updateItemByTotal: (props: { objectKey: string; amount: string }) => void;
};

const buildNewItem = (item: {
  objectKey: string;
  amount: string;
}): AdjustmentAmountItem => {
  const initialAmount = decimalToInt(item.amount);
  const newTotal = {
    cents: initialAmount,
    display:
      initialAmount === 0 ? "" : inputAmount({ cents: initialAmount }).display,
  };

  return {
    objectKey: item.objectKey,
    initialAmount,
    adjustmentAmount: { cents: 0, display: "" },
    newTotal,
  };
};

const useAdjustmentStore = create<AdjustmentStoreState>((set, get) => ({
  adjustments: [],
  addItem: (item: { objectKey: string; amount: string }) => {
    const newItem = buildNewItem(item);
    const existingItems = get().adjustments.filter(
      ({ objectKey }) => objectKey !== newItem.objectKey,
    );
    set({ adjustments: [...existingItems, newItem] });
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
        const newTotal = inputAmount({ display: props.amount });
        const amount = newTotal.cents - item.initialAmount;
        const updatedItem = {
          ...item,
          adjustmentAmount: inputAmount({ cents: amount }),
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

const useAdjustments = () => {
  const sumItemsAdjustments = () => {
    const { adjustments } = useAdjustmentStore.getState();

    return adjustments.reduce((sum, item) => {
      return sum + item.adjustmentAmount.cents;
    }, 0);
  };
  const sumTotals = () => {
    const { adjustments } = useAdjustmentStore.getState();

    return adjustments.reduce((sum, item) => {
      return sum + item.newTotal.cents;
    }, 0);
  };

  const removeItem = (objectKey: string) => {
    const { adjustments: originalItems, setAdjustments } =
      useAdjustmentStore.getState();
    const filteredItems = originalItems.filter(
      (item) => item.objectKey !== objectKey,
    );

    setAdjustments(filteredItems);
  };

  const updateItemByAdjustment = (props: {
    objectKey: string;
    amount: string;
  }) => {
    const { adjustments: items, setAdjustments } =
      useAdjustmentStore.getState();

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

    setAdjustments(updatedItems);
  };

  const updateItemByTotal = (props: { objectKey: string; amount: string }) => {
    const { adjustments: items, setAdjustments } =
      useAdjustmentStore.getState();

    const updatedItems = items.map((item) => {
      if (item.objectKey === props.objectKey) {
        const newTotal = inputAmount({ display: props.amount });
        const amount = newTotal.cents - item.initialAmount;
        const updatedItem = {
          ...item,
          adjustmentAmount: inputAmount({ cents: amount }),
          newTotal,
        };
        return updatedItem;
      } else {
        return item;
      }
    });

    setAdjustments(updatedItems);
  };

  const getItems = () => {
    const { adjustments: items } = useAdjustmentStore.getState();

    return items;
  };

  return {
    getItems,
    removeItem,
    resetItems,
    sumItemsAdjustments,
    sumTotals,
    updateItemByAdjustment,
    updateItemByTotal,
  };
};

const useInitAdjustmentStore = () => {
  useEffect(() => {
    const { resetItems } = useAdjustmentStore.getState();
    resetItems();
  }, []);
};

export {
  type AdjustmentAmountItem,
  inputAmount,
  useAdjustments,
  useAdjustmentStore,
  useInitAdjustmentStore,
};
