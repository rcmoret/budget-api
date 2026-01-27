import { useSetupCategoryGroupContext } from "@/pages/budget/set_up/categories/group_context";
import { useEffect, useState } from "react";
import { useSetupEventsFormContext } from "@/pages/budget/set_up";
import Select, { SingleValue } from "react-select";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import axios from "axios";
import { byLabel } from "@/lib/sort_functions";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { FontWeightOption } from "@/types/component_classes";

type EventResponse = {
  name: string;
  slug: string;
  events: unknown[];
};

type EventsApiResponse = {
  events: EventResponse[];
};

type CategorySelectOption = {
  label: string;
  value: string;
};

const buttonClassName = (isCurrentlyViewing: boolean = false) => {
  const activeClasses = ["font-semibold", "p-2", "text-lg", "w-80"];
  const inactiveClasses = [
    "px-2",
    "py-1",
    "text-base",
    "w-72",
    "hover:outline-gray-200",
  ];

  return [
    "shadow-md",
    "font-medium",
    "rounded-lg",
    "text-center",
    "bg-gray-50",
    "outline",
    "outline-gray-200",
    "w-72",
    "text-black",
    ...(isCurrentlyViewing ? activeClasses : inactiveClasses),
  ].join(" ");
};

const getEvents = async (
  eventsUrl: string,
): Promise<CategorySelectOption[]> => {
  return axios
    .get<EventsApiResponse>(eventsUrl)
    .then((response) => {
      return response.data.events.map(({ slug, name }: EventResponse) => ({
        value: slug,
        label: name,
      }));
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      return [];
    });
};

const AddCategorySubmitButton = (props: { slug: string; name: string }) => {
  const { metadata } = useSetupEventsFormContext();
  const { toggleShowAddForm } = useSetupCategoryGroupContext();
  const { post, processing } = useForm();

  const addCategoryAction = () => {
    const url = `/budget/${metadata.month}/${metadata.year}/set-up/${props.slug}/new-event`;
    post(url, { onSuccess: toggleShowAddForm });
  };

  const fontWeight: FontWeightOption = "font-semibold";

  const styling = {
    bg: "bg-green-200 hover:bg-green-300",
    padding: "py-2 px-4",
    fontWeight,
    shadow: "shadow-sm",
  };

  return (
    <div className="text-left">
      <Button
        styling={{ ...styling, rounded: "rounded" }}
        onClick={addCategoryAction}
        isDisabled={processing}
        type="button"
      >
        Add {props.name}
      </Button>
    </div>
  );
};

const NoOptions = () => {
  const { showAddForm } = useSetupCategoryGroupContext();

  return (
    <div className={buttonClassName(showAddForm)}>
      <div className="flex flex-row justify-end w-full">
        <div className="text-right">No available categories</div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  const { showAddForm } = useSetupCategoryGroupContext();

  return (
    <div className={buttonClassName(showAddForm)}>
      <div className="flex flex-row justify-center w-full min-h-[18px]">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    </div>
  );
};

const AddNewButton = () => {
  const { toggleShowAddForm } = useSetupCategoryGroupContext();

  return (
    <button
      type="button"
      className={buttonClassName(false)}
      onClick={toggleShowAddForm}
    >
      <div className="flex flex-row justify-end w-full">
        <div className="text-right">Add Category</div>
      </div>
    </button>
  );
};

const SelectComponent = () => {
  const { showAddForm, toggleShowAddForm } = useSetupCategoryGroupContext();
  const { name } = useSetupCategoryGroupContext();
  const placeholder: SingleValue<CategorySelectOption> = {
    value: "",
    label: `+ ${name}`,
  };

  const [categoryOptions, setCategoryOptions] = useState<
    CategorySelectOption[]
  >([]);
  const [selectedOption, setSelectedOption] =
    useState<SingleValue<CategorySelectOption>>(placeholder);
  const [isLoading, setIsLoading] = useState(false);

  const { groups, metadata } = useSetupEventsFormContext();
  const { scopes, categories } = useSetupCategoryGroupContext();
  const { month, year } = metadata;

  const queryParams = { event_context: "setup" };

  const excludedKeys = Object.values(groups).flatMap((group) =>
    group.categories.map(({ key }) => key),
  );
  const queryParamString = [
    ...Object.entries(queryParams).map((tuple) => tuple.join("=")),
    ...excludedKeys.map((key) => `excluded_keys[]=${key}`),
    ...scopes.map((scope) => `scopes[]=${scope}`),
  ].join("&");

  const eventsUrl = UrlBuilder({
    name: "CategoryCreateEvents",
    month,
    year,
    queryParams: queryParamString,
  });

  useEffect(() => {
    if (showAddForm) {
      const startTime = Date.now();
      const minDuration = 360;

      setIsLoading(true);
      getEvents(eventsUrl).then((events) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
          setCategoryOptions(events.sort(byLabel));
          setIsLoading(false);
        }, remaining);
      });
    }
  }, [...scopes, categories.length, showAddForm]);

  const className = [
    "shadow-md",
    "font-medium",
    "rounded-lg",
    "text-black",
    "mt-2",
    "w-72",
    "text-base",
  ].join(" ");

  const onChange = (newValue: SingleValue<CategorySelectOption>) => {
    setSelectedOption(newValue);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!categoryOptions.length) {
    return <NoOptions />;
  }

  return (
    <div className="w-80 flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className={className}>
          <Select
            value={selectedOption}
            options={categoryOptions}
            onChange={onChange}
          />
        </div>
        <Button
          type="button"
          onClick={toggleShowAddForm}
          styling={{ color: "text-blue-300" }}
        >
          <Icon name="times-circle" />
        </Button>
      </div>
      {!!selectedOption?.value && (
        <AddCategorySubmitButton
          slug={selectedOption.value}
          name={selectedOption.label}
        />
      )}
    </div>
  );
};

const AddCategorySelect = () => {
  const { showAddForm } = useSetupCategoryGroupContext();

  if (showAddForm) {
    return <SelectComponent />;
  } else {
    return <AddNewButton />;
  }
};

export { AddCategorySelect };
