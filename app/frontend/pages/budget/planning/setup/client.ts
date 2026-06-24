import { getFeaturedCategory, getSetupData, useCurrentFeaturedCategoryRoute, useEventsRef } from "./store"
import { router } from "@inertiajs/react";

const useSetupClient = () => {
  const setupData = getSetupData()
  const { getEvent, clearRef: onSuccess, updateEvents: updateEventsReference } = useEventsRef()
  const featuredCategory = getFeaturedCategory()

  const updateEvents = (events: Array<{ key: string; amount: string; }>) => {
    const route = setupData.currentCategoryHref
    const body = {
      events: events.map(({ key, amount }) => ({
        budgetItemKey: key,
        adjustment: { display: amount },
      }))
    }

    updateEventsReference(events)
    router.put(route, body, { preserveState: true })
  }

  const updateCategory = (props?: { slug: string }) => {
    const currentCategoryRoute = useCurrentFeaturedCategoryRoute()

    const body = {
      events: featuredCategory.events.map(({ adjustment, budgetItemKey }) => {

        const latestAdjustment = getEvent({ itemKey: budgetItemKey })

        if (latestAdjustment === undefined) {
          return { budgetItemKey, adjustment };
        } else {
          return {
            budgetItemKey,
            adjustment: { display: latestAdjustment },
          };
        }
      })
    }

    const route = currentCategoryRoute(props?.slug)

    router.put(route, body, { onSuccess, preserveState: true })
  }


  return {
    updateCategory,
    updateEvents
  }
}

export { useSetupClient }
