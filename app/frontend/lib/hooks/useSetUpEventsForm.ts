import { EventProps, useEventForm, isAdjust, isCreate, isDelete } from "@/lib/hooks/useEventsForm";
import { BudgetCategory } from "@/types/budget";
import { useEffect, useState } from "react";
import { generateKeyIdentifier } from "../KeyIdentifier";
import { inputAmount, TInputAmount } from "@/components/common/AmountInput";

const ADJUST_EVENT = "setup_item_adjust"
const CREATE_EVENT = "setup_item_create"
const DELETE_EVENT = "setup_item_delete"

interface TEvent {
  key: string;
  budgeted: number;
  data?: any;
  eventType: "setup_item_create" | "setup_item_adjust" | "setup_item_delete";
  spent: number;
  budgetItemKey?: string;
  budgetCategoryKey?: string;
  month?: number;
  year?: number;
}

export interface SetUpEvent extends TEvent {
  amount: TInputAmount;
}

interface ResponseEvent extends TEvent {
  amount: number;
}

export interface SetUpCategory extends BudgetCategory {
  events: Array<SetUpEvent>
  upcomingMaturityIntervals?: Array<{
    month: number;
    year: number;
  }>
}

export interface ResponseSetUpCategory extends BudgetCategory {
  events: Array<ResponseEvent>
}

export type CategoryUpdateProps = {
  upcomingMaturityIntervals?: Array<{
    month: number;
    year: number;
  }>;
}

type HookProps = {
  categories: Array<ResponseSetUpCategory>;
  month: number;
  year: number;
}

const mapCategories = (categories: Array<ResponseSetUpCategory>): Array<SetUpCategory> => {
  const handle = (event: ResponseEvent): SetUpEvent => {
    const amount = event.amount ? inputAmount({ cents: event.amount }) : inputAmount({ display: "" })
    return { ...event, amount }
  }
  return categories.map((category) => {
    return {
      ...category,
      events: category.events.map(handle)
    }
  })
}

const useSetUpEventsForm = (props: HookProps) => {
  const [categories, setCategories] = useState<SetUpCategory[]>(mapCategories(props.categories))
  const { month, year } = props

  const addCreateEvent = ({ key, amount }: { key: string, amount: TInputAmount }) => setCategories(
    categories.map((category) => {
      if (category.key !== key) {
        return category
      } else {
        return {
          ...category,
          events: [
            ...category.events,
            {
              key: generateKeyIdentifier(),
              budgeted: 0,
              spent: 0,
              amount,
              month,
              year,
              eventType: CREATE_EVENT,
              budgetCategoryKey: key
            }
          ]
        }
      }
    })
  )

  const removeEvent = (props: { categoryKey: string, eventKey: string }) => {
    const { categoryKey, eventKey } = props

    setCategories(
      categories.map((category) => {
        if (category.key !== categoryKey) { return category }

        const events = category.events.filter((event) => event.key !== eventKey)
        return {
          ...category,
          events
        }
      })
    )
  }

  const removeItem = (props: { categoryKey: string, eventKey: string }) => {
    const { categoryKey, eventKey } = props

    setCategories(
      categories.map((category) => {
        if (category.key !== categoryKey) { return category }

        const budgetItemKey = category.events.find((event) => event.key === eventKey)?.budgetItemKey || ""
        const events = category.events.filter((event) => event.key !== eventKey )
        return {
          ...category,
          events: [
            ...events,
            {
              key: generateKeyIdentifier(),
              eventType: DELETE_EVENT,
              amount: inputAmount({ cents: 0 }),
              spent: 0,
              budgeted: 0,
              budgetItemKey
            }
          ]
        }
      })
    )
  }

  const updateCategory = (props: { key: string, category: SetUpCategory }) => {
    setCategories(
      categories.map((category) => {
        if (category.key !== props.key) {
          return category
        } else {
          return {
            ...props.category,
            events: category.events
          }
        }
      })
    )
  }

  const updateEvent = (props: { categoryKey: string, eventKey: string, amount: TInputAmount }) => {
    const { categoryKey, eventKey, amount } = props

    setCategories(
      categories.map((category) => {
        if (category.key !== categoryKey) {
          return category
        } else {
          return {
            ...category,
            events: category.events.map((event) => {
              if (event.key !== eventKey) {
                return event
              } else {
                return { ...event, amount }
              }
            })
        }
        }
      })
    )
  }

  const eventModel = (event: SetUpEvent): EventProps => {
    const { amount, data, key } = event

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
    }
    if (isAdjust(event)) {
      return {
        key,
        eventType: ADJUST_EVENT,
        amount,
        data,
        budgetItemKey: String(event.budgetItemKey),
      }
    }

    return {
      key,
      eventType: DELETE_EVENT,
      data,
      amount,
      budgetItemKey: String(event.budgetItemKey),
    }
}

  const formEvents = categories.flatMap((category) => category.events)

  const { processing, events, post, setEventsData, transform } = useEventForm({
    month,
    year,
    events: formEvents.map(eventModel)
  })

  const isChanged = (event: EventProps) => {
    if (isCreate(event)) {
      return !!event.amount.cents }
    if (isDelete(event)) {
      return true
    }
    if (isAdjust(event)) {
      const budgeted = formEvents.find((ev) => ev.key === event.key)?.budgeted
      return budgeted !== event.amount
    }
    return false
  }

  // @ts-ignore
  transform(() => {
    return {
      events: events.filter(isChanged).map((event) => {
        return {
          ...event,
          amount: event.amount.cents,
          data: JSON.stringify(event.data)
        }
      })
    }
  })

  useEffect(() => {
    setEventsData({
      events: formEvents.map(eventModel)
    })
  }, [categories])

  const totalBudgeted = events.reduce((accumulator, ev) => accumulator + Number(ev.amount.cents), 0)

  const isSubmittable = !processing &&
    events.every((event) => isChanged(event) || event.eventType === "setup_item_adjust")

  return {
    addCreateEvent,
    categories,
    isSubmittable,
    removeEvent,
    post,
    removeItem,
    totalBudgeted,
    updateCategory,
    updateEvent
  }
}

export { useSetUpEventsForm }
