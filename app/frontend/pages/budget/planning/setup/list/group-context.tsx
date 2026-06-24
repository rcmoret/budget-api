import { useContext, createContext } from "react";

import { CategoryGroup } from "@/types/budget/planning/setup";

const CategoryGroupContext = createContext<null | CategoryGroup>(null)

const CategoryGroupProvider = (props: { group: CategoryGroup; children: React.ReactNode }) => {
  const { children, group } = props

  return (
    <CategoryGroupContext.Provider value={group}>
      {children}
    </CategoryGroupContext.Provider >
  )
}

const useCategoryGroupContext = () => {
  const context = useContext(CategoryGroupContext)

  if (!context) {
    throw new Error(
      "useCategoryGroupContext must be used within CategoryGroupProvider"
    )
  }

  return context
}

export { CategoryGroupProvider, useCategoryGroupContext }
