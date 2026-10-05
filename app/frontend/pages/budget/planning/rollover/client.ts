import { router } from "@inertiajs/react";
import { useRef } from "react";
import { CreateEvent } from "@/lib/create-events-client";
import { getBudgetMonth } from "@/pages/budget/month-store";
import {
  useFeaturedCategory,
  useNeighborLinks,
  useRolloverStore,
} from "./store";
import { ItemChanges } from "./suggestions";

const DEBOUNCE_MS = 500;

const useRolloverClient = () => {
  const { currentCategoryHref } = useNeighborLinks();
  const setEdit = useRolloverStore((s) => s.setEdit);
  const clearEdit = useRolloverStore((s) => s.clearEdit);
  const featuredCategory = useFeaturedCategory();
  const { month, year } = getBudgetMonth();
  const rolloverRoute = ["/budget", month, year, "roll-over"].join("/");
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const putItem = (key: string, changes: ItemChanges) => {
    const body = {
      item: {
        key,
        eventKey: changes.eventKey,
        adjustment: changes.adjustment,
      },
    };

    router.put(currentCategoryHref, body, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => clearEdit(key, changes),
    });
  };

  // Shows the change right away. `debounce` waits for typing to settle
  // before saving, the same as the Setup page.
  const updateItem = (
    key: string,
    changes: ItemChanges,
    opts: { debounce?: boolean } = {},
  ) => {
    setEdit(key, changes);

    const pending = debounceRefs.current[key];
    if (pending) clearTimeout(pending);

    if (opts.debounce) {
      debounceRefs.current[key] = setTimeout(
        () => putItem(key, changes),
        DEBOUNCE_MS,
      );
    } else {
      putItem(key, changes);
    }
  };

  // Stores (or clears, with null) where the remainder goes. The server sets
  // the month to the upcoming one.
  const updateUnappliedTarget = (event: CreateEvent | null) => {
    const target = event && {
      key: event.key,
      eventType: event.eventType,
      budgetCategoryKey: event.budgetCategoryKey,
      budgetItemKey: event.budgetItemKey,
      name: event.name,
      slug: event.slug,
    };

    router.put(
      rolloverRoute,
      { target, slug: featuredCategory.slug },
      { preserveState: true, preserveScroll: true },
    );
  };

  return { updateItem, updateUnappliedTarget };
};

export { useRolloverClient };
