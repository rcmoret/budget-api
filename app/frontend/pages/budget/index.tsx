import { useContext, useEffect } from "react";
import { BudgetData, BudgetItem, DiscretionaryData } from "@/types/budget";
import { Items as ItemsComponent } from "@/pages/budget/items";
import { AppConfigContext } from "@/components/layout/Provider";
import {
  accrualFilter,
  clearedItems,
  dayToDayItems,
  expenseItems,
  pendingItems,
  revenueItems,
  sortByName,
} from "@/lib/models/budget-items"

interface ComponentProps {
  data: BudgetData;
  discretionary: DiscretionaryData;
  items: BudgetItem[];
}

export type ItemCollection = {
  collection: BudgetItem[],
  hidden: {
    accruals: number,
    deleted: number
  }
}

const BudgetComponent = (props: ComponentProps) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const { data, discretionary, items } = props
  const { month, year } = data
  const { showAccruals, showDeletedItems } = appConfig.budget

  const itemsWithVisibleAccruals = (item: BudgetItem) => accrualFilter({ item, showAccruals, month, year })
  const itemsWithVisibleDeleted = (item: BudgetItem) => (!item.isDeleted || showDeletedItems)

  const applyFilters = (items: Array<BudgetItem>, filters: Array<(i: BudgetItem) => boolean>) => {
    const initialArray: Array<BudgetItem> = []
    return items.reduce((arr, item) => {
      return filters.every((filter) => filter(item)) ? [...arr, item] : arr
    }, initialArray)
  }

  const decorateCollection = (items: Array<BudgetItem>): ItemCollection => {
    return {
      collection: applyFilters(items, [itemsWithVisibleDeleted, itemsWithVisibleAccruals]).sort(sortByName),
      hidden: {
        accruals: items.filter((item) => !itemsWithVisibleAccruals(item)).length,
        deleted: items.filter((item) => !itemsWithVisibleDeleted(item)).length
      }
    }
  }

  const clearedMonthlyExpenseItems = decorateCollection(applyFilters(items, [clearedItems, expenseItems]))
  const clearedMonthlyRevenueItems = decorateCollection(applyFilters(items, [clearedItems, revenueItems]))
  const dayToDayRevenueItems = decorateCollection(applyFilters(items, [dayToDayItems, revenueItems]))
  const dayToDayExpenseItems = decorateCollection(applyFilters(items, [dayToDayItems, expenseItems]))
  const pendingMonthlyExpenseItems = decorateCollection(applyFilters(items, [pendingItems, expenseItems]))
  const pendingMonthlyRevenueItems = decorateCollection(applyFilters(items, [pendingItems, revenueItems]))

  useEffect(() => {
    setAppConfig({ ...appConfig, budget: { ...appConfig.budget, data } })
  }, [])

  return (
    <ItemsComponent
      data={discretionary}
      clearedMonthlyExpenseItems={clearedMonthlyExpenseItems}
      clearedMonthlyRevenueItems={clearedMonthlyRevenueItems}
      dayToDayExpenseItems={dayToDayExpenseItems}
      dayToDayRevenueItems={dayToDayRevenueItems}
      pendingMonthlyExpenseItems={pendingMonthlyExpenseItems}
      pendingMonthlyRevenueItems={pendingMonthlyRevenueItems}
    />
  )
};

export default BudgetComponent;
