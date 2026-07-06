import { BudgetCategoryType } from "../index";
import {
  BudgetPlanningEvent,
  GenericGroupCollection,
  GenericGroup,
} from "./index";

type BudgetCategorySlice =
  | "key"
  | "name"
  | "slug"
  | "archivedAt"
  | "iconClassName"
  | "isExpense"
  | "isMonthly"
  | "isAccrual";

type BudgetCategoryEventFlagsType = {
  rolloverAll: boolean;
  rolloverNone: boolean;
  showDefaultSuggestion: boolean;
  unreviewed: boolean;
  isValid: boolean;
};

type RolloverEvents = "rollover_item_adjust" | "rollover_item_create";

type CategoryType = Pick<BudgetCategoryType, BudgetCategorySlice> & {
  route: string;
  events: Array<BudgetCategoryEventFlagsType>;
};

type FeaturedBudgetCategoryType = Pick<
  BudgetCategoryType,
  BudgetCategorySlice
> & {
  events: Array<
    BudgetPlanningEvent<RolloverEvents, BudgetCategoryEventFlagsType>
  >;
};

type CategoryGroup = GenericGroup<CategoryType>;

type CategoryGroups = GenericGroupCollection<CategoryGroup>;

export type {
  FeaturedBudgetCategoryType,
  BudgetCategoryEventFlagsType,
  CategoryGroups,
  CategoryType,
  RolloverEvents,
};
