import { useState, useRef } from "react";
import { createContext, useContext } from "react";
import { SetupEvent, TEventFlags } from "@/pages/budget/set_up/types";
import { useSetupEventsFormContext } from "@/pages/budget/set_up";
import { KeySpan } from "@/components/common/KeySpan";
import { i18n } from "@/lib/i18n";
import { useSetUpCategoryShowContext } from "@/pages/budget/set_up/categories";
import { TInputAmount, inputAmount } from "@/components/common/AmountInput";

type TSuggestionName =
  | "budgeted"
  | "spent"
  | "default"
  | "delete"
  | "unchanged"
  | null;

type TSetUpCategoryEventContext = {
  amount: string;
  event: SetupEvent;
  eventTypeLabel: string;
  flags: TEventFlags & { showSpentSuggestions: boolean };
  index: number;
  removeEvent: () => void;
  selectedSuggestion: TSuggestionName;
  setters: {
    setAmount: (amt: string) => void;
    setBudgeted: () => void;
    setDefault: () => void;
    setDeleteIntent: () => void;
    setNoAjustment: () => void;
    setSelectedSuggestion: (s: TSuggestionName) => void;
    setSpent: () => void;
  };
  updateEvent: (a: { adjustment: TInputAmount; key: string }) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  focusInput: () => void;
};

const SetUpEventContext = createContext<TSetUpCategoryEventContext | null>(
  null,
);

const SetUpEventProvider = (props: {
  event: SetupEvent;
  index: number;
  children?: React.ReactNode;
}) => {
  const { removeEvent, updateEvents } = useSetupEventsFormContext();
  const { category } = useSetUpCategoryShowContext();
  const { event } = props;
  const [amount, setAmount] = useState<string>(event.adjustment.display ?? "");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<TSuggestionName>(null);
  const eventTypeLabel = i18n.t("events", event.eventType);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const updateAmount = (args: { adjustment: TInputAmount; key: string }) => {
    setAmount(args.adjustment.display ?? "");
    updateEvents([{ key: args.key, amount: args.adjustment.display ?? "" }]);
  };

  const setters = {
    setAmount,
    setBudgeted: () => {
      setSelectedSuggestion("budgeted");
      updateAmount({
        key: event.budgetItemKey,
        adjustment: inputAmount({ cents: event.previouslyBudgeted }),
      });
    },
    setDeleteIntent: () => {
      setSelectedSuggestion("delete");
      updateAmount({
        key: event.budgetItemKey,
        adjustment: inputAmount({ cents: -1 * event.amount }),
      });
    },
    setDefault: () => {
      setSelectedSuggestion("default");
      updateAmount({
        key: event.budgetItemKey,
        adjustment: inputAmount({ cents: category.defaultAmount }),
      });
    },
    setNoAjustment: () => {
      setSelectedSuggestion("unchanged");
      updateAmount({
        key: event.budgetItemKey,
        adjustment: inputAmount({ display: "0" }),
      });
    },
    setSpent: () => {
      setSelectedSuggestion("spent");
      updateAmount({
        key: event.budgetItemKey,
        adjustment: inputAmount({ cents: event.spent }),
      });
    },
    setSelectedSuggestion,
  };

  const flags: TEventFlags & { showSpentSuggestions: boolean } = {
    ...event.flags,
    showSpentSuggestions: event.flags.eqPrevSpent && !event.spent,
  };

  const removeEventHandler = () => {
    removeEvent({ key: event.budgetItemKey, slug: category.slug });
  };

  const value = {
    amount,
    eventTypeLabel,
    event: props.event,
    index: props.index,
    flags,
    removeEvent: removeEventHandler,
    selectedSuggestion,
    setters,
    updateEvent: updateAmount,
    inputRef,
    focusInput,
  };

  return (
    <SetUpEventContext.Provider value={value}>
      <KeySpan _key={props.event.budgetItemKey} />

      {props.children}
    </SetUpEventContext.Provider>
  );
};

const useSetUpEventContext = (): TSetUpCategoryEventContext => {
  const context = useContext(SetUpEventContext);
  if (!context) {
    throw new Error(
      "useSetUpCategoryContext must be used with a Set Up Event Provider",
    );
  }
  return context;
};

export {
  SetUpEventProvider as EventShow,
  useSetUpEventContext,
  useSetUpEventContext as useSetupEventContext,
};
