type BudgetMonthData = {
  month: number;
  monthName: string;
  year: number;
  totalDays: number;
  daysRemaining: number;
  firstDate: string;
  lastDate: string;
  isCurrent: boolean;
  isSetUp: boolean;
  setupRoute: string;
  nextMonth: {
    month: number;
    monthName: string;
    href: string;
    year: number;
  };
  previousMonth: {
    month: number;
    monthName: string;
    href: string;
    year: number;
  };
};

export { type BudgetMonthData };
