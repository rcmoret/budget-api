import { BudgetItem } from "@/types/budget";
import { createContext, useContext } from "react";
import { useAdjustmentStore } from "@/lib/adjustment-amount-store";

type SupplementalItemProps = {
  isVariable: boolean;
  isFormShown: boolean;
  toggleForm: () => void;
};

type ItemContextValue = {
  item: BudgetItem & SupplementalItemProps;
  itemContext: SupplementalItemProps & {
    transactionsTotalLabel: "Spent" | "Deposited";
  };
};

const ItemContext = createContext<ItemContextValue | null>(null);

const ItemContextProvider = (props: {
  item: BudgetItem;
  children: React.ReactNode;
}) => {
  const { item } = props;
  const { adjustments, addItem, resetItems } = useAdjustmentStore();
  const hasAdjustment = adjustments.some(({ objectKey }) => {
    return objectKey === item.objectKey;
  });
  const isFormShown = hasAdjustment && !item.isCleared;
  const toggleForm = () => {
    resetItems();
    if (!isFormShown) {
      addItem({ objectKey: item.objectKey, amount: item.amount.display });
    }
  };

  const value: ItemContextValue = {
    item: {
      ...item,
      isFormShown,
      isVariable: !item.isFixed,
      toggleForm,
    },
    itemContext: {
      isFormShown,
      isVariable: !item.isFixed,
      toggleForm,
      transactionsTotalLabel: item.isExpense ? "Spent" : "Deposited",
    },
  };

  return (
    <ItemContext.Provider value={value}>{props.children}</ItemContext.Provider>
  );
};

const useBudgetItemContext = () => {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error(
      "useBudgetItemContext must be used within a ItemContextProvider",
    );
  }

  return context;
};

export { type ItemContextValue, ItemContextProvider, useBudgetItemContext };
