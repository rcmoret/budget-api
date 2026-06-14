import { MainComponent } from "@frontend/layout";
import { Header } from "./header";
import { RightColumn } from "./right-column";
import { BudgetMonthIndex } from "@/types/budget";
import { useInitBudgetDashboardStore } from "./store";
import { ItemsContainer } from "./items";

const DashboardComponent = () => {
  return (
    <MainComponent
      header={<Header />}
      namespace="budget"
      rightColumn={<RightColumn />}
    >
      <div id="budget-item-list" className="flex flex-col gap-2">
        <ItemsContainer />
      </div>
    </MainComponent>
  );
};

const BudgetDashboard = (props: BudgetMonthIndex) => {
  useInitBudgetDashboardStore({ items: props.items, budgetMonth: props.budgetMonth })
  return <DashboardComponent />;
};

export default BudgetDashboard;

