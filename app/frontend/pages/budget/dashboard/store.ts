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

// "name" is the default ordering the server sends; sorting by it locally
// restores that ordering without a trip to the backend.
type SortField = "name" | "amount" | "remaining" | "difference" | "spent";
type SortDirection = "asc" | "desc";

const compareBudgetItems = (
  a: BudgetItem,
  b: BudgetItem,
  field: SortField,
  direction: SortDirection,
): number => {
  const modifier = direction === "asc" ? 1 : -1;

  if (field === "name") {
    // Mirror the server's `by_name` scope (`order("LOWER(name) asc")`) so the
    // local name sort matches what the backend sends.
    return (
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()) * modifier
    );
  }

  // Items are grouped by expenses (negative) and revenues (positive), so
  // compare on magnitude to keep the ordering consistent across groups.
  const aValue = Math.abs(a[field].cents);
  const bValue = Math.abs(b[field].cents);
  return (aValue - bValue) * modifier;
};

const sortBudgetItemCollections = (
  items: BudgetItemCollections,
  field: SortField,
  direction: SortDirection,
): BudgetItemCollections => {
  const comparator = (a: BudgetItem, b: BudgetItem) =>
    compareBudgetItems(a, b, field, direction);

  return {
    fixedExpenses: [...items.fixedExpenses].sort(comparator),
    variableExpenses: [...items.variableExpenses].sort(comparator),
    fixedRevenues: [...items.fixedRevenues].sort(comparator),
    variableRevenues: [...items.variableRevenues].sort(comparator),
  };
};

type BudgetDashboardState = {
  items: BudgetItemCollections;
  discretionary: DiscretionaryDetails;
  expenseOrRevenueFilter: ExpenseFilterItem;
  fixedOrVariableFilter: FixedOrVariableFilterType;
  clearedItemVisibilityToggle: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  setExpenseOrRevenueFilter: (f: ExpenseFilterItem) => void;
  setFixedOrVariableFilter: (f: FixedOrVariableFilterType) => void;
  setItems: (items: BudgetItemCollections) => void;
  setDiscretionary: (discretionary: DiscretionaryDetails) => void;
  toggleItemVisibility: (b: boolean) => void;
  sortItems: (field: SortField, direction: SortDirection) => void;
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
  sortField: "name",
  sortDirection: "asc",

  setDiscretionary: (discretionary) => set({ discretionary }),

  // Keep incoming items in the currently active ordering so a data refresh
  // doesn't reset the user's chosen sort.
  setItems: (items) =>
    set((state) => ({
      items: sortBudgetItemCollections(
        items,
        state.sortField,
        state.sortDirection,
      ),
    })),

  setExpenseOrRevenueFilter: (expenseOrRevenueFilter) =>
    set({ expenseOrRevenueFilter }),

  setFixedOrVariableFilter: (fixedOrVariableFilter) =>
    set({ fixedOrVariableFilter }),
  toggleItemVisibility: () =>
    set({ clearedItemVisibilityToggle: !get().clearedItemVisibilityToggle }),

  sortItems: (sortField, sortDirection) =>
    set((state) => ({
      sortField,
      sortDirection,
      items: sortBudgetItemCollections(state.items, sortField, sortDirection),
    })),
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
  type SortField,
  type SortDirection,
};
