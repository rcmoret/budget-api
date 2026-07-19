import { AmountSpan } from "@/components/amount-span";
import { EventAmountInput, ItemTotalAmountInput } from "./event-amount-input";
import { useEventContext, useEventFlagsContext } from "./event-context";
import { BudgetedSuggestion } from "@/pages/budget/planning/setup/featured-category/suggestions/budgeted";
import { SpentSuggestion } from "@/pages/budget/planning/setup/featured-category/suggestions/spent";
import { NoChangeSuggestion } from "@/pages/budget/planning/setup/featured-category/suggestions/no-change";
import { useSetupClient } from "@/pages/budget/planning/setup/client";
import { CloseButton } from "@/components/close-button";
import { useAdjustmentInputsContext } from "@/components/adjustment-input/context-provider";
import { BaselineAmountSuggestion } from "../suggestions/baseline_amount";

const DeleteButton = () => {
  const { deleteEvent } = useSetupClient();
  const { event } = useEventContext();

  const onClick = () => deleteEvent(event.budgetItemKey);

  return (
    <CloseButton
      onClick={onClick}
      tabIndex={-1}
      title="Remove Event"
      ariaLabel="Remove Event"
    />
  );
};

const CreateItemForm = () => {
  const { eqPrevSpent } = useEventFlagsContext();
  const { event } = useEventContext();

  return (
    <EventForm>
      <div className="col-span-2">Create Item</div>
      <div className="-col-start-1 -col-end-1 flex justify-end">
        <DeleteButton />
      </div>
      <BudgetedSuggestion />
      {!eqPrevSpent && !!event.transactionsTotal.cents && <SpentSuggestion />}
      <BaselineAmountSuggestion />
      <ItemTotalAmountInput />
    </EventForm>
  );
};

const AdjustItemForm = () => {
  const { adjustment } = useAdjustmentInputsContext();
  return (
    <EventForm>
      <div className="col-span-full">Adjust Item</div>
      <div className="col-span-full grid grid-cols-subgrid">
        <div className="col-span-2">currently budgeted</div>
        <div className="text-end -col-start-2 -col-end-1">
          <AmountSpan amount={adjustment.initialAmount} />
        </div>
      </div>
      <NoChangeSuggestion />
      <BaselineAmountSuggestion />
      <EventAmountInput />
    </EventForm>
  );
};

const EventForm = (props: { children: React.ReactNode }) => {
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
