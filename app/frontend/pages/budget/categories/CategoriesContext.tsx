import { createContext, ReactNode, useContext } from "react";
import { BudgetCategory } from "@/types/budget";
import { IconName } from "@/components/common/Icon";

type TIcon = {
  key: string;
  name: string;
  className: IconName;
};

type CategoriesContextType = {
  icons: Array<TIcon>;
  categories: Array<BudgetCategory>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

const CategoriesProvider = (props: {
  children: ReactNode;
  icons: Array<TIcon>;
  categories: Array<BudgetCategory>;
}) => {
  const { children, icons, categories } = props;

  const value: CategoriesContextType = {
    icons,
    categories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

const useCategoriesIndexContext = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      "useCategoriesIndexContext must be used within a CategoriesProvider",
    );
  }
  return context;
};

export { useCategoriesIndexContext };

export {
  CategoriesContext,
  CategoriesProvider,
  type CategoriesContextType,
  type TIcon,
};
