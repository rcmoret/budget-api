import { PageComponent } from "@frontend/layout";
import { Header } from "./header";
import { RightColumn } from "./right-column";
import { BudgetMonthIndex } from "@/types/budget";
import { useInitBudgetDashboardStore } from "./store";
import { ItemsContainer } from "./items";
import { initBudgetMonthStore } from "../month-store";
import { initNeighborLinksStore } from "../neighbor-links-store";
import { useInitFilterTermStore } from "@/utils/hooks/use-filter-term";
import { useInitAdjustmentStore } from "@/lib/adjustment-amount-store";
import { useNeighborLinksKeyBoardHandlers } from "@/utils/hooks/neighbors-keyboard-nav";

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
  const { items, budgetMonth } = props;

  useInitBudgetDashboardStore({ items, budgetMonth });
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
