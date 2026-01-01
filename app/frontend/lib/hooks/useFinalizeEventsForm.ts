import axios from "axios";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { useEventForm, isCreate, EventProps } from "@/lib/hooks/useEventsForm";
import { inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { generateKeyIdentifier } from "../KeyIdentifier";
import { useState, useEffect, useMemo, useRef } from "react";
import { clamp } from "@/lib/number-helpers"
import { TExtraCategoryCreateEvent } from "@/pages/budget/finalize/extra_events_select";
import { buildQueryParams } from "@/lib/redirect_params";

const ADJUST_EVENT = "rollover_item_adjust"
const CREATE_EVENT = "rollover_item_create"
const CREATE_EXTRA_EVENT = "rollover_extra_target_create"

type T_ADJUST_EVENT = typeof ADJUST_EVENT
type T_CREATE_EVENT = typeof CREATE_EVENT
type T_CREATE_EXTRA_EVENT = typeof CREATE_EXTRA_EVENT

type FinalizeCategoryEvent = {
  key: string;
  amount: number;
  budgetCategoryKey: string;
  budgetItemKey: string;
  eventType: T_ADJUST_EVENT | T_CREATE_EVENT | T_CREATE_EXTRA_EVENT;
  data: any
}

type SharedItemType = {
  key: string;
  remaining: number;
  eventKey: string | null;
}

type FinalizeCategoryItem = SharedItemType & {
  rolloverAmount: null | number;
}

type FinalizeCategoryFormItem = SharedItemType & {
  amountInputRef: React.RefObject<HTMLInputElement>;
  rolloverAmount: TInputAmount;
  showWarning: boolean;
  appliedToExtra: number;
  needsReview: boolean;
}

type FinalizeCategory = {
  key: string;
  name: string;
  slug: string;
  iconClassName: string;
  isAccrual: boolean;
  isExpense: boolean;
  isMonthly: boolean;
  events: Array<FinalizeCategoryEvent>;
  items: Array<FinalizeCategoryItem>;
}

type FinalizeFormCategory = {
  key: string;
  name: string;
  slug: string;
  iconClassName: string;
  isAccrual: boolean;
  isExpense: boolean;
  isMonthly: boolean;
  events: Array<FinalizeCategoryEvent>;
  items: Array<FinalizeCategoryFormItem>;
}

type UpdateCategoryProps = {
  events?: Array<FinalizeCategoryEvent>;
  items?: Array<FinalizeCategoryFormItem>;
}

type GetExtraEventsButtonProps = {
  month: string | number;
  year: string | number;
  excludedKeys: string[];
  isExpense: boolean;
}

const getExtraEvents = async (
  { month, year, excludedKeys, isExpense }: GetExtraEventsButtonProps
) => {
  const queryParams = {
    event_context: "rollover_extra_target_create",
  }
  const queryParamString = [
    ...Object.entries(queryParams).map((tuple) => tuple.join("=")),
    ...excludedKeys.map((key) => `excluded_keys[]=${key}`),
    `scopes[]=${isExpense ? "expenses" : "revenues"}`
  ].join("&")

  const summaryUrl = UrlBuilder({
    name: "CategoryCreateEvents",
    month,
    year,
    queryParams: queryParamString
  })
  return axios.get(summaryUrl)
  .then((response) => {
    return response.data.events
  })
  .catch(error => {
    console.error('Error fetching events:', error)
    return []
  })
}

const decorate = (props: {
  item: FinalizeCategoryItem | FinalizeCategoryFormItem;
  isExpense: boolean;
  rolloverAmount: string
  eventKey: null | string;
  amountInputRef?: React.RefObject<HTMLInputElement>;
}): FinalizeCategoryFormItem => {
  const { item, isExpense } = props

  const rolloverAmount = inputAmount({ display: props.rolloverAmount })

  const clamped = isExpense ?
    clamp({ min: item.remaining, max: 0, value: rolloverAmount.cents }) :
    clamp({ max: item.remaining, min: 0, value: rolloverAmount.cents })

  const showWarning = clamped !== rolloverAmount.cents

  const appliedToExtra = showWarning || !rolloverAmount.display ?
    0 :
    (item.remaining - rolloverAmount.cents)

  const needsReview =
    showWarning ||
    !rolloverAmount.display ||
    (!!rolloverAmount.cents && !props.eventKey)

  return {
    ...item,
    amountInputRef: props.amountInputRef || { current: null },
    appliedToExtra,
    eventKey: props.eventKey,
    needsReview,
    rolloverAmount,
    showWarning
  }
}

const mapCategories = (props: {
  categories: Array<FinalizeCategory>;
  refsMap: Map<string, React.RefObject<HTMLInputElement>>;
}) => {
  const { categories, refsMap } = props

  return categories.map((category) => {
    return {
      ...category,
      items: category.items.map((item) => {
        const rolloverAmount = !!item.rolloverAmount ?
          inputAmount({ cents: item.rolloverAmount }) :
          inputAmount({ display: "" })
        const eventKey = category.items.length === 1 && category.events.length === 1 ?
          category.events[0].key :
          null

        const amountInputRef = refsMap.get(item.key) || { current: null }

        return decorate({
          item,
          isExpense: category.isExpense,
          eventKey,
          rolloverAmount: rolloverAmount.display,
          amountInputRef
        })
      })
    }
  })
}

type HookProps = {
  categories: Array<FinalizeCategory>;
  month: number;
  year: number;
}

const useFinalizeEventsForm = (props: HookProps) => {
  const { month, year } = props

  const { transform, post: postEvents, setEventsData } = useEventForm({
    month,
    year,
    events: []
  })

  // Create a map to store refs for each item - reuse existing refs to maintain references
  const refsMapRef = useRef(new Map<string, React.RefObject<HTMLInputElement>>())

  // Initialize refs for all items - only add new ones, don't clear existing
  useMemo(() => {
    const map = refsMapRef.current
    props.categories.forEach((category) => {
      category.items.forEach((item) => {
        if (!map.has(item.key)) {
          map.set(item.key, { current: null })
        }
      })
    })
  }, [props.categories])

  const [categories, setCategories] = useState<FinalizeFormCategory[]>(mapCategories({
    categories: props.categories,
    refsMap: refsMapRef.current,
  }))

  const eventModel = (event: FinalizeCategoryEvent): EventProps => {
    const { data, key } = event

    const amount = inputAmount({ cents: event.amount })

    if (isCreate(event)) {
      return {
        key,
        eventType: CREATE_EVENT,
        amount,
        data,
        month,
        year,
        budgetItemKey: generateKeyIdentifier(),
        budgetCategoryKey: String(event.budgetCategoryKey),
      }
    } else {
      return {
        key,
        eventType: ADJUST_EVENT,
        amount,
        data,
        budgetItemKey: String(event.budgetItemKey),
      }
    }
  }

  const setCategory = (props: UpdateCategoryProps & { key: string; }) => {
    const { key, ...updatedProps } = props
    const newCategories = categories.map((category) => {
      if (category.key !== key) { return category }

      return { ...category, ...updatedProps }
    })
    setCategories(newCategories)
  }

  const allItemsReviewed = categories.every((category) =>{
    return category.items.every((item) => !item.needsReview)
  })

  const extraAmount = categories.reduce((total, { items }) => {
    return total + items.reduce((sum, { appliedToExtra }) => (
      sum + appliedToExtra
    ) , 0)
  }, 0)

  const categoryEventsReducer = ({ items, events }: FinalizeFormCategory): EventProps[] => {
    return events.reduce((collection, event) => {
      const relevantItems = items.filter((i) => i.eventKey === event.key)
      const adjustAmount = relevantItems.reduce((sum, item) => sum + (item.rolloverAmount.cents || 0), 0)
      if (!adjustAmount) {
        return collection
      } else {
        return [
          ...collection,
          eventModel({ ...event, amount: (event.amount + adjustAmount) })
        ]
      }
    }, [] as EventProps[])
  }

  const [extraCategoryOptions, setExtraCategoryOptions] = useState<TExtraCategoryCreateEvent[]>([])

  const [extraEventKey, setExtraEventKey] = useState<null | string>(null)

  const extraEvent = extraCategoryOptions
    .flatMap((categoryOption) => categoryOption.events)
    .find((ev) => ev.key === extraEventKey) ?? null

  const extraEventBaseProps = {
    eventType: "rollover_extra_target_create" as const,
    key: generateKeyIdentifier(),
    budgetItemKey: generateKeyIdentifier(),
    month,
    year,
    data: {}
  }

  const events: EventProps[] = categories.flatMap(categoryEventsReducer)

  useMemo(() => {
    if (allItemsReviewed) {
      setEventsData({ events })
    } else {
      setEventsData({ events: []})
    }
  }, [categories, extraEvent])

  useEffect(() => {
    if (allItemsReviewed) {
      const excludedKeys = allItemsReviewed ?
        events.filter((ev) => "budgetCategoryKey" in ev).map((ev) => ev.budgetCategoryKey) :
        []

      getExtraEvents({
        month,
        year,
        isExpense: (extraAmount < 0),
        excludedKeys
      }).then((result) => {
        if (result) {
          setExtraCategoryOptions(result)
        }
      })
    } else {
      setExtraCategoryOptions([])
    }
  }, [categories])

  const isSubmittable = allItemsReviewed && !!extraEvent

  const submitHandler = (ev: React.MouseEvent) => {

    ev.preventDefault()
    const formUrl = UrlBuilder({
      name: "BudgetFinalize",
      month,
      year,
      queryParams: buildQueryParams(["budget", month, year])
    })
    postEvents(formUrl)
  }

  const submittableEvents: EventProps[] = [
    {
      key: generateKeyIdentifier(),
      eventType: CREATE_EXTRA_EVENT,
      amount: inputAmount({ cents: extraAmount }),
      budgetCategoryKey: extraEvent?.budget_category_key ?? generateKeyIdentifier(),
      budgetItemKey: generateKeyIdentifier(),
      month,
      year,
      data: {}
    },
    ...events
  ]

  // @ts-ignore
  transform(() => {
    return {
      events: submittableEvents.map((event) => {
        return {
          ...event,
          amount: event.amount.cents,
          data: JSON.stringify(event.data)
        }
      })
    }
  })

  return {
    allItemsReviewed,
    extraAmount,
    extraEvent,
    extraCategoryOptions,
    categories,
    isSubmittable,
    postEvents,
    setCategory,
    setExtraEventKey,
    submitHandler
  }
}

export {
  decorate,
  useFinalizeEventsForm,
  CREATE_EXTRA_EVENT,
  FinalizeCategory,
  FinalizeFormCategory,
  FinalizeCategoryEvent,
  FinalizeCategoryFormItem,
  T_CREATE_EXTRA_EVENT,
  UpdateCategoryProps
}
