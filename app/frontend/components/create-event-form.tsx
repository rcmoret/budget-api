import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TCategoryScope } from "@/types/budget/planning";
import {
  CreateEvent,
  fetchCreateEvents,
  TCreateEventClientContext,
} from "@/lib/create-events-client";
import Select from "react-select";
import { useForm } from "@inertiajs/react";
import type { InertiaFormProps } from "@inertiajs/react";
import { getBudgetMonth } from "@/pages/budget/month-store";
import { amountStringValidator, decimalToInt } from "@/lib/money-formatter";
import {
  getRedirectQueryParams,
  useAppRoutes,
} from "@/lib/app-stores/app-config-store";

type TComponentState = "initialized" | "loading" | "fetched";

type CreateEventSelectProps = {
  excludedKeys?: Array<string>;
  scopes: Array<TCategoryScope>;
  eventContext: TCreateEventClientContext;
  children: React.ReactNode;
  selectedKey?: null | string;
  month: string | number;
  year: string | number;
};

// The options `post` accepts, derived from the react adapter's public form
// type so it tracks the installed version instead of importing @inertiajs/core.
type SubmitOptions = NonNullable<
  Parameters<InertiaFormProps<CreateEventFormBody>["post"]>[1]
>;

type EventSelectProviderType = {
  amount: string;
  componentState: TComponentState;
  errors: Record<string, string | undefined>;
  eventContext: TCreateEventClientContext;
  events: Array<CreateEvent>;
  excludedKeys: Array<string>;
  isSubmittable: boolean;
  handleSubmit: (options?: SubmitOptions) => void;
  month: string | number;
  processing: boolean;
  resetForm: () => void;
  scopes: Array<TCategoryScope>;
  selectedEvent: CreateEvent | null;
  selectedKey: null | string;
  setAmount: (amount: string | null) => void;
  setComponentState: (s: TComponentState) => void;
  setSelectedKey: (s: string | null) => void;
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

const CreateEventSelectComponent = (props: { "aria-label": string }) => {
  const {
    setComponentState,
    componentState,
    events,
    selectedKey,
    setSelectedKey,
  } = useCreateEventSelectContext();

  const onFocus = () => {
    if (componentState === "initialized") {
      setComponentState("loading");
    }
  };

  const onChange = (ev: { label: string; value: string } | null) => {
    if (!!ev) {
      setSelectedKey(ev.value);
    } else {
      setSelectedKey(null);
    }
  };

  const options = events.map((event) => ({
    value: event.key,
    label: event.name,
  }));

  const selectedValue =
    options.find(({ value }) => value === selectedKey) ?? null;

  return (
    <Select
      aria-label={props["aria-label"]}
      placeholder={<Placeholder />}
      onChange={onChange}
      onFocus={onFocus}
      options={options}
      value={selectedValue}
    />
  );
};

const EventSelectContext = createContext<null | EventSelectProviderType>(null);

type CreateEventFormBody = {
  amount: string | null;
  selectedKey: null | string;
};

const initialFormBody: CreateEventFormBody = {
  amount: null,
  selectedKey: null,
};

const CreateEventSelectProvider = (props: CreateEventSelectProps) => {
  const createBudgetEventsRoute = useAppRoutes("createBudgetEventsRoute");
  const { month, year } = getBudgetMonth();
  const [componentState, setComponentState] =
    useState<TComponentState>("initialized");
  const { data, errors, post, processing, setData, transform } =
    useForm<CreateEventFormBody>({
      ...initialFormBody,
    });
  const [events, setEvents] = useState<Array<CreateEvent>>([]);
  const { children, scopes, eventContext } = props;
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

  const isSubmittable =
    amountStringValidator(data.amount) && !!data.selectedKey;

  const selectedEvent =
    events.find(({ key }) => data.selectedKey === key) ?? null;

  const transformedEvent = {
    ...selectedEvent,
    amount: decimalToInt(data.amount ?? ""),
  };

  transform(() => {
    return {
      events: [transformedEvent],
    };
  });

  const setAmount = (amount: string | null) => setData("amount", amount);
  const setSelectedKey = (key: string | null) => setData("selectedKey", key);

  const resetForm = () => {
    setAmount(null);
    setSelectedKey(null);
  };

  const redirectParams = getRedirectQueryParams();

  const handleSubmit = (options?: SubmitOptions) => {
    if (isSubmittable && !processing) {
      post(`${createBudgetEventsRoute}?${redirectParams}`, options);
    }
  };

  const value: EventSelectProviderType = {
    amount: data.amount ?? "",
    componentState,
    errors: errors as Record<string, string | undefined>,
    eventContext,
    events,
    excludedKeys,
    handleSubmit,
    isSubmittable,
    month,
    processing,
    resetForm,
    scopes,
    selectedEvent,
    selectedKey: data.selectedKey,
    setAmount,
    setComponentState,
    setSelectedKey,
    year,
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
