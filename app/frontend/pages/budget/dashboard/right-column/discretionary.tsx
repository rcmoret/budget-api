import { useBudgetDashboardStore } from "../store";
import { BudgetSummaryComponent } from "@/components/budget-summary";
import { DiscretionaryDetails } from "@/types/budget/discretionary";

const DiscretionarySummary = (props: {
  discretionary: DiscretionaryDetails;
}) => {
  const { discretionary } = props;

  const valueMap = [
    {
      label: "Initial",
      key: "initial",
      amount: discretionary.initialAmount,
    },
    {
      label: "Over/Under Budget",
      key: "overunder",
      amount: discretionary.overUnderBudget,
    },
    {
      label: "Transactions Total",
      key: "txn-total",
      amount: discretionary.transactionsTotal,
    },
    {
      label: "Remaining",
      key: "remaining",
      amount: discretionary.remaining,
    },
  ];

  return <BudgetSummaryComponent label="Discretionary" values={valueMap} />;
};

const Discretionary = () => {
  const discretionary = useBudgetDashboardStore((s) => s.discretionary);

  return <DiscretionarySummary discretionary={discretionary} />;
};

export { Discretionary, DiscretionarySummary };
