import { GroupLabel } from "@/components/group-label";
import {
  useFeaturedCategory,
  useSetupData,
  useToggleReviewedCategoryVisibility,
} from "../store";
import { EventProvider, EventForm } from "./events/event-context";
import { AdjustmentInputsProvider } from "@/components/adjustment-input/context-provider";
import { Link } from "@inertiajs/react";

const FeaturedCategoryComponent = () => {
  const category = useFeaturedCategory();
  const { events } = category;

  const gridClassName = [
    "grid-cols-[auto_1fr_auto]",
    "gap-x-2",
    "gap-y-4",
    "p-1",
  ].join(" ");

  const categoryClassName = [
    "bg-base-300",
    "col-span-full",
    "grid",
    "grid-cols-subgrid",
    "content-start",
    "py-4",
    "px-2",
    "rounded",
  ].join(" ");

  return (
    <div className={gridClassName}>
      <div className="col-span-full">
        <GroupLabel>{category.name}</GroupLabel>
      </div>
      <div id={category.key} className={categoryClassName}>
        {events.map((event) => (
          <AdjustmentInputsProvider
            key={event.objectKey}
            editing="adjustment"
            objectKey={event.objectKey}
          >
            <EventProvider key={event.budgetItemKey} event={event}>
              <EventForm />
            </EventProvider>
          </AdjustmentInputsProvider>
        ))}
      </div>
      <FormLinks />
    </div>
  );
};

const FormLinks = () => {
  const {
    nextCategoryHref,
    nextCategoryName,
    nextUnreviewedCategoryName,
    nextUnreviewedCategoryHref,
    previousCategoryHref,
    previousCategoryName,
    previousUnreviewedCategoryHref,
    previousUnreviewedCategoryName,
  } = useSetupData();
  const { toggleValue } = useToggleReviewedCategoryVisibility();

  const previousCategory = toggleValue
    ? {
        label: previousCategoryName,
        href: previousCategoryHref,
      }
    : {
        label: previousUnreviewedCategoryName,
        href: previousUnreviewedCategoryHref,
      };
  const nextCategory = toggleValue
    ? {
        label: nextCategoryName,
        href: nextCategoryHref,
      }
    : {
        label: nextUnreviewedCategoryName,
        href: nextUnreviewedCategoryHref,
      };
  console.log(toggleValue);

  return (
    <div className="col-span-full flex justify-between">
      <div className="grid gap-1">
        <div className="underline">previous</div>
        <div>
          <Link href={previousCategory.href}>{previousCategory.label}</Link>
        </div>
      </div>
      <div className="grid gap-1">
        <div className="underline text-right">next</div>
        <div>
          <Link href={nextCategory.href}>{nextCategory.label}</Link>
        </div>
      </div>
    </div>
  );
};

export { FeaturedCategoryComponent };
