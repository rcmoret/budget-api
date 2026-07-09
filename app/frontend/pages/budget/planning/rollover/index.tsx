import { BudgetMonthData } from "@/types/budget/month-data";
import { SetupData } from "@/types/budget/planning/setup";
import {
  CategoryGroups,
  FeaturedBudgetCategoryType,
} from "@/types/budget/planning/rollover";
import { PageComponent } from "@/layout";

type RolloverIndexProps = {
  budgetMonth: BudgetMonthData;
  featuredCategory: FeaturedBudgetCategoryType;
  groups: CategoryGroups;
  neighborLinks: SetupData;
  metadata: {
    namespace: string;
    pageName: string;
  };
};

const RolloverIndex = (_props: RolloverIndexProps) => {
  return (
    <PageComponent
      header={null}
      mainId="budget-setup"
      mainComponentClassNames={["budget-planning"]}
      rightColumn={null}
    >
      Rollover
    </PageComponent>
  );
};

export default RolloverIndex;
