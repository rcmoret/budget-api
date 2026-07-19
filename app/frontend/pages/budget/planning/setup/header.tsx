import { HeaderComponent } from "@/layout";
import { getBudgetMonth } from "../../month-store";
import { getNeighborLinks } from "@/pages/budget/neighbor-links-store";
import { NeighborLinks } from "@/components/neighbor-links";

const BudgetDashboardNeighborLinks = () => {
  const { previous, next } = getNeighborLinks();

  return <NeighborLinks nextMonth={next} previousMonth={previous} />;
};

const SetupHeader = () => {
  const budgetMonth = getBudgetMonth();
  return (
    <HeaderComponent rightColumnComponent={<BudgetDashboardNeighborLinks />}>
      Planning: Setup {budgetMonth.monthName} {budgetMonth.year}
    </HeaderComponent>
  );
};

export { SetupHeader };
