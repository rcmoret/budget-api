import { BudgetItem } from "@/types/budget";
import { createContext, useContext } from "react";

type SupplementalItemProps = {
  isVariable: boolean;
}

type ItemContextValue = {
  item: BudgetItem & SupplementalItemProps
}

const ItemContext = createContext<ItemContextValue | null>(null)

const ItemContextProvider = (props: { item: BudgetItem; children: React.ReactNode }) => {
  const { item } = props
  const value: ItemContextValue = {
    item: {
      ...item,
      isVariable: !item.isFixed
    }
  }

  return (
    <ItemContext.Provider value={value}>
      {props.children}
    </ItemContext.Provider>
  )
}

const useBudgetItemContext = () => {
  const context = useContext(ItemContext)

  if (!context) {
    throw new Error(
      "useBudgetItemContext must be used within a ItemContextProvider",
    );
  }

  return context
}

export { ItemContextProvider, useBudgetItemContext }
