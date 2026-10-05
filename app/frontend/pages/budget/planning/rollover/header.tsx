import { HeaderComponent } from "@/layout";
import { getBudgetMonth } from "../../month-store";
import { getNeighborLinks } from "@/pages/budget/neighbor-links-store";
import { NeighborLinks } from "@/components/neighbor-links";

const RolloverNeighborLinks = () => {
  const { previous, next } = getNeighborLinks();

  return <NeighborLinks nextMonth={next} previousMonth={previous} />;
};

const RolloverHeader = () => {
  const budgetMonth = getBudgetMonth();

  return (
    <HeaderComponent rightColumnComponent={<RolloverNeighborLinks />}>
      Planning: Rollover {budgetMonth.monthName} {budgetMonth.year}
    </HeaderComponent>
  );
};

export { RolloverHeader };
