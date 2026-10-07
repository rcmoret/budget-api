import { BudgetMonthSummary } from "@/components/budget-month";
import { DiscretionarySummary } from "@/pages/budget/dashboard/right-column/discretionary";
import { DiscretionaryDetails } from "@/types/budget/discretionary";

const RightColumn = (props: { discretionary: DiscretionaryDetails }) => {
  return (
    <div className="grid gap-4">
      <BudgetMonthSummary />
      <div className="pt-4 border-t border-neutral">
        <DiscretionarySummary discretionary={props.discretionary} />
      </div>
    </div>
  );
};

export { RightColumn };
