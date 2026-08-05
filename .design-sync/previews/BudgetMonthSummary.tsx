import { BudgetMonthSummary, useBudgetMonthStore } from "@budget/design-system";

// Reads the budget-month store rather than taking props, so the preview seeds
// it. Only ONE cell here on purpose: the store is a single global, so sibling
// cells on the same card would all render whichever state was set last. The
// current-month state is the richer one — it adds the days-remaining line and
// the secondary progress bar that a past month omits.
useBudgetMonthStore.setState({
  budgetMonth: {
    month: 2,
    monthName: "February",
    year: 2026,
    totalDays: 28,
    daysRemaining: 11,
    isCurrent: true,
    firstDate: "2026-02-01",
    lastDate: "2026-02-28",
    isSetUp: true,
    setupRoute: "/budget/2026/02/setup",
    previousMonth: { month: 1, year: 2026, monthName: "January", href: "/budget/2026/01" },
    nextMonth: { month: 3, year: 2026, monthName: "March", href: "/budget/2026/03" },
  },
});

export const CurrentMonth = () => (
  <div className="w-80"><BudgetMonthSummary /></div>
);
