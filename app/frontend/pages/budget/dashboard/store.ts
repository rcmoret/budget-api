import { create } from "zustand";
import { BudgetItem, BudgetItemCollections } from "@/types/budget";
import { BudgetMonthData } from "@/types/budget/month-data";
import { DiscretionaryDetails } from "@/types/budget/discretionary";
import { useEffect } from "react";

type ItemGroupLabels = ["Fixed" | "Variable", "Expenses" | "Revenues"];
type ExpenseFilterItem = "expense" | "revenue" | null;
type FixedOrVariableFilterType = "fixed" | "variable" | null;
type FilterKeys = {
  frequency: Exclude<FixedOrVariableFilterType, null>;
  type: Exclude<ExpenseFilterItem, null>;
};

type BudgetDashboardState = {
  items: BudgetItemCollections;
  discretionary: DiscretionaryDetails;
  expenseOrRevenueFilter: ExpenseFilterItem;
  fixedOrVariableFilter: FixedOrVariableFilterType;
  clearedItemVisibilityToggle: boolean;
  setExpenseOrRevenueFilter: (f: ExpenseFilterItem) => void;
  setFixedOrVariableFilter: (f: FixedOrVariableFilterType) => void;
  setItems: (items: BudgetItemCollections) => void;
  setDiscretionary: (discretionary: DiscretionaryDetails) => void;
  toggleItemVisibility: (b: boolean) => void;
};

const useBudgetDashboardStore = create<BudgetDashboardState>((set, get) => ({
  itemFormKey: null,
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
  clearedItemVisibilityToggle: false,
  expenseOrRevenueFilter: null,
  fixedOrVariableFilter: null,

  setDiscretionary: (discretionary) => set({ discretionary }),
  setItems: (items) => set({ items }),

  setExpenseOrRevenueFilter: (expenseOrRevenueFilter) =>
    set({ expenseOrRevenueFilter }),

  setFixedOrVariableFilter: (fixedOrVariableFilter) =>
    set({ fixedOrVariableFilter }),
  toggleItemVisibility: () =>
    set({ clearedItemVisibilityToggle: !get().clearedItemVisibilityToggle }),
}));

type ItemGroup = {
  items: Array<BudgetItem>;
  labels: ItemGroupLabels;
  visible: boolean;
};

const useBudgetItemGroups = (props: FilterKeys): ItemGroup => {
  const items = useBudgetDashboardStore((s) => s.items);
  const { frequency, type } = props;

  const expenseOrRevenueFilter = useBudgetDashboardStore(
    (s) => s.expenseOrRevenueFilter,
  );
  const fixedOrVariableFilter = useBudgetDashboardStore(
    (s) => s.fixedOrVariableFilter,
  );

  const typeMatches =
    expenseOrRevenueFilter === null || expenseOrRevenueFilter === type;
  const frequencyMatches =
    fixedOrVariableFilter === null || fixedOrVariableFilter === frequency;
  const visible = typeMatches && frequencyMatches;

  if (frequency === "fixed" && type === "revenue") {
    return {
      items: items.fixedRevenues,
      visible,
      labels: ["Fixed", "Revenues"],
    };
  } else if (frequency === "fixed") {
    return {
      items: items.fixedExpenses,
      labels: ["Fixed", "Expenses"],
      visible,
    };
  } else if (type === "revenue") {
    return {
      items: items.variableRevenues,
      labels: ["Variable", "Revenues"],
      visible,
    };
  } else {
    return {
      items: items.variableExpenses,
      labels: ["Variable", "Expenses"],
      visible,
    };
  }
};

const useInitBudgetDashboardStore = (props: {
  items: BudgetItemCollections;
  budgetMonth: BudgetMonthData;
}) => {
  const { items } = props;

  const setItems = useBudgetDashboardStore((s) => s.setItems);

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);
};

const useClearedItemsVisibilityToggle = () => {
  const value = useBudgetDashboardStore((s) => s.clearedItemVisibilityToggle);
  const toggleFn = useBudgetDashboardStore((s) => s.toggleItemVisibility);

  return [value, () => toggleFn(!value)] as const;
};

export {
  useBudgetDashboardStore,
  useBudgetItemGroups,
  useInitBudgetDashboardStore,
  useClearedItemsVisibilityToggle,
  type ExpenseFilterItem,
  type FixedOrVariableFilterType,
  type ItemGroup,
};
