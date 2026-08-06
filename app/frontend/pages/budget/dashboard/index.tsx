import { HeaderComponent, PageComponent } from "@frontend/layout";
import { RightColumn } from "./right-column";
import { BudgetMonthIndex } from "@/types/budget";
import { useInitBudgetDashboardStore } from "./store";
import { ItemsContainer } from "./items";
import { initBudgetMonthStore } from "../month-store";
import { initNeighborLinksStore } from "../neighbor-links-store";
import { useInitFilterTermStore } from "@/utils/hooks/use-filter-term";
import { useInitAdjustmentStore } from "@/lib/adjustment-amount-store";
import { useNeighborLinksKeyBoardHandlers } from "@/utils/hooks/neighbors-keyboard-nav";
import { getBudgetMonth } from "@/pages/budget/month-store";
import { getNeighborLinks } from "@/pages/budget/neighbor-links-store";
import { NeighborLinks } from "@/components/neighbor-links";

const BudgetDashboardNeighborLinks = () => {
  const { previous, next } = getNeighborLinks();

  return <NeighborLinks nextMonth={next} previousMonth={previous} />;
};

const Header = () => {
  const budgetMonth = getBudgetMonth();

  return (
    <HeaderComponent rightColumnComponent={<BudgetDashboardNeighborLinks />}>
      {budgetMonth.monthName} {budgetMonth.year} Budget
    </HeaderComponent>
  );
};

const DashboardComponent = () => {
  useNeighborLinksKeyBoardHandlers();

  return (
    <PageComponent
      header={<Header />}
      mainId="budget-dashboard"
      mainComponentClassNames={["w-full"]}
      rightColumn={<RightColumn />}
    >
      <ItemsContainer />
    </PageComponent>
  );
};

const BudgetDashboard = (props: BudgetMonthIndex) => {
  const { items, budgetMonth, discretionary } = props;

  useInitBudgetDashboardStore({ items, budgetMonth, discretionary });
  initBudgetMonthStore({ budgetMonth });
  initNeighborLinksStore({
    previous: {
      href: budgetMonth.previousMonth.href,
      label: budgetMonth.previousMonth.monthName,
    },
    next: {
      href: budgetMonth.nextMonth.href,
      label: budgetMonth.nextMonth.monthName,
    },
  });
  useInitFilterTermStore(null);
  useInitAdjustmentStore();

  return <DashboardComponent />;
};

export default BudgetDashboard;
