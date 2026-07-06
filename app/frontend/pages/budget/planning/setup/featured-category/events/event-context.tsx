import { BudgetPlanningEvent } from "@/types/budget/planning";
import {
  BudgetCategoryEventFlagsType,
  SetupEvents,
} from "@/types/budget/planning/setup";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AdjustItemForm, CreateItemForm } from ".";
import { MonetaryAmount } from "@/types/amount";
import { decimalToInt, moneyFormatter } from "@/lib/money-formatter";
import { useTrackedEvents } from "@/pages/budget/planning/setup/store";
import { useSetupClient } from "@/pages/budget/planning/setup/client";

type InputAmountProps = {
  decimal?: string | number;
  cents?: number;
  display?: string;
};

const inputAmount = (props: InputAmountProps): MonetaryAmount => {
  const { cents, display } = props;

  if (display === "" || !!display) {
    return {
      cents: decimalToInt(display),
      display: display,
    };
  } else {
    const amount = cents || 0;

    return {
      cents: amount,
      display: moneyFormatter(amount),
    };
  }
};

type TEvent = BudgetPlanningEvent<SetupEvents, BudgetCategoryEventFlagsType>;
type TSuggestionName =
  | "budgeted"
  | "spent"
  | "default"
  | "delete"
  | "unchanged"
  | null;

type EventContextType = {
  event: TEvent;
  selectedSuggestion: TSuggestionName;
  setAmount: (amt: string) => void;
  setSelectedSuggestion: (s: TSuggestionName) => void;
  setUpdatedAmount: (amt: string) => void;
};

const EventContext = createContext<null | EventContextType>(null);

const EventProvider = (props: { children: React.ReactNode; event: TEvent }) => {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<TSuggestionName>(null);
  const { event } = props;
  const { getEvent, updateEvents } = useTrackedEvents();
  const { updateEvents: putEvents } = useSetupClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentAdjustmentAmount =
    getEvent({
      itemKey: event.budgetItemKey,
    }) ?? event.adjustment.display;
  const currentAdjustmentTuple = inputAmount({
    display: currentAdjustmentAmount,
  });
  const [adjustment, setAdjustment] = useState<MonetaryAmount>(
    currentAdjustmentTuple,
  );
  const setAmount = (amount: string) => {
    const newadjustment = inputAmount({ display: amount });
    // Update local + tracked state immediately so flags/validation react now.
    setAdjustment(newadjustment);
    updateEvents([{ key: event.budgetItemKey, amount }]);

    // Debounce the server PUT until typing settles.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      putEvents([{ key: event.budgetItemKey, amount }]);
    }, 500);
  };

  // Total is derived: currently budgeted (item amount) + adjustment. Deriving
  // it instead of holding separate state keeps it in sync with the adjustment.
  const updatedAmount = inputAmount({
    cents: event.amount.cents + adjustment.cents,
  });

  // Editing the total changes the delta: adjustment = total - currently budgeted.
  const setUpdatedAmount = (total: string) => {
    const totalCents = inputAmount({ display: total }).cents;
    const adjustmentCents = totalCents - event.amount.cents;
    setAmount(inputAmount({ cents: adjustmentCents }).display);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const isReviewed = !!adjustment.display;

  const flags = {
    ...event.flags,
    eqPrevBudgeted: adjustment.cents === event.previouslyBudgeted.cents,
    unreviewed: !isReviewed,
    isReviewed,
  };

  // console.log({ event, adjustment });
  const value: EventContextType = {
    event: {
      ...event,
      adjustment,
      flags,
      updatedAmount,
    },
    selectedSuggestion,
    setAmount,
    setSelectedSuggestion,
    setUpdatedAmount,
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
export {
  inputAmount,
  EventForm,
  EventProvider,
  useEventContext,
  useEventFlagsContext,
};
