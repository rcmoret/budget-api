import { createContext, ReactNode, useContext } from "react";
import { BudgetCategory } from "@/types/budget";

type NewBudgetCategory = {
  key: string;
  name: string;
  slug: string;
  archivedAt: null;
  defaultAmount?: number;
  iconKey: string | null;
  isAccrual: boolean;
  isArchived: false;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  isPerDiemEnabled: boolean;
};

type CategoryCardProps = {
  category: BudgetCategory;
  isFormShown: boolean;
  setShowFormKey: (key: string | null) => void;
};

const CardContext = createContext<CategoryCardProps | undefined>(undefined);

const CategoryShowProvider = (props: {
  children: ReactNode;
  category: BudgetCategory;
  isFormShown: boolean;
  setShowFormKey: (key: string | null) => void;
}) => {
  const { children, category, isFormShown, setShowFormKey } = props;

  const value: CategoryCardProps = {
    category,
    isFormShown,
    setShowFormKey,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

// hooks
const useCardContext = (): CategoryCardProps => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

const useCardCategory = (): BudgetCategory => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context.category;
};

export {
  CategoryShowProvider,
  useCardCategory,
  useCardContext,
  type CategoryCardProps as CardContextType,
  type NewBudgetCategory,
};
