export interface AccountBudgetSummary {
  isCurrent: boolean;
  totalDays: number;
  firstDate: string;
  lastDate: string;
  daysRemaining: number;
  month: number;
  year: number;
}
