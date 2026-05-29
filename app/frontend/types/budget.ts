type BudgetMonthData = {
  month: number;
  year: number;
  totalDays: number;
  daysRemaining: number;
  startDate: string;
  endDate: string;
};

type BudgetCategoryType = {
  key: string;
  objectKey: string;
  archivedAt: string | null;
  createdAt: string;
  defaultAmount: number;
  isAccrual: boolean;
  isArchived: boolean;
  isExpense: boolean;
  isMonthly: boolean;
  name: string;
  slug: string;
};

type NewBudgetCategoryType = {
  key: string;
  objectKey: string;
  archivedAt: string | null;
  createdAt: string;
  defaultAmount: number | null;
  isAccrual: boolean;
  isArchived: boolean;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  name: string;
  slug: string;
};

export {
  type BudgetMonthData,
  type BudgetCategoryType,
  type NewBudgetCategoryType,
};
