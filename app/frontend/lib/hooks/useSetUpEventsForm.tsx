import { useForm } from "@inertiajs/react";
import { router } from '@inertiajs/react'
import { BudgetCategory } from "@/types/budget";
import { createContext, useContext, useEffect, useRef } from "react";
import { TInputAmount } from "@/components/common/AmountInput";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { ComponentProps } from "@/pages/budget/set_up/index2";
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
  changeNextCategory: () => void;
  processing: boolean;
  removeEvent: (p: { slug: string, key: string }) => void;
  updateEvents: (events: Array<{ key: string; amount: string }>) => void;
}

const useSetUpEventsForm = (props: ComponentProps): HookProps => {
  const {
    delete: deleteRequest,
    processing,
    setData,
    data: formData,
    transform
  } = useForm({
    // events: props.budgetCategory?.events || []
  })

  const selectedGroup = Object.values(props.groups).reduce((memo, group) => {
    if (group.metadata.isSelected) {
      return group.label
    }
    else {
      return memo
    }
  }, "")

  const [ showAddEventForm, toggleShowAddEventForm ] = useToggle(false)

  useEffect(() => {
    if (showAddEventForm) {
      toggleShowAddEventForm()
    }
  }, [selectedGroup])
  useEffect(() => {
    setData({ events: props.budgetCategory?.events || [] })
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
    deleteRequest(url, { preserveState: true })
  }

  const updateEvents = (events: Array<{ key: string; amount: string }>) => {
    const url = UrlBuilder({
      name: "BudgetSetupPut",
      month: props.metadata.month,
      year: props.metadata.year,
      categorySlug: props.budgetCategory.slug
    })

    router.put(
      url,
      { events: events.map(({ key, amount }) => ({ budgetItemKey: key, adjustment: { display: amount } })) },
      { preserveState: true }
    )
  }

  const putCategory = (slug?: string) => {
    const url = UrlBuilder({
      name: "BudgetSetupPut",
      month: props.metadata.month,
      year: props.metadata.year,
      ...(!!slug ? { queryParams: `next-category=${slug}` } : {}),
      categorySlug: props.budgetCategory.slug
    })

    router.put(
      url,
      {
        events: props.budgetCategory.events.map(({ budgetItemKey, adjustment }) => ({ budgetItemKey, adjustment }))
      },
      { preserveState: true })
  }

  const changeNextCategory = () => {
    putCategory(props.metadata.nextCategorySlug)
  }

  const changePreviousCategory = () => {
    putCategory(props.metadata.previousCategorySlug)
  }

  return {
    ...props,
    budgetCategory: props.budgetCategory,
    putCategory,
    changeNextCategory,
    changePreviousCategory,
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
