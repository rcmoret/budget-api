import { BudgetMonthData } from "@/types/budget/month-data";
import {
  CategoryGroups,
  FeaturedBudgetCategoryType,
  RolloverNeighborLinks,
  UnappliedType,
} from "@/types/budget/planning/rollover";
import { PageComponent } from "@/layout";
import { PageProps } from "@/types/page_props";
import { initBudgetMonthStore } from "../../month-store";
import { initNeighborLinksStore } from "@/pages/budget/neighbor-links-store";
import { useNeighborLinksKeyBoardHandlers } from "@/utils/hooks/neighbors-keyboard-nav";
import { RolloverHeader } from "./header";
import { CategoryGroupList } from "./list";
import { FeaturedCategoryComponent } from "./featured-category";
import { RolloverRightColumn } from "./right-column";
import { initRolloverStore } from "./store";

type RolloverIndexProps = PageProps & {
  budgetMonth: BudgetMonthData;
  featuredCategory: FeaturedBudgetCategoryType | null;
  groups: CategoryGroups;
  neighborLinks: RolloverNeighborLinks;
  isSubmittable: boolean;
  unapplied: UnappliedType;
};

const RolloverIndex = (props: RolloverIndexProps) => {
  const {
    budgetMonth,
    featuredCategory,
    groups,
    isSubmittable,
    neighborLinks,
    unapplied,
  } = props;

  initBudgetMonthStore({ budgetMonth });
  initRolloverStore({
    featuredCategory,
    groups,
    isSubmittable,
    neighborLinks,
    unapplied,
  });
  initNeighborLinksStore({
    next: {
      label: neighborLinks.nextCategoryName ?? "",
      href: neighborLinks.nextCategoryHref ?? "",
    },
    previous: {
      label: neighborLinks.previousCategoryName ?? "",
      href: neighborLinks.previousCategoryHref ?? "",
    },
  });
  useNeighborLinksKeyBoardHandlers();

  return (
    <PageComponent
      header={<RolloverHeader />}
      mainId="budget-rollover"
      mainComponentClassNames={["budget-planning"]}
      rightColumn={<RolloverRightColumn />}
    >
      <CategoryGroupList />
      <FeaturedCategoryComponent />
    </PageComponent>
  );
};

export default RolloverIndex;
