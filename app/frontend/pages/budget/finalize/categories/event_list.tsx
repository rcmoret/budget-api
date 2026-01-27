import { useCategory } from "./context_provider";
import { FinalizeCategoryEvent } from "@/lib/hooks/useFinalizeEventsForm";
import { AmountSpan } from "@/components/common/AmountSpan";
import { ReactNode } from "react";

const LineItem = (props: {
  description: string | ReactNode;
  prefix?: string;
  separator?: string | false;
  children?: ReactNode;
}) => {
  const separator = !props.separator ? "" : props.separator;
  return (
    <div className="flex flex-row gap-4">
      <div className="w-4">{props.prefix || ""}</div>
      <div className="w-16 text-right">{props.children}</div>
      <div>{separator}</div>
      <div>{props.description || ""}</div>
    </div>
  );
};
const EventItem = (props: { event: FinalizeCategoryEvent }) => {
  const { key } = props.event;
  const { category } = useCategory();
  const singleMatched =
    category.items.length === 1 && category.events.length === 1;

  const items = category.items.filter((item) => {
    return singleMatched || item.eventKey === key;
  });

  return (
    <div>
      {items.map((item) => (
        <LineItem key={item.key} description="roll-over" prefix="+">
          <AmountSpan absolute={true} amount={item.rolloverAmount.cents || 0} />
        </LineItem>
      ))}
    </div>
  );
};

const InitialLineItem = (props: { event: FinalizeCategoryEvent }) => {
  if (props.event.eventType === "rollover_item_create") {
    const description = "new item";

    return (
      <LineItem description={description}>
        <AmountSpan amount={0} absolute={true} />
      </LineItem>
    );
  } else {
    const description = "currently budgeted";

    return (
      <LineItem description={description}>
        <AmountSpan amount={props.event.amount} absolute={true} />
      </LineItem>
    );
  }
};

const EventSummary = (props: { event: FinalizeCategoryEvent }) => {
  const { event } = props;
  const { category, effectiveEvents, effectItems, rolloverAmountFor } =
    useCategory();

  const total = rolloverAmountFor(event.key);

  if (
    category.items.length === 1 &&
    effectiveEvents.length === 1 &&
    event.eventType === "rollover_item_create"
  ) {
    return (
      <div className="w-full flex flex-col gap-2 my-2 px-4 py-2 ">
        <div>New Item</div>
        <LineItem description="amount">
          <AmountSpan absolute={true} amount={total} />
        </LineItem>
      </div>
    );
  } else if (event.eventType === "rollover_item_create") {
    return (
      <div className="w-full flex flex-col gap-2 my-2 px-4 py-2 ">
        <div>New Item ({event.key})</div>
        {effectItems.map((item) => (
          <LineItem
            key={item.key}
            description={`amount from (${item.key})`}
            prefix="+"
          >
            <AmountSpan
              absolute={true}
              amount={item.rolloverAmount.cents || 0}
            />
          </LineItem>
        ))}
        <div className="w-4/12 h-0.5 bg-chartreuse-200 px-2"></div>
        <LineItem description="" separator="">
          <AmountSpan absolute={true} amount={total} />
        </LineItem>
      </div>
    );
  } else {
    // adjustment
    return (
      <div className="w-full flex flex-col gap-2 my-2 px-4 py-2 ">
        <InitialLineItem event={event} />
        <EventItem event={event} />
        <div className="w-4/12 h-0.5 bg-chartreuse-200 px-2"></div>
        <LineItem description="new amount">
          <AmountSpan absolute={true} amount={total + event.amount} />
        </LineItem>
      </div>
    );
  }
};

const EventList = () => {
  const { effectiveEvents: events, effectItems: items } = useCategory();

  if (!!items.length) {
    return (
      <div className="flex flex-col gap-2 border border-chartreuse-200 rounded p-4 mb-2 bg-chartreuse-50 shadow-lg">
        {events.map((event) => (
          <div
            key={event.key}
            className="w-full flex flex-col gap-2 my-2 px-4 py-2"
          >
            <EventSummary event={event} />
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export { EventList };
