import { createContext, useContext } from "react";
import { TBudgetItem } from "@/types/budget";
import { useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";

type HookProps = {
  index: number;
  item: TBudgetItem;
}

type TBudgetDashboardItemContext = {
  index: number;
  isHidden: boolean;
  item: TBudgetItem;
}

const BudgetDashboardItemContext = createContext<TBudgetDashboardItemContext | null>(null)

const BudgetDashboardItemProvider = (props: HookProps & { children: React.ReactNode }) => {
  const { children, ...rest } = props
  const { isHiddenAccrual, isHiddenDeleted } = useBudgetDashboardContext()

  const value = {
    ...rest,
    isHidden: isHiddenDeleted(props.item) || isHiddenAccrual(props.item),
  }

  return (
    <BudgetDashboardItemContext.Provider value={value}>
      {children}
    </BudgetDashboardItemContext.Provider>
  )
}

const useBudgetDashboardItemContext = () => {
  const context = useContext(BudgetDashboardItemContext);
  if (!context) {
    throw new Error("useBudgetDashboardItemContext must be used within a Budget Dashboard Item Context Provider")
  }
  return context;
}

export { BudgetDashboardItemProvider, useBudgetDashboardItemContext }
