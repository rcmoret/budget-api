import { BudgetCategoryType, NewBudgetCategoryType } from "@/types/budget";
import { useContext, createContext } from "react";
import { useBudgetCategoriesStore } from "./store";

type BudgetCategoryContextValue = {
  category: BudgetCategoryType | NewBudgetCategoryType;
  isFormShown: boolean;
  showForm: () => void;
};

type BudgetCategoryProviderProps = {
  category: BudgetCategoryType | NewBudgetCategoryType;
};

const BudgetCategoryContext = createContext<BudgetCategoryContextValue | null>(
  null,
);

// Returns a context provider / container
const BudgetCategoryProvider = (
  props: BudgetCategoryProviderProps & { children: React.ReactNode },
) => {
  const { category } = props;
  const { key } = category;
  const showFormKey = useBudgetCategoriesStore((s) => s.showFormKey);
  const setShowFormKey = useBudgetCategoriesStore((s) => s.setShowFormKey);
  const value: BudgetCategoryContextValue = {
    category: props.category,
    isFormShown: props.category.key === showFormKey,
    showForm: () => setShowFormKey(key),
  };

  return (
    <BudgetCategoryContext.Provider value={value}>
      {props.children}
    </BudgetCategoryContext.Provider>
  );
};

// Define a hook that will provide the context values
const useBudgetCategoryContext = (): BudgetCategoryContextValue => {
  const context = useContext(BudgetCategoryContext);

  if (!context) {
    throw new Error(
      "useBudgetCategoryContext must be used within a BudgetCategory Provider",
    );
  }

  return context;
};

export { BudgetCategoryProvider, useBudgetCategoryContext };
