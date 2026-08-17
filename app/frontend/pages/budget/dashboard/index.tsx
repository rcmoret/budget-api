import { Link } from "@inertiajs/react";
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
import { Pencil } from "@/components/icons/pencil";

const BudgetDashboardNeighborLinks = () => {
  const { previous, next } = getNeighborLinks();

  return <NeighborLinks nextMonth={next} previousMonth={previous} />;
};

const EditMonthLink = () => {
  const { editRoute, monthName, year } = getBudgetMonth();

  if (!editRoute) return null;

  return (
    <Link
      href={editRoute}
      title={`Edit ${monthName} ${year}`}
      aria-label={`Edit ${monthName} ${year}`}
      className="grid place-items-center h-8 w-8 rounded-full bg-base-200 text-base-content hover:bg-base-300"
    >
      <Pencil />
    </Link>
  );
};

const Header = () => {
  const budgetMonth = getBudgetMonth();

  return (
    <HeaderComponent
      rightColumnComponent={
        <BudgetDashboardNeighborLinks />
      }
    >
      <div className="flex justify-between">
        {budgetMonth.monthName} {budgetMonth.year} Budget
        <EditMonthLink />
      </div>
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
      secondaryPanelLabel="Month details & filters"
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
