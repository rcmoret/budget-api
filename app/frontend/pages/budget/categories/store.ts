import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { BudgetCategoryType } from "@/types/budget";
import { generateKeyIdentifier } from "@frontend/utils/KeyIdentifier";
import { byName as sortByName } from "@/utils/sort-functions";
import {
  isFilterTermActive,
  matchesFilterTerm,
  useFilterTerm,
} from "@/utils/hooks/use-filter-term";

type ExpenseFilterItem = null | "expense" | "revenue";
type CategoryTypeFilterItem = null | "fixed" | "variable";

type BudgetCategoriesState = {
  categories: Array<BudgetCategoryType>;
  expenseOrRevenueFilter: ExpenseFilterItem;
  fixedOrVariableFilter: CategoryTypeFilterItem;
  newCategoryKey: string;
  showArchivedCategories: boolean;
  showFormKey: string | null;

  onDismiss: () => void;
  setCategories: (categories: Array<BudgetCategoryType>) => void;
  setExpenseOrRevenueFilter: (f: ExpenseFilterItem) => void;
  setFixedOrVariableFilter: (f: CategoryTypeFilterItem) => void;
  setShowFormKey: (key: string | null) => void;
  showNewCategoryForm: () => void;
  toggleArchivedCategories: () => void;
};

const useBudgetCategoriesStore = create<BudgetCategoriesState>((set) => ({
  categories: [],
  expenseOrRevenueFilter: null,
  filterTerm: null,
  fixedOrVariableFilter: null,
  newCategoryKey: generateKeyIdentifier(),
  showArchivedCategories: false,
  showFormKey: null,

  onDismiss: () =>
    set({
      newCategoryKey: generateKeyIdentifier(),
      showFormKey: null,
    }),
  setCategories: (categories) => set({ categories }),
  setExpenseOrRevenueFilter: (expenseOrRevenueFilter) =>
    set({ expenseOrRevenueFilter }),
  setFixedOrVariableFilter: (fixedOrVariableFilter) =>
    set({ fixedOrVariableFilter }),
  setShowFormKey: (showFormKey) => set({ showFormKey }),
  showNewCategoryForm: () => set((s) => ({ showFormKey: s.newCategoryKey })),
  toggleArchivedCategories: () =>
    set((s) => ({ showArchivedCategories: !s.showArchivedCategories })),
}));

const sortByFilterTerm =
  (filterTerm: string) => (a: BudgetCategoryType, b: BudgetCategoryType) => {
    if (!isFilterTermActive(filterTerm)) return sortByName(a, b);
    const expression = new RegExp(`^${filterTerm}`, "i");
    const aStarts = expression.test(a.name);
    const bStarts = expression.test(b.name);
    if (aStarts === bStarts) return sortByName(a, b);
    return aStarts ? -1 : 1;
  };

const matchesExpenseOrRevenueFilter = (
  category: BudgetCategoryType,
  expenseOrRevenueFilter: ExpenseFilterItem,
) => {
  if (expenseOrRevenueFilter === null) return true;
  if (expenseOrRevenueFilter === "expense") return category.isExpense;
  return !category.isExpense;
};

const matchesFixedOrVariableFilter = (
  category: BudgetCategoryType,
  fixedOrVariableFilter: CategoryTypeFilterItem,
) => {
  if (fixedOrVariableFilter === null) return true;
  if (fixedOrVariableFilter === "fixed") return category.isMonthly;
  return !category.isMonthly;
};

const useActiveBudgetCategories = () => {
  const categories = useBudgetCategoriesStore((s) => s.categories);
  const expenseOrRevenueFilter = useBudgetCategoriesStore(
    (s) => s.expenseOrRevenueFilter,
  );
  const fixedOrVariableFilter = useBudgetCategoriesStore(
    (s) => s.fixedOrVariableFilter,
  );

  const filterTerm = useFilterTerm();

  return useMemo(
    () =>
      categories
        .filter((c) => !c.archivedAt && matchesFilterTerm(filterTerm, c))
        .filter((c) => matchesExpenseOrRevenueFilter(c, expenseOrRevenueFilter))
        .filter((c) => matchesFixedOrVariableFilter(c, fixedOrVariableFilter))
        .sort(sortByFilterTerm(filterTerm)),
    [categories, filterTerm, expenseOrRevenueFilter, fixedOrVariableFilter],
  );
};

const useArchivedBudgetCategories = (props?: { applyFilter: boolean }) => {
  const categories = useBudgetCategoriesStore((s) => s.categories);
  const expenseOrRevenueFilter = useBudgetCategoriesStore(
    (s) => s.expenseOrRevenueFilter,
  );
  const fixedOrVariableFilter = useBudgetCategoriesStore(
    (s) => s.fixedOrVariableFilter,
  );

  const { applyFilter } = { applyFilter: true, ...props };
  const filterTerm = useFilterTerm();
  return useMemo(() => {
    const allArchivedCategories = categories.filter((c) => c.isArchived);
    if (!applyFilter) {
      return allArchivedCategories;
    } else {
      return allArchivedCategories
        .filter((c) => matchesFilterTerm(filterTerm, c))
        .filter((c) => matchesExpenseOrRevenueFilter(c, expenseOrRevenueFilter))
        .filter((c) => matchesFixedOrVariableFilter(c, fixedOrVariableFilter))
        .sort(sortByFilterTerm(filterTerm));
    }
  }, [categories, filterTerm, expenseOrRevenueFilter, fixedOrVariableFilter]);
};

const useHasArchivedBudgetCategories = () =>
  useArchivedBudgetCategories().length > 0;

const useShowNewCategoryForm = () =>
  useBudgetCategoriesStore((s) => s.showFormKey === s.newCategoryKey);

const useInitBudgetCategoriesStore = (
  categories: Array<BudgetCategoryType>,
) => {
  const setCategories = useBudgetCategoriesStore((s) => s.setCategories);
  const onDismiss = useBudgetCategoriesStore((s) => s.onDismiss);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);
};

export {
  useActiveBudgetCategories,
  useArchivedBudgetCategories,
  useBudgetCategoriesStore,
  useHasArchivedBudgetCategories,
  useInitBudgetCategoriesStore,
  useShowNewCategoryForm,
  type CategoryTypeFilterItem,
  type ExpenseFilterItem,
};
