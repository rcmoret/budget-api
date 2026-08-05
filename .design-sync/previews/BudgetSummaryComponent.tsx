import { BudgetSummaryComponent } from "@budget/design-system";

const money = (cents: number, display: string) => ({ cents, display });

export const MonthlySummary = () => (
  <div className="w-80">
    <BudgetSummaryComponent
      label="February 2026"
      values={[
        { key: "income", label: "Income", amount: money(482500, "$4,825.00") },
        { key: "fixed", label: "Fixed expenses", amount: money(-268000, "-$2,680.00") },
        { key: "variable", label: "Variable spending", amount: money(-91450, "-$914.50") },
        { key: "remaining", label: "Remaining", amount: money(123050, "$1,230.50") },
      ]}
    />
  </div>
);

export const Overspent = () => (
  <div className="w-80">
    <BudgetSummaryComponent
      label="January 2026"
      values={[
        { key: "income", label: "Income", amount: money(482500, "$4,825.00") },
        { key: "fixed", label: "Fixed expenses", amount: money(-268000, "-$2,680.00") },
        { key: "variable", label: "Variable spending", amount: money(-241900, "-$2,419.00") },
        { key: "remaining", label: "Remaining", amount: money(-27400, "-$274.00") },
      ]}
    />
  </div>
);
