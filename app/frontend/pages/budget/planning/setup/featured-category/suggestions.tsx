import { BudgetPlanningEvent } from "@/types/budget/planning"
import { getFeaturedCategory } from "../store"
import { BudgetCategoryEventFlagsType, SetupEvents } from "@/types/budget/planning/setup"

const EventSuggestion = (props: { event: BudgetPlanningEvent<SetupEvents, BudgetCategoryEventFlagsType> }) => {
  const { event } = props

  return (
    <div>
      {event.eventType}
    </div>
  )
}

const Suggestions = () => {
  const featuredCategory = getFeaturedCategory()
  const { events } = featuredCategory
  console.log(featuredCategory)

  return (
    <div>
      {events.map((event) => (
        <EventSuggestion key={event.budgetItemKey} event={event} />
      ))}
    </div>
  )
}

export { Suggestions }
