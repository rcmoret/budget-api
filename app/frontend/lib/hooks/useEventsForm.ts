import { useForm } from "@inertiajs/react";
import { SetUpEvent } from "./useSetUpEventsForm";
import { TInputAmount } from "@/components/common/AmountInput";
import { inputAmount } from "@/components/common/AmountInput";

type AdjustEvents = "item_adjust" | "multi_item_adjust" | "rollover_item_adjust" | "setup_item_adjust"

const ADJUST_EVENTS = ["item_adjust", "multi_item_adjust", "rollover_item_adjust", "setup_item_adjust"]

const isAdjust = (event: EventProps | SetUpEvent) => ADJUST_EVENTS.includes(event.eventType)

export type AdjustEventProps = {
  key: string;
  eventType: AdjustEvents;
  amount: TInputAmount;
  budgetItemKey: string;
  data?: string;
}

type CreateEvents =
  "item_create" |
  "multi_item_adjust_create" |
  "pre_setup_item_create" |
  "pre_setup_multi_item_adjust_create" |
  "rollover_item_create" |
  "setup_item_create"

const CREATE_EVENTS = [
  "item_create",
  "multi_item_adjust_create",
  "pre_setup_item_create",
  "pre_setup_multi_item_adjust_create",
  "rollover_item_create",
  "setup_item_create",
]

const isCreate = (event: EventProps | SetUpEvent) => CREATE_EVENTS.includes(event.eventType)

export type CreateEventProps = {
  key: string;
  eventType: CreateEvents;
  amount: TInputAmount;
  budgetCategoryKey: string;
  budgetItemKey: string;
  month: string | number;
  year: string | number;
  data?: any;
}

type DeleteEvents =
  "item_delete" |
  "multi_item_adjust_delete" |
  "setup_item_delete" 

const DELETE_EVENTS = ["item_delete", "multi_item_adjust_delete", "setup_item_delete"]

const isDelete = (event: EventProps | SetUpEvent) => DELETE_EVENTS.includes(event.eventType)

export type DeleteEventProps = {
  key: string;
  eventType: DeleteEvents;
  budgetItemKey: string;
  amount: TInputAmount;
  data?: any;
}

export type EventProps = AdjustEventProps | CreateEventProps | DeleteEventProps 

type EventFormProps = {
  events: Array<EventProps>;
  month: number;
  year: number;
  redirectSegments?: Array<string>;
}

const useEventForm = (props: EventFormProps) => {
  const { data, setData, processing, post, transform } = useForm({
    events: props.events
  })

  const addEvent = (event: EventProps) => {
    setData({ events: [ ...data.events, event ]})
  }

  const updateEvent = (key: string, amount: number | string) => {
    setData({
      events: data.events.map((event) => {
        if (key !== event.key) {
          return event
        } else {
          return { ...event, amount: inputAmount({ display: String(amount) }).cents } as EventProps
        }
      })
    })
  }

  const removeEvent = (key: string) => {
    setData({
      events: data.events.filter((event) => key !== event.key)
    })
  }

  return {
    addEvent,
    events: data.events,
    processing,
    post,
    removeEvent,
    setEventsData: setData,
    transform,
    updateEvent
  }
}

export {
  useEventForm,
  // ADJUST_EVENTS,
  isAdjust,
  isCreate,
  isDelete,
}
