import { create } from "zustand";
import {
  CategoryGroup,
  CategoryGroups,
  FeaturedBudgetCategoryType,
  SetupData,
} from "@/types/budget/planning/setup";
import { useEffect } from "react";

const emptyMetadata = {
  count: 0,
  sum: { display: "", cents: 0 },
  unreviewed: 0,
  isReviewed: 0,
  isSelected: false,
};

const emptyGroups: CategoryGroups = {
  revenues: {
    label: "Revenues",
    name: "Revenue",
    key: "revenue",
    scopes: [],
    categories: [],
    metadata: { ...emptyMetadata },
  },
  fixedExpenses: {
    label: "Fixed Expenses",
    name: "Fixed Expense",
    key: "fixed-expenses",
    scopes: [],
    categories: [],
    metadata: { ...emptyMetadata },
  },
  variableExpenses: {
    label: "Variable Expenses",
    name: "Variable Expense",
    key: "variable-expenses",
    scopes: [],
    categories: [],
    metadata: { ...emptyMetadata },
  },
};

const emptyFeaturedCategory: FeaturedBudgetCategoryType = {
  key: "__initial__",
  objectKey: "",
  name: "",
  slug: "",
  archivedAt: null,
  isExpense: false,
  isMonthly: false,
  isAccrual: false,
  defaultAmount: { display: "", cents: 0 },
  iconClassName: "bars",
  events: [],
};

const emptySetupData: SetupData = {
  currentCategoryHref: "",
  nextUnreviewedCategoryHref: "",
  nextCategoryHref: "",
  nextCategoryName: "",
  nextUnreviewedCategoryName: "",
  previousCategoryHref: "",
  previousCategoryName: "",
  previousUnreviewedCategoryHref: "",
  previousUnreviewedCategoryName: "",
  previousUnreviewedCategorySlug: "",
};

type SetupStoreType = {
  events: Record<string, string>;
  featuredCategory: FeaturedBudgetCategoryType;
  groups: CategoryGroups;
  finishSetupRoute: string;
  setupData: SetupData;
  setEvents: (updates: Array<{ key: string; amount: string }>) => void;
  showReviewedCategories: boolean;
  setShowReviewedCategories: (toggle: boolean) => void;
  clearEvents: () => void;
  setFeaturedCategory: (c: FeaturedBudgetCategoryType) => void;
  setFinishSetupRoute: (s: string) => void;
  setGroups: (groups: CategoryGroups) => void;
  setSetupData: (l: SetupData) => void;
};

const usePlanningSetupStore = create<SetupStoreType>((set) => ({
  events: {},
  featuredCategory: emptyFeaturedCategory,
  finishSetupRoute: "",
  groups: emptyGroups,
  setFinishSetupRoute: (finishSetupRoute) => set({ finishSetupRoute }),
  setupData: emptySetupData,
  setEvents: (updates) =>
    set((s) => {
      const events = { ...s.events };
      updates.forEach(({ key, amount }) => {
        events[key] = amount;
      });
      return { events };
    }),
  clearEvents: () => set({ events: {} }),
  setFeaturedCategory: (c: FeaturedBudgetCategoryType) =>
    set({ featuredCategory: c }),
  setGroups: (groups: CategoryGroups) => set({ groups }),
  setSetupData: (setupData) => set({ setupData }),
  showReviewedCategories: true,
  setShowReviewedCategories: (showReviewedCategories: boolean) =>
    set({ showReviewedCategories }),
}));

const initSetupStore = (props: {
  groups: CategoryGroups;
  featuredCategory: FeaturedBudgetCategoryType;
  setupData: SetupData;
  finishSetupRoute: string;
}) => {
  const { featuredCategory, groups, setupData } = props;
  const setGroups = usePlanningSetupStore((s) => s.setGroups);
  const setFeaturedCategory = usePlanningSetupStore(
    (s) => s.setFeaturedCategory,
  );
  const setSetupData = usePlanningSetupStore((s) => s.setSetupData);
  const setFinishSetupRoute = usePlanningSetupStore(
    (s) => s.setFinishSetupRoute,
  );

  useEffect(() => {
    setGroups(groups);
  }, [groups, setGroups]);
  useEffect(() => {
    setFeaturedCategory(featuredCategory);
  }, [featuredCategory, setFeaturedCategory]);
  useEffect(() => {
    setSetupData(setupData);
  }, [setupData, setSetupData]);
  useEffect(() => {
    setFinishSetupRoute(props.finishSetupRoute);
  }, [props.finishSetupRoute, setFinishSetupRoute]);
};

const useSetupGroups = () => usePlanningSetupStore((s) => s.groups);
const useFeaturedCategory = () =>
  usePlanningSetupStore((s) => s.featuredCategory);
const useSetupData = () => usePlanningSetupStore((s) => s.setupData);

const useTrackedEvents = () => {
  const featuredCategory = useFeaturedCategory();

  const events = usePlanningSetupStore((s) => s.events);
  const setEvents = usePlanningSetupStore((s) => s.setEvents);
  const clearRef = usePlanningSetupStore((s) => s.clearEvents);

  const updateEvents = (updates: Array<{ key: string; amount: string }>) =>
    setEvents(updates);

  const getEvent = (p: { itemKey: string }): string | undefined =>
    events[p.itemKey];

  const hasChanges = featuredCategory.events.some(
    ({ adjustment, budgetItemKey }) => {
      const latestAdjustment = getEvent({ itemKey: budgetItemKey });

      if (latestAdjustment === undefined) {
        return false;
      }

      const propDisplay = adjustment.display ?? "";
      const trackedDisplay = latestAdjustment ?? "";
      return propDisplay !== trackedDisplay;
    },
  );

  return { getEvent, clearRef, hasChanges, updateEvents };
};

// Featured-category events with live review flags derived from the tracked
// edits, so the list reflects the same "reviewed" state the editor shows.
const useFeaturedEvents = () => {
  const featuredCategory = useFeaturedCategory();
  const events = usePlanningSetupStore((s) => s.events);

  return featuredCategory.events.map((event) => {
    const display =
      events[event.budgetItemKey] ?? event.adjustment.display ?? "";
    const isReviewed = !!display;

    return {
      ...event,
      flags: {
        ...event.flags,
        unreviewed: !isReviewed,
      },
    };
  });
};

const useCurrentFeaturedCategoryRoute = () => {
  const setupData = useSetupData();

  return (slug?: string) =>
    setupData.currentCategoryHref + (slug ? `?next-category=${slug}` : "");
};

const useToggleReviewedCategoryVisibility = () => {
  const toggleValue = usePlanningSetupStore(
    ({ showReviewedCategories }) => showReviewedCategories,
  );
  const setShowReviewedCategories = usePlanningSetupStore(
    ({ setShowReviewedCategories }) => setShowReviewedCategories,
  );

  return {
    toggleValue,
    setShowReviewedCategories: () => setShowReviewedCategories(!toggleValue),
  };
};

const nullGroup = {
  label: "",
  name: "",
  key: "",
  scopes: [],
  categories: [],
  metadata: { ...emptyMetadata },
};

const getCurrentGroup = (): CategoryGroup => {
  const groups = usePlanningSetupStore((s) => s.groups);

  const currentGroup = Object.values(groups).find(
    ({ metadata }) => metadata.isSelected,
  );

  return currentGroup || nullGroup;
};

export {
  getCurrentGroup,
  initSetupStore,
  useToggleReviewedCategoryVisibility,
  useSetupGroups,
  useFeaturedCategory,
  useFeaturedEvents,
  usePlanningSetupStore,
  useTrackedEvents,
  useSetupData,
  useCurrentFeaturedCategoryRoute,
};
