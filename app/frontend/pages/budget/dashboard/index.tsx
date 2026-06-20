import { PageComponent } from "@frontend/layout";
import { Header } from "./header";
import { RightColumn } from "./right-column";
import { BudgetMonthIndex } from "@/types/budget";
import { useInitBudgetDashboardStore } from "./store";
import { ItemsContainer } from "./items";
import { initBudgetMonthStore } from "../month-store";

const DashboardComponent = () => {
  return (
    <PageComponent
      header={<Header />}
      metadata={{ namespace: "budget", pageName: "page" }}
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

  useInitBudgetDashboardStore({ items, budgetMonth })
  initBudgetMonthStore({ budgetMonth })

  return <DashboardComponent />;
};

export default BudgetDashboard;

