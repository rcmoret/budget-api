import { MonetaryAmount } from "@/types/amount";
import { BudgetItemEvent, BudgetItemCreateEventType } from "./events"
import { IconName } from "@/components/icon";
import { DiscretionaryDetails } from "@/types/budget/discretionary";
import { BudgetMonthData } from "./month-data";

type BudgetItem = {
  amount: MonetaryAmount;
  budgetCategoryKey: string;
  currentlyBudgeted: MonetaryAmount;
  currentlyBudgetedPercentage: number;
  difference: MonetaryAmount;
  iconClassName: IconName;
  isAccrual: boolean;
  isCleared: boolean;
  isDeleted: boolean;
  isExpense: boolean;
  isFixed: boolean;
  isMature: boolean;
  isPending: boolean;
  isPerDiemEnabled: boolean;
  key: string;
  name: string;
  objectKey: string;
  previouslyBudgeted: MonetaryAmount;
  previouslyBudgetedPercentage: number;
  remaining: MonetaryAmount;
  spent: MonetaryAmount
  transactionDetailTotal: MonetaryAmount;
}

type BudgetItemCollections = {
  fixedExpenses: Array<BudgetItem>;
  variableExpenses: Array<BudgetItem>;
  fixedRevenues: Array<BudgetItem>;
  variableRevenues: Array<BudgetItem>;
}

type BudgetMonthIndex = {
  budgetMonth: BudgetMonthData;
  discretionary: DiscretionaryDetails;
  items: BudgetItemCollections;
  createItemEvents: Array<BudgetItemEvent<BudgetItemCreateEventType>>
}

type BudgetCategoryType = {
  key: string;
  objectKey: string;
  archivedAt: string | null;
  createdAt: string;
  defaultAmount: number;
  iconClassName: IconName;
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
  iconClassName: IconName;
  isAccrual: boolean;
  isArchived: boolean;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  name: string;
  slug: string;
};

export {
  type BudgetItem,
  type BudgetItemCollections,
  type BudgetMonthIndex,
  type BudgetCategoryType,
  type NewBudgetCategoryType,
};
