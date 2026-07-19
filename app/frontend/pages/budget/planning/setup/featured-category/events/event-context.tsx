import { BudgetPlanningEvent } from "@/types/budget/planning";
import {
  BudgetCategoryEventFlagsType,
  SetupEvents,
} from "@/types/budget/planning/setup";
import { createContext, useContext, useRef, useState } from "react";
import { AdjustItemForm, CreateItemForm } from ".";
import { adjustmentFromTotal } from "@/lib/adjustment-amount-store";
import { useSetupClient } from "@/pages/budget/planning/setup/client";
import { useAdjustmentInputsContext } from "@/components/adjustment-input/context-provider";

type TEvent = BudgetPlanningEvent<SetupEvents, BudgetCategoryEventFlagsType>;
type TSuggestionName =
  | "baseline"
  | "budgeted"
  | "spent"
  | "delete"
  | "unchanged"
  | null;

type EventContextType = {
  event: TEvent;
  selectedSuggestion: TSuggestionName;
  setAmount: (p: { adjustment?: string; total?: string }) => void;
  setSelectedSuggestion: (s: TSuggestionName) => void;
};

const EventContext = createContext<null | EventContextType>(null);

const EventProvider = (props: { children: React.ReactNode; event: TEvent }) => {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<TSuggestionName>(null);
  const { event } = props;
  const { updateEvents: putEvents } = useSetupClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { adjustment, updateItemByAdjustment, updateItemByTotal } =
    useAdjustmentInputsContext();
  const queueChange = (amount: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      putEvents([{ key: event.budgetItemKey, amount }]);
    }, 500);
  };
  const setAmount = (amountProps: { adjustment?: string; total?: string }) => {
    if (!amountProps.adjustment && !amountProps.total) {
      console.log("no-op: no amount provided");
      return;
    }

    if (amountProps.adjustment) {
      const amount = amountProps.adjustment;
      updateItemByAdjustment(amount);
      queueChange(amount);
    }

    if (amountProps.total) {
      const total = amountProps.total;
      updateItemByTotal(total);
      // Derive the adjustment ourselves instead of reading it back off
      // `adjustment`, which is still the pre-update value in this closure.
      const { adjustmentAmount } = adjustmentFromTotal({
        total,
        initialAmount: adjustment.initialAmount,
      });
      queueChange(adjustmentAmount.display);
    }
  };

  const isReviewed = !!adjustment.adjustmentAmount.display;

  const flags = {
    ...event.flags,
    eqPrevBudgeted:
      adjustment.adjustmentAmount.cents === event.previouslyBudgeted.cents,
    unreviewed: !isReviewed,
    isReviewed,
  };

  const value: EventContextType = {
    event: {
      ...event,
      amount: {
        cents: adjustment.adjustmentAmount.cents,
        display: adjustment.adjustmentAmount.display,
      },
      flags,
      updatedAmount: {
        cents: adjustment.newTotal.cents,
        display: adjustment.newTotal.display,
      },
    },
    selectedSuggestion,
    setAmount,
    setSelectedSuggestion,
  };

  return (
    <EventContext.Provider value={value}>
      {props.children}
    </EventContext.Provider>
  );
};

const EventForm = () => {
  const { event } = useEventContext();

  if (event.eventType === "setup_item_create") {
    return <CreateItemForm />;
  } else {
    return <AdjustItemForm />;
  }
};

const useEventContext = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }

  return context;
};

const useEventFlagsContext = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error(
      "useEventFlagsContext must be used within an EventProvider",
    );
  }

  return context.event.flags;
};

export type { TEvent };
export { EventForm, EventProvider, useEventContext, useEventFlagsContext };
