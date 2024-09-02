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
}

export interface DiscretionaryData {
  amount: number;
  overUnderBudget: number;
  // transactionDetails:
  transactionsTotal: number;
}

export type SelectedAccount = {
  metadata: AccountBudgetSummary;
  slug: string;
  name: string;
}
