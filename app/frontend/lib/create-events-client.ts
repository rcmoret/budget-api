import { TCategoryScope } from "@/types/budget/planning";
import { BudgetItemCreateEventType } from "@/types/budget/events";

type TCreateEventClientContext = "setup";

type CreateEventClientProps = {
  excludedKeys?: Array<string>;
  scopes: Array<TCategoryScope>;
  eventContext: TCreateEventClientContext;
  month: string | number;
  year: string | number;
};

type CreateEvent = {
  name: string;
  slug: string;
  key: string;
  amount: number;
  budgetCategoryKey: string;
  budgetItemKey: string;
  eventType: BudgetItemCreateEventType;
};

const fetchCreateEvents = async (props: CreateEventClientProps) => {
  const { eventContext, excludedKeys = [], month, scopes, year } = props;

  const baseurl = [
    "/data",
    "budget",
    "categories",
    month,
    year,
    "create_events",
  ].join("/");
  const queryParamString = [
    ...Object.entries({ event_context: eventContext }).map((tuple) =>
      tuple.join("="),
    ),
    ...excludedKeys.map((key) => `excluded_keys[]=${key}`),
    ...scopes.map((scope) => `scopes[]=${scope}`),
  ].join("&");

  const url = `${baseurl}?${queryParamString}`;

  return fetch(url)
    .then((response) => response.json())
    .then((body) => body.events as Array<CreateEvent>)
    .catch((error) => {
      console.log("Error fetching create events", error);
      return [];
    });
};

export {
  fetchCreateEvents,
  type CreateEvent,
  type TCreateEventClientContext,
};
