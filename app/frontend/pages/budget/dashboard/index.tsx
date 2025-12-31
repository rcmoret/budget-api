import { useEffect } from "react";
import { BudgetDashboardProvider, useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";
import { BudgetData, BudgetItem, DiscretionaryData, SelectBudgetCategory } from "@/types/budget";
import { useAppConfigContext } from "@/components/layout/Provider";
import { useDraftEvents } from "@/lib/hooks/useDraftEvents";
import { AdjustForm } from "@/pages/budget/item_components/AdjustForm";
import { FilterComponent as BaseFilterComponent } from "@/pages/budget/filter"
import { AccountSummary } from "@/types/account";
import { DayToDayColumn, MonthlyColumn } from "@/pages/budget/dashboard/columns";

const FilterComponent = () => {
  const { itemFilter }  = useBudgetDashboardContext()

  return (
    <BaseFilterComponent
      filterTerm={itemFilter.term}
      setFilterTerm={itemFilter.setTerm}
    />
  )
}

export type DraftItem = {
  key: string;
  amount: number; 
  budgetCategoryKey: string;
  budgetCategoryName: string;
  isMonthly: boolean;
  difference: number;
  isNewItem: boolean;
  name: string;
  remaining: number;
  spent: number;
}

interface ComponentProps {
  data: BudgetData;
  categories: Array<SelectBudgetCategory>;
  discretionary: DiscretionaryData;
  items: BudgetItem[];
  accounts: Array<AccountSummary>;
  draft?: {
    items: Array<DraftItem>;
    discretionary: {
      amount: number,
      overUnderBudget: number,
    }
  }
}

const BudgetComponent = (props: ComponentProps) => {
  const { appConfig, setAppConfig } = useAppConfigContext()
  const { data, discretionary, draft, categories } = props
  const { month, year } = data
  const { items, ...form } = useDraftEvents({
    items: props.items,
    draft,
    month,
    year
  })

  useEffect(() => {
    setAppConfig({
      ...appConfig,
      accounts: appConfig.accounts.length ? appConfig.accounts : props.accounts,
      budget: {
        ...appConfig.budget,
        data,
        discretionary,
        categories
      }
    })
  }, [])

  return (
    <BudgetDashboardProvider
      categories={categories}
      discretionary={discretionary}
      items={items}
      form={{ ...form, items }}
    >
      <AdjustForm />
      <FilterComponent />
      <DayToDayColumn />
      <MonthlyColumn />
    </BudgetDashboardProvider>
  )
};

export default BudgetComponent;
