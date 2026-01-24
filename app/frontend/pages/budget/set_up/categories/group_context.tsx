import { TCategoryGroup, TCategoryListItem, TGroupScopes } from "@/pages/budget/set_up";
import { createContext, useContext } from "react";
import { useToggle } from "@/lib/hooks/useToogle";

type TGroupContext = {
  label: string;
  name: string;
  showAddForm: boolean;
  categories: Array<TCategoryListItem>;
  scopes: Array<TGroupScopes>;
  metadata: {
    count: number;
    sum: number;
    unreviewed: number;
    isReviewed: number;
    isSelected: boolean;
  };
  toggleShowAddForm: () => void;
}

const SetUpCategoryGroupContext = createContext<TGroupContext | null>(null)

const CategoryGroupProvider = (props: {
  group: TCategoryGroup;
  children?: React.ReactNode
}) => {
  const { group, children } = props
  const [showAddForm, toggleShowAddForm] = useToggle(false)

  const value = {
    ...group,
    showAddForm,
    toggleShowAddForm
  }

  return (
    <SetUpCategoryGroupContext.Provider value={value}>
      {children}
    </SetUpCategoryGroupContext.Provider>
  )
}

const useSetupCategoryGroupContext = (): TGroupContext => {
  const context = useContext(SetUpCategoryGroupContext)
  if (!context) {
    throw new Error("useSetUpCategoryContext must be used with a Set Up Category Provider")
  }
  return context
}

export {
  CategoryGroupProvider as CategoryGroup,
  useSetupCategoryGroupContext as useSetUpCategoryGroupContext,
  useSetupCategoryGroupContext
}
