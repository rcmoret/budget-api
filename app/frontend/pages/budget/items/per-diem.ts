const DAYS_PER_WEEK = 7;

type PerDiemAmounts = {
  budgetedPerDay: number;
  remainingPerDay: number;
  // only present when at least a week remains
  perWeek: null | {
    budgeted: number;
    remaining: number;
  };
};

// Integer cents throughout; division truncates toward zero.
const divide = (cents: number, days: number) => Math.trunc(cents / days);

// Budgeted amounts are spread over the whole month, remaining amounts over
// the days left. Returns null when no days remain (past months).
const perDiemAmounts = (props: {
  amount: number;
  remaining: number;
  totalDays: number;
  daysRemaining: number;
}): PerDiemAmounts | null => {
  const { amount, remaining, totalDays, daysRemaining } = props;

  if (daysRemaining <= 0 || totalDays <= 0) return null;

  const perWeek =
    daysRemaining >= DAYS_PER_WEEK
      ? {
          budgeted: divide(amount * DAYS_PER_WEEK, totalDays),
          remaining: divide(remaining * DAYS_PER_WEEK, daysRemaining),
        }
      : null;

  return {
    budgetedPerDay: divide(amount, totalDays),
    remainingPerDay: divide(remaining, daysRemaining),
    perWeek,
  };
};

export { perDiemAmounts, type PerDiemAmounts };
