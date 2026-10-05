import { create } from "zustand";
import { useEffect } from "react";
import { inputAmount } from "@/lib/adjustment-amount-store";
import {
  CategoryGroup,
  CategoryGroups,
  FeaturedBudgetCategoryType,
  RolloverItem,
  RolloverNeighborLinks,
  UnappliedType,
} from "@/types/budget/planning/rollover";
import {
  highlightedSuggestion,
  isReviewed,
  isValid,
  ItemChanges,
  SuggestionName,
  unappliedAmount,
} from "./suggestions";

const emptyMetadata = {
  count: 0,
  unreviewed: 0,
  isReviewed: 0,
  isSelected: false,
  sum: { display: "", cents: 0 },
};

const emptyGroup = (key: string, label: string): CategoryGroup => ({
  key,
  label,
  name: label,
  categories: [],
  metadata: { ...emptyMetadata },
});

const emptyGroups: CategoryGroups = {
  accruals: emptyGroup("accruals", "Accruals"),
  expenses: emptyGroup("expenses", "Expenses"),
};

const emptyFeaturedCategory: FeaturedBudgetCategoryType = {
  key: "__initial__",
  name: "",
  slug: "",
  isAccrual: false,
  isExpense: false,
  isMonthly: false,
  items: [],
  targetEvents: [],
};

const emptyNeighborLinks: RolloverNeighborLinks = {
  currentCategoryHref: "",
  nextCategoryHref: null,
  nextCategoryName: null,
  nextCategorySlug: null,
  previousCategoryHref: null,
  previousCategoryName: null,
  previousCategorySlug: null,
  nextUnreviewedCategoryHref: null,
  nextUnreviewedCategoryName: null,
  nextUnreviewedCategorySlug: null,
  previousUnreviewedCategoryHref: null,
  previousUnreviewedCategoryName: null,
  previousUnreviewedCategorySlug: null,
};

const emptyUnapplied: UnappliedType = {
  total: { cents: 0, display: "" },
  scope: null,
  targetEvent: null,
  isTargetValid: false,
  isReady: false,
  targetMonth: 0,
  targetYear: 0,
};

type RolloverProps = {
  featuredCategory: FeaturedBudgetCategoryType | null;
  groups: CategoryGroups;
  isSubmittable: boolean;
  neighborLinks: RolloverNeighborLinks;
  unapplied: UnappliedType;
};

type RolloverStoreType = {
  // Unsaved (or in flight) changes keyed by review item key.
  edits: Record<string, ItemChanges>;
  featuredCategory: FeaturedBudgetCategoryType | null;
  groups: CategoryGroups;
  isSubmittable: boolean;
  neighborLinks: RolloverNeighborLinks;
  showReviewedCategories: boolean;
  unapplied: UnappliedType;
  clearEdit: (key: string, changes: ItemChanges) => void;
  setEdit: (key: string, changes: ItemChanges) => void;
  setProps: (props: RolloverProps) => void;
  toggleShowReviewedCategories: () => void;
};

const sameChanges = (a: ItemChanges, b: ItemChanges) =>
  a.eventKey === b.eventKey &&
  a.adjustment.cents === b.adjustment.cents &&
  a.adjustment.display === b.adjustment.display;

const useRolloverStore = create<RolloverStoreType>((set) => ({
  edits: {},
  featuredCategory: null,
  groups: emptyGroups,
  isSubmittable: false,
  neighborLinks: emptyNeighborLinks,
  showReviewedCategories: true,
  unapplied: emptyUnapplied,
  // Only drops the edit if it's still the one that was saved, so typing that
  // happened while the request was in flight isn't thrown away.
  clearEdit: (key, changes) =>
    set((s) => {
      const current = s.edits[key];
      if (!current || !sameChanges(current, changes)) return s;

      const edits = { ...s.edits };
      delete edits[key];
      return { edits };
    }),
  setEdit: (key, changes) =>
    set((s) => ({ edits: { ...s.edits, [key]: changes } })),
  setProps: (props) => set(props),
  toggleShowReviewedCategories: () =>
    set((s) => ({ showReviewedCategories: !s.showReviewedCategories })),
}));

const initRolloverStore = (props: RolloverProps) => {
  const setProps = useRolloverStore((s) => s.setProps);
  const { featuredCategory, groups, isSubmittable, neighborLinks, unapplied } =
    props;

  useEffect(() => {
    setProps({
      featuredCategory,
      groups,
      isSubmittable,
      neighborLinks,
      unapplied,
    });
  }, [
    featuredCategory,
    groups,
    isSubmittable,
    neighborLinks,
    unapplied,
    setProps,
  ]);
};

type FeaturedItem = RolloverItem & {
  highlighted: SuggestionName | null;
};

// The featured category's items with any unsaved edits applied and the
// review state worked out live, so the page doesn't wait on the server.
const useFeaturedItems = (): Array<FeaturedItem> => {
  const category = useRolloverStore((s) => s.featuredCategory);
  const edits = useRolloverStore((s) => s.edits);

  return (category?.items ?? []).map((item) => {
    const edit = edits[item.key];
    const amounts = {
      remaining: item.remaining,
      adjustment: edit?.adjustment ?? item.adjustment,
      eventKey: edit ? edit.eventKey : item.eventKey,
    };
    const target = category?.targetEvents.find(
      ({ key }) => key === amounts.eventKey,
    );
    const targetItemBudgeted = target?.budgeted ?? item.targetItemBudgeted;

    return {
      ...item,
      ...amounts,
      eventType: target?.eventType ?? (edit ? null : item.eventType),
      targetItemBudgeted,
      updatedTargetAmount: inputAmount({
        cents: targetItemBudgeted.cents + amounts.adjustment.cents,
      }),
      unappliedAmount: unappliedAmount(amounts),
      isReviewed: isReviewed(amounts),
      isValid: isValid(amounts),
      highlighted: highlightedSuggestion(amounts),
    };
  });
};

const useFeaturedCategory = () =>
  useRolloverStore((s) => s.featuredCategory) ?? emptyFeaturedCategory;
const useRolloverGroups = () => useRolloverStore((s) => s.groups);
const useNeighborLinks = () => useRolloverStore((s) => s.neighborLinks);
const useUnapplied = () => useRolloverStore((s) => s.unapplied);

const useShowReviewedCategories = () => {
  const toggleValue = useRolloverStore((s) => s.showReviewedCategories);
  const toggle = useRolloverStore((s) => s.toggleShowReviewedCategories);

  return { toggleValue, toggle };
};

const orderedGroups = (groups: CategoryGroups): Array<CategoryGroup> =>
  [groups.accruals, groups.revenues, groups.expenses].filter(
    (group): group is CategoryGroup => !!group,
  );

export type { FeaturedItem };
export {
  initRolloverStore,
  orderedGroups,
  useFeaturedCategory,
  useFeaturedItems,
  useNeighborLinks,
  useRolloverGroups,
  useRolloverStore,
  useShowReviewedCategories,
  useUnapplied,
};
