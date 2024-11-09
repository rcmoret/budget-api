import { AccountBudgetSummary, BudgetItem } from "@/types/budget";
import { AccountTransaction } from "@/types/transaction";

export interface AccountSummary {
  name: string;
  key: string;
  slug: string;
  balance: number;
  priority: number;
  isArchived: boolean;
}

export interface AccountShow {
  name: string;
  key: string;
  slug: string;
  balance: number;
  priority: number;
  isArchived: boolean;
  isCashFlow: boolean;
  budget: AccountBudgetSummary;
  transactions: AccountTransaction[];
  balancePriorTo: number;
  metadata: {
    daysRemaining: number;
    firstDate: string;
    isCurrent: boolean;
    items: Array<BudgetItem>
    lastDate: string;
    month: number;
    totalDays: number;
    year: number;
  }
}

export interface AccountManage {
  key: string;
  name: string;
  slug: string;
  archivedAt: string;
  createdAt: string;
  isArchived: boolean;
  isCashFlow: boolean;
  priority: number;
}
