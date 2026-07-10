import { PageComponent } from "@frontend/layout";
import { Header } from "./header";
import { RightColumn } from "./right-column";
import { BudgetMonthIndex } from "@/types/budget";
import { useInitBudgetDashboardStore } from "./store";
import { ItemsContainer } from "./items";
import { initBudgetMonthStore } from "../month-store";
import { useInitFilterTermStore } from "@/utils/hooks/use-filter-term";

const DashboardComponent = () => {
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
  useInitFilterTermStore(null);

  return <DashboardComponent />;
};

export default BudgetDashboard;
