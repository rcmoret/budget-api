import { create } from "zustand";
import { BudgetItem, BudgetItemCollections } from "@/types/budget";
import { BudgetMonthData } from "@/types/budget/month-data";
import { DiscretionaryDetails } from "@/types/budget/discretionary";
import { useEffect } from "react";

type ItemGroupLabels = ["Fixed" | "Variable", "Expenses" | "Revenues"]
type ExpenseFilterItem = "expense" | "revenue" | null;
type FixedOrVariableFilterType = "fixed" | "variable" | null;
type FilterKeys = {
  frequency: Exclude<FixedOrVariableFilterType, null>
  type: Exclude<ExpenseFilterItem, null>
}

const emptyBudgetMonth: BudgetMonthData = {
  month: 0,
  monthName: "",
  year: 0,
  totalDays: 0,
  daysRemaining: 0,
  isCurrent: false,
  firstDate: "",
  lastDate: "",
  previousMonth: {
    month: 0,
    year: 0,
    monthName: "",
    href: ""
  },
  nextMonth: {
    month: 0,
    year: 0,
    monthName: "",
    href: ""
  }
}

type BudgetDashboardState = {
  budgetMonth: BudgetMonthData;
  items: BudgetItemCollections;
  discretionary: DiscretionaryDetails;
  expenseOrRevenueFilter: ExpenseFilterItem;
  filterTerm: string | null;
  fixedOrVariableFilter: FixedOrVariableFilterType;
  clearedItemVisibilityToggle: boolean;
  setExpenseOrRevenueFilter: (f: ExpenseFilterItem) => void;
  setFilterTerm: (term: string | null) => void;
  setFixedOrVariableFilter: (f: FixedOrVariableFilterType) => void;
  setItems: (items: BudgetItemCollections) => void;
  setBudgetMonth: (budgetMonth: BudgetMonthData) => void;
  setDiscretionary: (discretionary: DiscretionaryDetails) => void;
  toggleItemVisibility: (b: boolean) => void;
}

const useBudgetDashboardStore = create<BudgetDashboardState>((set) => ({
  items: {
    fixedExpenses: [],
    variableExpenses: [],
    fixedRevenues: [],
    variableRevenues: [],
  },
  discretionary: {
    initialAmount: { display: "", cents: 0 },
    overUnderBudget: { display: "", cents: 0 },
    remaining: { display: "", cents: 0 },
    transactionsTotal: { display: "", cents: 0 },
  },
  budgetMonth: emptyBudgetMonth,
  clearedItemVisibilityToggle: false,
  expenseOrRevenueFilter: null,
  filterTerm: null,
  fixedOrVariableFilter: null,

  setBudgetMonth: (budgetMonth) => set({ budgetMonth }),
  setDiscretionary: (discretionary) => set({ discretionary }),
  setItems: (items) => set({ items }),

  setExpenseOrRevenueFilter: (expenseOrRevenueFilter) =>
    set({ expenseOrRevenueFilter }),

  setFilterTerm: (filterTerm) => set({ filterTerm }),
  setFixedOrVariableFilter: (fixedOrVariableFilter) =>
    set({ fixedOrVariableFilter }),
  toggleItemVisibility: (bool) => set({ clearedItemVisibilityToggle: bool }),
}))

type ItemGroup = {
  items: Array<BudgetItem>;
  labels: ItemGroupLabels;
  visible: boolean;
}

const useBudgetItemGroups = (props: FilterKeys): ItemGroup => {
  const items = useBudgetDashboardStore((s) => s.items);
  const { frequency, type } = props

  const expenseOrRevenueFilter = useBudgetDashboardStore(
    (s) => s.expenseOrRevenueFilter,
  );
  const fixedOrVariableFilter = useBudgetDashboardStore(
    (s) => s.fixedOrVariableFilter,
  );

  const typeMatches = expenseOrRevenueFilter === null || expenseOrRevenueFilter === type
  const frequencyMatches = fixedOrVariableFilter === null || fixedOrVariableFilter === frequency
  const visible = typeMatches && frequencyMatches

  if (frequency === "fixed" && type === "revenue") {
    return {
      items: items.fixedRevenues,
      visible,
      labels: ["Fixed", "Revenues"],
    }
  } else if (frequency === "fixed") {
    return {
      items: items.fixedExpenses,
      labels: ["Fixed", "Expenses"],
      visible,
    }
  } else if (type === "revenue") {
    return {
      items: items.variableRevenues,
      labels: ["Variable", "Revenues"],
      visible,
    }
  } else {
    return {
      items: items.variableExpenses,
      labels: ["Variable", "Expenses"],
      visible,
    }
  }
}

const useVisibleBudgetItems = () => {
  return useBudgetDashboardStore((s) => s.items);
}

const useInitBudgetDashboardStore = (props: { items: BudgetItemCollections, budgetMonth: BudgetMonthData }) => {
  const { items, budgetMonth } = props

  const setItems = useBudgetDashboardStore((s) => s.setItems)
  const setBudgetMonth = useBudgetDashboardStore((s) => s.setBudgetMonth)

  useEffect(() => {
    setItems(items);
  }, [items, setItems])
  useEffect(() => {
    setBudgetMonth(budgetMonth);
  }, [budgetMonth, setBudgetMonth])
}

const useClearedItemsVisibilityToggle = () => {
  const value = useBudgetDashboardStore((s) => s.clearedItemVisibilityToggle)
  const toggleFn = useBudgetDashboardStore((s) => s.toggleItemVisibility)

  return [value, () => toggleFn(!value)] as const
}

export { useBudgetDashboardStore, useBudgetItemGroups, useInitBudgetDashboardStore, useVisibleBudgetItems, type ExpenseFilterItem, useClearedItemsVisibilityToggle }
