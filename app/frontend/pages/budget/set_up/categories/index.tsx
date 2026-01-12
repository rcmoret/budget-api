import { createContext, useContext } from "react"
import { BudgetCategory } from "@/types/budget";
import { KeySpan } from "@/components/common/KeySpan";
import { useSetupEventsFormContext, SetupEvent, TCategoryListItem } from "@/lib/hooks/useSetUpEventsForm";

const CategoryListItemContext = createContext<{ category: TCategoryListItem; currentlyReviewing: boolean; } | null>(null)

const CategoryListItemProvider = (props: { category: TCategoryListItem, children?: React.ReactNode }) => {
  const { budgetCategory } = useSetupEventsFormContext()
  const { category } = props

  const value = {
    category,
    currentlyReviewing: category.slug === budgetCategory.slug,
  }

  return (
    <CategoryListItemContext.Provider value={value}>
      <KeySpan _key={category.key} />

      {props.children}
    </CategoryListItemContext.Provider>
  )

}

const useSetupCategoryListItemContext = () => {
  const context = useContext(CategoryListItemContext)
  if (!context) {
    throw new Error("useSetupCategoryListItemContext must be used with a Set Up Category (list item) Provider")
  }
  return context
}

type TShow = {
  category: BudgetCategory & { events: Array<SetupEvent> };
  currentlyReviewing: boolean;
}

const CategoryShowContext = createContext<TShow | null>(null)

const CategoryShowProvider = (props: { category: BudgetCategory & { events: Array<SetupEvent> }, children?: React.ReactNode }) => {
  const { budgetCategory } = useSetupEventsFormContext()
  const { category } = props

  const value = {
    category,
    currentlyReviewing: category.slug === budgetCategory.slug,
  }

  return (
    <CategoryShowContext.Provider value={value}>
      <KeySpan _key={props.category.key} />

      {props.children}
    </CategoryShowContext.Provider>
  )
}

const useSetUpCategoryShowContext = () => {
  const context = useContext(CategoryShowContext)
  if (!context) {
    throw new Error("useSetUpCategoryShowContext must be used with a Set Up Category Provider")
  }
  return context
}

export {
  CategoryShowProvider as CategoryShow,
  CategoryListItemProvider as CategoryListItemShow,
  useSetupCategoryListItemContext,
  useSetUpCategoryShowContext
}
