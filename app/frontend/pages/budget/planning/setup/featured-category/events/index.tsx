import { AmountSpan } from "@/components/amount-span";
import {
  AdjustEventAmountInput,
  ItemTotalAmountInput,
} from "./event-amount-input";
import { useEventContext, useEventFlagsContext } from "./event-context";
import { BudgetedSuggestion } from "../suggestions/budgeted";
import { SpentSuggestion } from "../suggestions/spent";
import { NoChangeSuggestion } from "../suggestions/no-change";

const CreateItemForm = () => {
  const { eqPrevSpent } = useEventFlagsContext();

  return (
    <EventForm>
      <div className="col-span-full">Create Item</div>
      <BudgetedSuggestion />
      {eqPrevSpent && <SpentSuggestion />}
      <ItemTotalAmountInput />
    </EventForm>
  );
};

const AdjustItemForm = () => {
  const { event } = useEventContext();
  return (
    <EventForm>
      <div className="col-span-full">Adjust Item</div>
      <div className="col-span-full grid grid-cols-subgrid">
        <div className="col-span-2">currently budgeted</div>
        <div className="text-end -col-start-2 -col-end-1">
          <AmountSpan amount={event.amount.cents} />
        </div>
      </div>
      <NoChangeSuggestion />
      <AdjustEventAmountInput />
    </EventForm>
  );
};

const EventForm = (props: { children: React.ReactNode }) => {
  const { unreviewed } = useEventFlagsContext();

  const className = [
    "text-sm",
    "font-semi",
    "grid",
    "grid-cols-subgrid",
    "col-span-full",
    "content-start",
    "gap-y-4",
    "outline",
    "outline-neutral-600",
    "rounded",
    "px-2",
    "pt-1",
    "pb-6",
    "mb-6",
  ].join(" ");

  return <div className={className}>{props.children}</div>;
};

export { AdjustItemForm, CreateItemForm };
