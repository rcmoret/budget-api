import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TCategoryScope } from "@/types/budget/planning";
import {
  CreateEvent,
  fetchCreateEvents,
  TCreateEventClientContext,
} from "@/lib/create-events-client";
import Select from "react-select";

type TComponentState = "initialized" | "loading" | "fetched";

type CreateEventSelectProps = {
  excludedKeys?: Array<string>;
  scopes: Array<TCategoryScope>;
  eventContext: TCreateEventClientContext;
  children: React.ReactNode;
  month: string | number;
  year: string | number;
};

type EventSelectProviderType = {
  excludedKeys: Array<string>;
  scopes: Array<TCategoryScope>;
  componentState: TComponentState;
  setComponentState: (s: TComponentState) => void;
  eventContext: TCreateEventClientContext;
  events: Array<CreateEvent>;
  month: string | number;
  year: string | number;
};

const Placeholder = () => {
  const { componentState, events } = useCreateEventSelectContext();
  if (componentState === "initialized" || !!events.length) {
    return <span>Add an item</span>;
  } else if (componentState === "loading") {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else {
    return <div className="w-full text-neutral-600 text-center">&#8213;</div>;
  }
};

const CreateEventSelectComponent = () => {
  const { setComponentState, componentState, events } =
    useCreateEventSelectContext();

  const onFocus = () => {
    if (componentState === "initialized") {
      setComponentState("loading");
    }
  };

  return (
    <Select
      className="w-2/3"
      placeholder={<Placeholder />}
      onFocus={onFocus}
      options={events.map((event) => ({ value: event.key, label: event.name }))}
    />
  );
};

const EventSelectContext = createContext<null | EventSelectProviderType>(null);

const CreateEventSelectProvider = (props: CreateEventSelectProps) => {
  const [componentState, setComponentState] =
    useState<TComponentState>("initialized");
  const [events, setEvents] = useState<Array<CreateEvent>>([]);
  const { children, scopes, eventContext, month, year } = props;
  const excludedKeys = props.excludedKeys || [];

  // Stable primitive keys so array props don't churn the effect deps.
  const scopesKey = scopes.join(",");
  const excludedKeysKey = excludedKeys.join(",");

  // Invalidate any fetched data back to "loading" when the query inputs
  // change — but skip the first mount so we stay lazy until focus.
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setComponentState("loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, eventContext, scopesKey, excludedKeysKey]);

  // Fetch whenever we enter the loading state.
  useEffect(() => {
    if (componentState !== "loading") return;

    let cancelled = false;
    fetchCreateEvents({ excludedKeys, scopes, eventContext, month, year }).then(
      (fetched) => {
        if (cancelled) return;
        setEvents(fetched ?? []);
        setComponentState("fetched");
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentState]);

  useEffect(() => {
    setComponentState("initialized");
  }, [scopesKey]);

  const value: EventSelectProviderType = {
    excludedKeys,
    scopes,
    eventContext,
    month,
    year,
    events,
    setComponentState,
    componentState,
  };

  return (
    <EventSelectContext.Provider value={value}>
      {children}
    </EventSelectContext.Provider>
  );
};

const useCreateEventSelectContext = () => {
  const context = useContext(EventSelectContext);

  if (!context) {
    throw new Error("must be used in CreateEventSelectProvider");
  }

  return context;
};

export {
  CreateEventSelectComponent,
  CreateEventSelectProvider,
  useCreateEventSelectContext,
};
