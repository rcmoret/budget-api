import {
  useFeaturedCategory,
  useSetupData,
  useCurrentFeaturedCategoryRoute,
  useTrackedEvents,
} from "./store";
import { router } from "@inertiajs/react";

const useSetupClient = () => {
  const setupData = useSetupData();
  const { getEvent, clearRef: onSuccess } = useTrackedEvents();
  const featuredCategory = useFeaturedCategory();
  const currentCategoryRoute = useCurrentFeaturedCategoryRoute();

  const updateEvents = (events: Array<{ key: string; amount: string }>) => {
    const route = setupData.currentCategoryHref;
    const body = {
      events: events.map(({ key, amount }) => ({
        budgetItemKey: key,
        adjustment: { display: amount },
      })),
    };

    router.put(route, body, { preserveState: true });
  };

  const updateCategory = (props?: { slug: string }) => {
    const body = {
      events: featuredCategory.events.map(({ adjustment, budgetItemKey }) => {
        const latestAdjustment = getEvent({ itemKey: budgetItemKey });

        if (latestAdjustment === undefined) {
          return { budgetItemKey, adjustment };
        } else {
          return {
            budgetItemKey,
            adjustment: { display: latestAdjustment },
          };
        }
      }),
    };

    const route = currentCategoryRoute(props?.slug);

    router.put(route, body, { onSuccess, preserveState: true });
  };

  return {
    updateCategory,
    updateEvents,
  };
};

export { useSetupClient };
