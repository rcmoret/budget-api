import { useContext, useState, useEffect } from "react";
import { BudgetData, BudgetItem, TBudgetItem, DiscretionaryData, SelectBudgetCategory } from "@/types/budget";
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
import { useDraftEvents } from "@/lib/hooks/useDraftEvents";
import { AdjustForm } from "@/pages/budget/item_components/AdjustForm";
import {
  Column,
  ClearedMonthlyItemsSections,
  DayToDayItemsSection,
  PendingMonthlyItemsSection,
  Section,
} from "@/pages/budget/items";
import { FilterComponent } from "@/pages/budget/filter"
import { Discretionary } from "@/pages/budget/discretionary";
import { AccountSummary } from "@/types/account";

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

export type ItemCollection = {
  collection: TBudgetItem[],
  hidden: {
    accruals: number,
    deleted: number
  }
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
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const { data, discretionary, draft, categories } = props
  const { month, year } = data
  const { showAccruals, showDeletedItems } = appConfig.budget
  const { items, ...form } = useDraftEvents({
    items: props.items,
    draft,
    month,
    year
  })

  const itemsWithVisibleAccruals = (item: BudgetItem) => accrualFilter({ item, showAccruals, month, year })
  const itemsWithVisibleDeleted = (item: BudgetItem) => (!item.isDeleted || showDeletedItems)

  const applyFilters = (items: Array<BudgetItem>, filters: Array<(i: BudgetItem) => boolean>): Array<TBudgetItem> => {
    const initialArray: Array<TBudgetItem> = []
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

  const [filterTerm, setFilterTerm] = useState<string>("")
  const filterActive = filterTerm.length > 2

  const searchTermFilter = (item: BudgetItem): boolean => {
    if (!filterActive) { return true }

    const expression = new RegExp(filterTerm, "i")

    return !!item.name.match(expression)
  }

  const clearedMonthlyExpenseItems = decorateCollection(applyFilters(items, [clearedItems, expenseItems, searchTermFilter]))
  const clearedMonthlyRevenueItems = decorateCollection(applyFilters(items, [clearedItems, revenueItems, searchTermFilter]))
  const dayToDayRevenueItems = decorateCollection(applyFilters(items, [dayToDayItems, revenueItems, searchTermFilter]))
  const dayToDayExpenseItems = decorateCollection(applyFilters(items, [dayToDayItems, expenseItems, searchTermFilter]))
  const pendingMonthlyExpenseItems = decorateCollection(applyFilters(items, [pendingItems, expenseItems, searchTermFilter]))
  const pendingMonthlyRevenueItems = decorateCollection(applyFilters(items, [pendingItems, revenueItems, searchTermFilter]))

  useEffect(() => {
    setAppConfig({
      ...appConfig,
      accounts: appConfig.accounts ||  props.accounts,
      budget: {
        ...appConfig.budget,
        data,
        discretionary,
        categories
      }
    })
  }, [])

  const adjustItems = form.draftItems.filter((i) => !i.isNewItem)
  const monthlyCategories = categories.filter((category) => category.isMonthly)
  const dayToDayCategories = categories.filter((category) => {
    if (category.isMonthly) { return false }


    const keys = [
      ...items.map((item) => item.budgetCategoryKey),
      ...form.changes.map((c) => c.budgetCategoryKey)
    ]
    return !keys.includes(category.key)
  })

  return (
    <>
      <AdjustForm
        newDraftItems={form.newItems}
        adjustItems={adjustItems}
        discretionary={form.discretionary}
        existingItems={items}
        changes={form.changes}
        processing={form.processing}
        postEvents={form.post}
      />
      <FilterComponent filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
      <Column
        title="Day-to-Day"
        categories={dayToDayCategories}
        addChange={form.addChange}
        newItems={form.newItems.filter((i) => !i.isMonthly)}
        updateChange={form.updateChange}
        changes={form.changes}
        removeChange={form.removeChange}
        postEvent={form.post}
        processing={form.processing}
      >
        <Section title="Discretionary">
          <Discretionary data={discretionary} />
        </Section>
        <div className="w-full h-0.5 my-2 px-4">
          <div className="bg-gray-300 h-full w-full"></div>
        </div>
        <DayToDayItemsSection
          title="Revenues"
          items={dayToDayRevenueItems}
          form={form}
        />
        <div className="w-full h-0.5 my-2 px-4">
          <div className="bg-gray-300 h-full w-full"></div>
        </div>
        <DayToDayItemsSection
          title="Expenses"
          items={dayToDayExpenseItems}
          form={form}
        />
      </Column>
      <Column
        title="Monthly"
        categories={monthlyCategories}
        addChange={form.addChange}
        updateChange={form.updateChange}
        changes={form.changes}
        newItems={form.newItems.filter((i) => i.isMonthly)}
        removeChange={form.removeChange}
        postEvent={form.post}
        processing={form.processing}
      >
        <PendingMonthlyItemsSection
          title="Revenues"
          items={pendingMonthlyRevenueItems}
          form={form}
        />
        <div className="w-full h-0.5 my-2 px-4">
          <div className="bg-gray-300 h-full w-full"></div>
        </div>
        <PendingMonthlyItemsSection
          title="Expenses"
          items={pendingMonthlyExpenseItems}
          form={form}
        />
        <ClearedMonthlyItemsSections
          clearedMonthlyExpenseItems={clearedMonthlyExpenseItems}
          clearedMonthlyRevenueItems={clearedMonthlyRevenueItems}
          form={form}
        />
      </Column>
    </>
  )
};

export default BudgetComponent;
