import {
  BudgetPlanningEvent,
  GenericGroupCollection,
  GenericGroup,
} from "./index";
import { BudgetCategoryType } from "../index";

// "upcomingMaturityIntervals": null,

// I think this get get moved to ./index
type BudgetCategorySlice =
  | "key"
  | "name"
  | "slug"
  | "archivedAt"
  | "iconClassName"
  | "isExpense"
  | "isMonthly"
  | "isAccrual";

type CategoryType = Pick<BudgetCategoryType, BudgetCategorySlice> & {
  route: string;
  events: Array<BudgetCategoryEventFlagsType>;
};

type SetupEvents = "setup_item_create" | "setup_item_adjust";

type FeaturedBudgetCategoryType = Pick<
  BudgetCategoryType,
  BudgetCategorySlice
> & {
  events: Array<BudgetPlanningEvent<SetupEvents, BudgetCategoryEventFlagsType>>;
};

type BudgetCategoryEventFlagsType = {
  eqPrevBudgeted: boolean;
  eqPrevSpent: boolean;
  showDefaultSuggestion: boolean;
  unreviewed: boolean;
  hasDeleteIntent: boolean;
  isValid: boolean;
};

type CategoryGroup = GenericGroup<CategoryType>;

type CategoryGroups = GenericGroupCollection<CategoryGroup>;

// let's give this generic a name,
// move it to ./index
type SetupData = {
  currentCategoryHref: string;
  nextUnreviewedCategoryHref: string;
  nextCategoryHref: string;
  previousCategoryHref: string;
  previousUnreviewedCategoryHref: string;
};

export type {
  BudgetCategoryEventFlagsType,
  CategoryGroups,
  CategoryType,
  CategoryGroup,
  FeaturedBudgetCategoryType,
  SetupData,
  SetupEvents,
};
