import { GroupLabel } from "@/components/group-label";
import { useFeaturedCategory } from "../store";
import { EventProvider, EventForm } from "./events/event-context";
const FeaturedCategoryComponent = () => {
  const category = useFeaturedCategory();
  const { events } = category;

  const gridClasses = [
    "grid",
    "grid-cols-[auto_1fr_auto]",
    "gap-x-2 gap-y-4 p-1",
    "content-start",
  ];

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
    <div className={gridClasses.join(" ")}>
      <div className="col-span-full">
        <GroupLabel>{category.name}</GroupLabel>
      </div>
      <div id={category.key} className={categoryClassName}>
        {events.map((event) => (
          <EventProvider key={event.budgetItemKey} event={event}>
            <EventForm />
          </EventProvider>
        ))}
      </div>
    </div>
  );
};

export { FeaturedCategoryComponent };
