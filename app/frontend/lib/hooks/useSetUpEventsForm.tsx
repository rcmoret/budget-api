import { useForm } from "@inertiajs/react";
import { router } from '@inertiajs/react'
import { BudgetCategory } from "@/types/budget";
import { createContext, useContext, useEffect, useRef } from "react";
import { TInputAmount } from "@/components/common/AmountInput";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { ComponentProps } from "@/pages/budget/set_up/index";
import { useToggle } from "./useToogle";

type TCategoryListItem =
  BudgetCategory & { events: Array<TEventFlags>; currentlyReviewing: boolean; }

type TGroupScopes = "revenues" | "expenses" | "monthly" | "weekly"

type TCategoryGroup = {
  label: string;
  name: string;
  categories: Array<TCategoryListItem>;
  scopes: Array<TGroupScopes>;
  metadata: {
    count: number;
    sum: number;
    needsReview: number;
    isReviewed: number;
    isSelected: boolean;
  }
}

type TEventFlags = {
  eqPrevBudgeted: boolean;
  eqPrevSpent: boolean;
  showDefaultSuggestion: boolean;
  unreviewed: boolean;
  hasDeleteIntent: boolean;
  isValid: boolean;
}

interface SetupEvent {
  budgetItemKey: string;
  amount: number;
  updatedAmount: number;
  eventType: "setup_item_create" | "setup_item_adjust";
  spent: number;
  // data: string;
  adjustment: TInputAmount;
  previouslyBudgeted: number;
  flags: TEventFlags;
}


type SetupCategory = BudgetCategory & {
  events: Array<TEventFlags>
}

type HookProps = ComponentProps & {
  putCategory: (slug?: string) => void;
  changePreviousCategory: () => void;
  changePreviousUnreviewedCategory: () => void;
  changeNextCategory: () => void;
  changeNextUnreviewedCategory: () => void;
  processing: boolean;
  removeEvent: (p: { slug: string, key: string }) => void;
  updateEvents: (events: Array<{ key: string; amount: string }>) => void;
}

const useSetUpEventsForm = (props: ComponentProps): HookProps => {
  const { delete: deleteRequest, processing, setData, } = useForm()

  const selectedGroup = Object.values(props.groups).reduce((memo, group) => {
    if (group.metadata.isSelected) {
      return group.label
    }
    else {
      return memo
    }
  }, "")

  const [showAddEventForm, toggleShowAddEventForm] = useToggle(false)

  const eventAdjustmentsRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    if (showAddEventForm) {
      toggleShowAddEventForm()
    }
  }, [selectedGroup])

  useEffect(() => {
    setData({ events: props.budgetCategory?.events || [] })
    eventAdjustmentsRef.current.clear()
  }, [props.budgetCategory?.slug])

  const removeEvent = (args: { key: string; slug: string }) => {
    const { key, slug } = args

    const url = UrlBuilder({
      name: "BudgetSetupRemoveEvent",
      month: props.metadata.month,
      year: props.metadata.year,
      categorySlug: slug,
      key,
    })
    deleteRequest(url, { data: {}, preserveState: true })
  }

  const updateEvents = (events: Array<{ key: string; amount: string }>) => {
    const url = UrlBuilder({
      name: "BudgetSetupPut",
      month: props.metadata.month,
      year: props.metadata.year,
      categorySlug: props.budgetCategory.slug
    })

    events.forEach(({ key, amount }) => {
      eventAdjustmentsRef.current.set(key, amount)
    })

    router.put(
      url,
      { events: events.map(({ key, amount }) => ({ budgetItemKey: key, adjustment: { display: amount } })) },
      { preserveState: true }
    )
  }

  const putCategory = (slug?: string) => {
    const events = props.budgetCategory.events.map(({ budgetItemKey, adjustment }) => {
      const latestAdjustment = eventAdjustmentsRef.current.get(budgetItemKey)
      if (latestAdjustment !== undefined) {
        return {
          budgetItemKey,
          adjustment: { display: latestAdjustment }
        }
      }
      return { budgetItemKey, adjustment }
    })

    const hasChanges = props.budgetCategory.events.some(({ budgetItemKey, adjustment }) => {
      const latestAdjustment = eventAdjustmentsRef.current.get(budgetItemKey)
      if (latestAdjustment === undefined) {
        return false
      }
      const propDisplay = adjustment.display ?? ""
      const trackedDisplay = latestAdjustment ?? ""
      return propDisplay !== trackedDisplay
    })

    if (hasChanges) {
      const url = UrlBuilder({
        name: "BudgetSetupPut",
        month: props.metadata.month,
        year: props.metadata.year,
        ...(!!slug ? { queryParams: `next-category=${slug}` } : {}),
        categorySlug: props.budgetCategory.slug
      })

      router.put(
        url,
        { events },
        {
          preserveState: true,
          onSuccess: () => { eventAdjustmentsRef.current.clear() }
        }
      )
    } else {
      // No changes, use GET to navigate
      const targetSlug = slug || props.budgetCategory.slug
      const url = `/budget/${props.metadata.month}/${props.metadata.year}/set-up/${targetSlug}`

      router.get(url, {}, { preserveState: true })
    }
  }

  const changeNextCategory = () => {
    putCategory(props.metadata.nextCategorySlug)
  }

  const changeNextUnreviewedCategory = () => {
    putCategory(props.metadata.nextUnreviewedCategorySlug)
  }

  const changePreviousUnreviewedCategory = () => {
    putCategory(props.metadata.previousUnreviewedCategorySlug)
  }

  const changePreviousCategory = () => {
    putCategory(props.metadata.previousCategorySlug)
  }

  return {
    ...props,
    budgetCategory: props.budgetCategory,
    putCategory,
    changeNextCategory,
    changeNextUnreviewedCategory,
    changePreviousCategory,
    changePreviousUnreviewedCategory,
    processing,
    removeEvent,
    updateEvents
  }
}

type TSetupEventContext = ReturnType<typeof useSetUpEventsForm>

const SetupEventContext = createContext<TSetupEventContext | null>(null);

const SetupProvider = (props: ComponentProps & { children: React.ReactNode }) => {
  const { children, ...setupIndex } = props
  const hook = useSetUpEventsForm(setupIndex)

  return (
    <SetupEventContext.Provider value={hook}>
      {children}
    </SetupEventContext.Provider>
  )
}

const useSetUpEventsFormContext = (): TSetupEventContext => {
  const context = useContext(SetupEventContext);
  if (!context) {
    throw new Error("useSetupEventsFormContext must be used with a Set Up Provider")
  }
  return context;
}

export {
  SetupCategory,
  SetupCategory as SetUpCategory,
  SetupEvent,
  TCategoryGroup,
  TCategoryListItem,
  TEventFlags,
  TGroupScopes,
  SetupProvider,
  useSetUpEventsForm,
  useSetUpEventsForm as useSetupEventsForm,
  useSetUpEventsFormContext,
  useSetUpEventsFormContext as useSetupEventsFormContext
}
