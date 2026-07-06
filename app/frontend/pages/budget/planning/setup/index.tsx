import { BudgetMonthData } from "@/types/budget/month-data";
import { initBudgetMonthStore } from "../../month-store";
import { PageComponent } from "@/layout";
import { SetupHeader } from "./header";
import { SetupRightColumn } from "./right-column";
import {
  CategoryGroups,
  FeaturedBudgetCategoryType,
  SetupData,
} from "@/types/budget/planning/setup";
import { initSetupStore } from "./store";
import { CategoryGroupList } from "./list";
import { FeaturedCategoryComponent } from "./featured-category/index";

type SetupIndexProps = {
  budgetMonth: BudgetMonthData;
  featuredCategory: FeaturedBudgetCategoryType;
  groups: CategoryGroups;
  neighborLinks: SetupData;
  finishSetupRoute: string;
  metadata: {
    namespace: string;
    pageName: string;
  };
};

const SetupIndex = (props: SetupIndexProps) => {
  const {
    budgetMonth,
    groups,
    featuredCategory,
    finishSetupRoute,
    neighborLinks,
  } = props;
  initBudgetMonthStore({ budgetMonth });
  initSetupStore({
    finishSetupRoute,
    featuredCategory,
    groups,
    setupData: neighborLinks,
  });

  return (
    <PageComponent
      header={<SetupHeader />}
      metadata={props.metadata}
      mainId="budget-setup"
      mainComponentClassNames={["budget-planning"]}
      rightColumn={<SetupRightColumn />}
    >
      <FeaturedCategoryComponent />
      <CategoryGroupList />
    </PageComponent>
  );
};

export default SetupIndex;
