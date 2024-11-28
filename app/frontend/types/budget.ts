import { IconName } from "@/components/common/Icon";

export interface AccountBudgetSummary {
  isCurrent: boolean;
  totalDays: number;
  firstDate: string;
  lastDate: string;
  daysRemaining: number;
  month: number;
  year: number;
}

export interface BudgetData extends AccountBudgetSummary {
  isClosedOut: boolean;
  isSetUp: boolean;
  items: Array<BudgetItem>;
}

export interface DiscretionaryData {
  amount: number;
  overUnderBudget: number;
  transactionDetails: BudgetItemTransaction[];
  transactionsTotal: number;
}

export type SelectedAccount = {
  metadata: AccountBudgetSummary;
  slug: string;
  name: string;
}

export type BudgetItemTransaction = {
  key: string;
  accountName: string;
  amount: number;
  description: string;
  comparisonDate: string;
  clearanceDate: null | string;
}

export type BudgetItemEvent = {
  key: string;
  amount: number;
  data: string | null;
  createdAt: string;
  comparisonDate: string;
  typeName: string;
}

export type BudgetItem = {
  key: string,
  name: string,
  amount: number,
  budgetCategoryKey: string,
  difference: number,
  iconClassName: IconName,
  isAccrual: boolean,
  isDeletable: boolean,
  isDeleted: boolean,
  isExpense: boolean,
  isMonthly: boolean,
  isPerDiemEnabled: boolean,
  maturityMonth?: number
  maturityYear?: number
  remaining: number,
  spent: number,
  transactionDetails: Array<BudgetItemTransaction>,
  events: Array<BudgetItemEvent>
}

export type BudgetItemDetail = BudgetItemEvent | BudgetItemTransaction

export type BudgetCategory = {
  key: string;
  name: string;
  slug: string;
  archivedAt: string | null;
  defaultAmount?: number;
  iconClassName: IconName;
  iconKey: string;
  isAccrual: boolean;
  isArchived: boolean;
  isExpense: boolean;
  isMonthly: boolean;
  isPerDiemEnabled: boolean;
  maturityIntervals?: Array<{
    month: number;
    year: number;
  }>
}

export interface TEvent {
  key: string;
  budgeted: number;
  data?: any;
  eventType: "setup_item_create" | "setup_item_adjust" | "setup_item_delete";
  spent: number;
  budgetItemKey?: string;
  budgetCategoryKey?: string;
  month?: number;
  year?: number;
}

export interface TBudgetItem extends BudgetItem {
  draftItem?: {
    key: string;
    name: string;
    amount: number;
    budgetCategoryKey: string;
    budgetCategoryName: string;
    difference: number;
    isNewItem: boolean;
    remaining: number;
    spent: number
  };
  change?: DraftChange;
}

export type SelectBudgetCategory ={
  key: string;
  name: string;
  slug: string;
  defaultAmount: number;
  isAccrual: boolean;
  isExpense: boolean;
  isMonthly: boolean;
}
