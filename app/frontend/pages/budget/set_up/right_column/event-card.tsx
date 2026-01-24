import { useRef } from "react";
import { Row } from "@/components/common/Row"
import { AmountInput, inputAmount, TInputAmount, warningOutlineClasses, defaultOutlineClasses } from "@/components/common/AmountInput";
import { Suggestions } from "./suggestions";
import { AmountSpan } from "@/components/common/AmountSpan";
import { useSetUpEventContext } from "@/pages/budget/set_up/events";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";

const NewAmount = () => {
  const { event } = useSetUpEventContext()

  const className = [
    ...(!event.updatedAmount ? ["font-semibold"] : []),
  ].join(" ")

  return (
    <div className="w-full flex flex-row justify-between">
      <div>
        New amount:
      </div>
      <div className={className}>
        <AmountSpan amount={event.updatedAmount} />
      </div>
    </div>
  )
}

const PreviouslyBudgetedAmount = () => {
  const { event } = useSetUpEventContext()

  return (
    <div className="w-full flex flex-row justify-between">
      <div>
        Budgeted
      </div>
      <div>
        <AmountSpan amount={event.amount} />
      </div>
    </div>
  )
}

const DeleteButton = () => {
  const { removeEvent } = useSetUpEventContext()

  return (
    <div>
      <Button type="button" onClick={removeEvent} styling={{ color: "text-red-600" }}>
        <Icon name="times-circle" />
      </Button>
    </div>
  )
}

const EventCard = () => {
  const {
    amount,
    event,
    eventTypeLabel,
    index,
    flags,
    setters,
    updateEvent,
  } = useSetUpEventContext()

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = (inputamount: string) => {
    const amount = inputAmount({ display: inputamount })
    setters.setAmount(amount.display)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a new timeout to call updateEvent after the delay
    timeoutRef.current = setTimeout(() => {
      updateEvent({ key: event.budgetItemKey, adjustment: amount })
    }, 500)
  }

  let initialInputAmount: TInputAmount = inputAmount({ display: "" })
  if (flags.eqPrevSpent && event.amount === 0) {
    initialInputAmount = inputAmount({ cents: event.previouslyBudgeted })
  }

  const outlineClasses = flags.isValid ? {
    ...defaultOutlineClasses,
    classes: ["numericInput", ...defaultOutlineClasses.classes]
  } : {
    ...warningOutlineClasses,
    classes: ["numericInput", ...warningOutlineClasses.classes]

  }

  const backgroundColor = flags.unreviewed ? "bg-gray-25" : "bg-blue-20"

  return (
    <Row styling={{
      flexDirection: "flex-col",
      gap: "gap-4",
      // flexWrap: "flex-wrap",
      flexAlign: "justify-between",
      margin: "mb-4",
      rounded: "rounded-lg",
      padding: "p-4",
      backgroundColor
    }}>
      <div className="w-full flex flex-row justify-between">
        <div>
          {eventTypeLabel}
        </div>
        <div>
          {event.eventType === "setup_item_create" && <DeleteButton />}
        </div>
      </div>
      <div className="w-full flex flex-row justify-between gap-4">
        <Suggestions />
        <div className="flex flex-col gap-2">
          {event.eventType === "setup_item_adjust" && <PreviouslyBudgetedAmount />}
          <AmountInput
            name="setup-event"
            amount={inputAmount({ display: amount })}
            onChange={onChange}
            tabindex={index + 3}
            {...outlineClasses}
          />
          {event.eventType === "setup_item_adjust" && <NewAmount />}
        </div>
      </div>
    </Row>
  )
}

export { EventCard }
