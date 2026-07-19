import { BudgetSummaryComponent } from "@/components/budget-summary";
import { useSetupGroups } from "@/pages/budget/planning/setup/store";
import { inputAmount } from "@/lib/adjustment-amount-store";

const SetupBudgetSummary = () => {
  const { revenues, fixedExpenses, variableExpenses } = useSetupGroups();

  const budgetBalance = [revenues, fixedExpenses, variableExpenses].reduce(
    (sum, group) => {
      return sum + group.metadata.sum.cents;
    },
    0,
  );
  const summaryValues = [
    {
      key: revenues.key,
      label: revenues.label,
      amount: revenues.metadata.sum,
    },
    {
      key: fixedExpenses.key,
      label: fixedExpenses.label,
      amount: fixedExpenses.metadata.sum,
    },
    {
      key: variableExpenses.key,
      label: variableExpenses.label,
      amount: variableExpenses.metadata.sum,
    },
    {
      key: "balance",
      label: "Balance",
      amount: inputAmount({ cents: budgetBalance }),
    },
  ];

  return <BudgetSummaryComponent label="Summary" values={summaryValues} />;
};

export { SetupBudgetSummary };
