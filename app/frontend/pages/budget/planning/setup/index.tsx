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
import { PageProps } from "@/types/page_props";
import {
  AdjustmentSetProps,
  useAdjustementSet,
} from "@/lib/adjustment-amount-store";
import { initNeighborLinksStore } from "@/pages/budget/neighbor-links-store";
import { useNeighborLinksKeyBoardHandlers } from "@/utils/hooks/neighbors-keyboard-nav";

type SetupIndexProps = PageProps & {
  budgetMonth: BudgetMonthData;
  featuredCategory: FeaturedBudgetCategoryType;
  groups: CategoryGroups;
  neighborLinks: SetupData;
  finishSetupRoute: string;
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

  const adjustments: AdjustmentSetProps = featuredCategory.events.map(
    (event) => {
      return {
        objectKey: event.objectKey,
        amount: event.amount.display,
        adjustment: event.adjustment.display,
      };
    },
  );
  useAdjustementSet(adjustments);
  console.log({ neighborLinks });
  initNeighborLinksStore({
    next: {
      label: neighborLinks.nextCategoryName ?? "",
      href: neighborLinks.nextCategoryHref,
    },
    previous: {
      label: neighborLinks.previousCategoryName ?? "",
      href: neighborLinks.previousCategoryHref,
    },
  });
  useNeighborLinksKeyBoardHandlers();

  return (
    <PageComponent
      header={<SetupHeader />}
      mainId="budget-setup"
      mainComponentClassNames={["budget-planning"]}
      rightColumn={<SetupRightColumn />}
    >
      <CategoryGroupList />
      <FeaturedCategoryComponent />
    </PageComponent>
  );
};

export default SetupIndex;
