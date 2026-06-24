import { create } from "zustand";
import { CategoryGroups, FeaturedBudgetCategoryType, SetupData } from "@/types/budget/planning/setup";
import { RefObject, useEffect, useRef } from "react";

const emptyMetadata = {
  count: 0,
  sum: { display: "", cents: 0 },
  unreviewed: 0,
  isReviewed: 0,
  isSelected: false
}

const emptyGroups: CategoryGroups = {
  revenues: {
    label: "Revenues",
    name: "Revenue",
    key: "revenue",
    scopes: [],
    categories: [],
    metadata: { ...emptyMetadata }
  },
  fixedExpenses: {
    label: "Fixed Expenses",
    name: "Fixed Expense",
    key: "fixed-expenses",
    scopes: [],
    categories: [],
    metadata: { ...emptyMetadata }
  },
  variableExpenses: {
    label: "Variable Expenses",
    name: "Variable Expense",
    key: "variable-expenses",
    scopes: [],
    categories: [],
    metadata: { ...emptyMetadata }
  },
}

const emptyFeaturedCategory: FeaturedBudgetCategoryType = {
  key: "__initial__",
  name: "",
  slug: "",
  archivedAt: null,
  isExpense: false,
  isMonthly: false,
  isAccrual: false,
  iconClassName: "bars",
  events: []
}

const emptySetupData: SetupData = {
  currentCategoryHref: "",
  nextUnreviewedCategoryHref: "",
  nextCategoryHref: "",
  previousCategoryHref: "",
  previousUnreviewedCategoryHref: "",
}

type SetupStoreType = {
  eventsRef: null | RefObject<Map<string, string>>;
  featuredCategory: FeaturedBudgetCategoryType;
  groups: CategoryGroups
  setupData: SetupData;
  setEventsRef: (r: RefObject<Map<string, string>>) => void;
  setFeaturedCategory: (c: FeaturedBudgetCategoryType) => void;
  setGroups: (groups: CategoryGroups) => void;
  setSetupData: (l: SetupData) => void;
}

const usePlanningSetupStore = create<SetupStoreType>((set) => ({
  eventsRef: null,
  featuredCategory: emptyFeaturedCategory,
  groups: emptyGroups,
  setupData: emptySetupData,
  setEventsRef: (r: RefObject<Map<string, string>>) => set({ eventsRef: r }),
  setFeaturedCategory: (c: FeaturedBudgetCategoryType) => set({ featuredCategory: c }),
  setGroups: (groups: CategoryGroups) => set({ groups }),
  setSetupData: (setupData) => set({ setupData })
}))

const initSetupStore = (props: {
  groups: CategoryGroups;
  featuredCategory: FeaturedBudgetCategoryType;
  setupData: SetupData
}) => {
  const { featuredCategory, groups, setupData } = props
  const setGroups = usePlanningSetupStore((s) => s.setGroups)
  const setFeaturedCategory = usePlanningSetupStore((s) => s.setFeaturedCategory)
  const setSetupData = usePlanningSetupStore((s) => s.setSetupData)
  const setEventsRef = usePlanningSetupStore((s) => s.setEventsRef)

  const refMap = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    setGroups(groups)
  }, [groups, setGroups])
  useEffect(() => {
    setFeaturedCategory(featuredCategory)
  }, [featuredCategory, setFeaturedCategory])
  useEffect(() => {
    setSetupData(setupData)
  }, [setupData, setSetupData])
  useEffect(() => {
    setEventsRef(refMap)
  }, [refMap, setEventsRef])
}

const getSetupGroups = () => usePlanningSetupStore((s) => s.groups)
const getFeaturedCategory = () => usePlanningSetupStore((s) => s.featuredCategory)
const getSetupData = () => usePlanningSetupStore((s) => s.setupData)

const useEventsRef = () => {
  const featuredCategory = getFeaturedCategory()

  const eventsRef = usePlanningSetupStore((s) => s.eventsRef) ?? useRef(new Map());

  const clearRef = () => eventsRef.current.clear()

  const updateEvents = (events: Array<{ key: string; amount: string }>) => {
    events.forEach(({ key, amount }) => {
      eventsRef.current.set(key, amount)
    })
  }

  const getEvent = (p: { itemKey: string }) => eventsRef.current.get(p.itemKey)

  const hasChanges = featuredCategory.events.some(({ adjustment, budgetItemKey }) => {
    const latestAdjustment = getEvent({ itemKey: budgetItemKey })

    if (latestAdjustment === undefined) {
      return false;
    }

    const propDisplay = adjustment.display ?? "";
    const trackedDisplay = latestAdjustment ?? "";
    return propDisplay !== trackedDisplay;
  })

  return { getEvent, clearRef, hasChanges, updateEvents }
}

const useCurrentFeaturedCategoryRoute = () => {
  const setupData = getSetupData()

  return (slug?: string) =>
    setupData.currentCategoryHref + (slug ? `?next-category=${slug}` : "")

}

export { initSetupStore, getSetupGroups, getFeaturedCategory, useEventsRef, getSetupData, useCurrentFeaturedCategoryRoute }
