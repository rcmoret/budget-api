import { MonetaryAmount } from "@/types/amount";

type RolloverEvents = "item_adjust" | "item_create";

type RolloverTargetEvent = {
  key: string;
  eventType: RolloverEvents;
  budgeted: MonetaryAmount;
  budgetItemKey: string | null;
};

type RolloverItem = {
  key: string;
  eventKey: string | null;
  eventType: RolloverEvents | null;
  adjustment: MonetaryAmount;
  remaining: MonetaryAmount;
  targetItemBudgeted: MonetaryAmount;
  updatedTargetAmount: MonetaryAmount;
  unappliedAmount: MonetaryAmount;
  isValid: boolean;
  isReviewed: boolean;
};

type FeaturedBudgetCategoryType = {
  key: string;
  name: string;
  slug: string;
  isAccrual: boolean;
  isExpense: boolean;
  isMonthly: boolean;
  items: Array<RolloverItem>;
  targetEvents: Array<RolloverTargetEvent>;
  // Only Complex categories serialize the category level totals.
  unappliedAmount?: MonetaryAmount;
  unreviewed?: boolean;
};

type ItemStatusType = {
  isReviewed: boolean;
  isValid: boolean;
};

type CategoryType = {
  key: string;
  name: string;
  slug: string;
  unappliedAmount: MonetaryAmount;
  isReviewed: boolean;
  isSelected: boolean;
  route: string;
  items: Array<ItemStatusType>;
};

type CategoryGroup = {
  key: string;
  label: string;
  name: string;
  categories: Array<CategoryType>;
  metadata: {
    count: number;
    unreviewed: number;
    isReviewed: number;
    isSelected: boolean;
    sum: MonetaryAmount;
  };
};

type CategoryGroups = {
  accruals: CategoryGroup;
  revenues?: CategoryGroup;
  expenses: CategoryGroup;
};

type UnappliedTargetEvent = {
  key: string;
  eventType: string;
  budgetCategoryKey: string;
  budgetItemKey: string;
  name: string;
  slug: string;
  isExpense: boolean;
  month: number;
  year: number;
};

// Where the remainder (what isn't rolled over) goes. `scope` is null when
// the total is zero, so there's nothing to place.
type UnappliedType = {
  total: MonetaryAmount;
  scope: "expenses" | "revenues" | null;
  targetEvent: UnappliedTargetEvent | null;
  isTargetValid: boolean;
  isReady: boolean;
  targetMonth: number;
  targetYear: number;
};

type RolloverNeighborLinks = {
  currentCategoryHref: string;
  nextCategoryHref: string | null;
  nextCategoryName: string | null;
  nextCategorySlug: string | null;
  previousCategoryHref: string | null;
  previousCategoryName: string | null;
  previousCategorySlug: string | null;
  nextUnreviewedCategoryHref: string | null;
  nextUnreviewedCategoryName: string | null;
  nextUnreviewedCategorySlug: string | null;
  previousUnreviewedCategoryHref: string | null;
  previousUnreviewedCategoryName: string | null;
  previousUnreviewedCategorySlug: string | null;
};

export type {
  CategoryGroup,
  CategoryGroups,
  CategoryType,
  FeaturedBudgetCategoryType,
  ItemStatusType,
  RolloverEvents,
  RolloverItem,
  RolloverNeighborLinks,
  RolloverTargetEvent,
  UnappliedTargetEvent,
  UnappliedType,
};
