import { FilterComponent as BaseFilterComponent } from "@/pages/budget/filter";
import { ToggleSlider } from "@/lib/theme/input/slider";
import { useAppConfigContext } from "@/components/layout/Provider";
import { DateFormatter } from "@/lib/DateFormatter";
import { ButtonStyleLink } from "@/lib/theme/buttons/action-button";
import { useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";

const FilterComponent = () => {
  const { itemFilter } = useBudgetDashboardContext();

  return (
    <BaseFilterComponent
      id="budget-dashboard-filter"
      filterTerm={itemFilter.term}
      setFilterTerm={itemFilter.setTerm}
    />
  );
};

const SetupLink = () => {
  const { appConfig } = useAppConfigContext();
  const { isSetUp, month, year } = appConfig.budget.data;
  if (!!isSetUp) {
    return;
  }
  const dateString = DateFormatter({ month, year, format: "monthYear" });

  return (
    <ButtonStyleLink
      id="setup-budget"
      href={`/budget/${month}/${year}/set-up`}
      title={`setup ${dateString}`}
    >
      Setup {dateString}
    </ButtonStyleLink>
  );
};

const FinalizeLink = () => {
  const { appConfig } = useAppConfigContext();
  const { isSetUp, isClosedOut, month, year, daysRemaining } =
    appConfig.budget.data;
  if (!isSetUp || !!isClosedOut || daysRemaining > 2) {
    return;
  }
  const dateString = DateFormatter({ month, year, format: "monthYear" });

  return (
    <ButtonStyleLink
      id="finalize-budget"
      href={`/budget/${month}/${year}/finalize`}
      title={`finalize ${dateString}`}
    >
      Finalize {dateString}
    </ButtonStyleLink>
  );
};

const LocalSlider = (props: {
  label: string;
  toggleValue: boolean;
  toggleFn: () => void;
  "aria-label": string;
}) => {
  const labelClasses = props.toggleValue
    ? ["font-semibold", "text-black"]
    : ["text-gray-800", "text-sm"];

  return (
    <div className="text-sm w-full flex flex-row justify-between items-center h-6">
      <div className={labelClasses.join(" ")}>{props.label}</div>
      <div>
        <ToggleSlider
          toggleValue={props.toggleValue}
          onClick={props.toggleFn}
          ariaLabel={props["aria-label"]}
        />
      </div>
    </div>
  );
};

const AccrualToggle = () => {
  const { appConfig, setAppConfig } = useAppConfigContext();
  const { showAccruals } = appConfig.budget;
  const toggleAccruals = () =>
    setAppConfig({
      ...appConfig,
      budget: { ...appConfig.budget, showAccruals: !showAccruals },
    });

  const label = `${showAccruals ? "Showing" : "Show"} Accruals`;

  return (
    <LocalSlider
      label={label}
      toggleValue={showAccruals}
      toggleFn={toggleAccruals}
      aria-label={label}
    />
  );
};

const ClearedMonthlyToggle = () => {
  const { appConfig, setAppConfig } = useAppConfigContext();
  const { showClearedMonthly } = appConfig.budget;
  const toggleClearedMonthly = () =>
    setAppConfig({
      ...appConfig,
      budget: { ...appConfig.budget, showClearedMonthly: !showClearedMonthly },
    });

  const label = `${showClearedMonthly ? "Showing" : "Show"} Cleared Monthly`;

  return (
    <LocalSlider
      label={label}
      toggleValue={showClearedMonthly}
      toggleFn={toggleClearedMonthly}
      aria-label={label}
    />
  );
};

const DeletedItemsToggle = () => {
  const { appConfig, setAppConfig } = useAppConfigContext();
  const { showDeletedItems } = appConfig.budget;
  const toggleDeletedItems = () =>
    setAppConfig({
      ...appConfig,
      budget: { ...appConfig.budget, showDeletedItems: !showDeletedItems },
    });

  const label = `${showDeletedItems ? "Showing" : "Show"} Deleted Items`;

  return (
    <LocalSlider
      label={label}
      toggleValue={showDeletedItems}
      toggleFn={toggleDeletedItems}
      aria-label={label}
    />
  );
};

const BudgetMenu = () => {
  return (
    <div className="w-full flex flex-row justify-between items-end">
      <FilterComponent />
      <div className="w-full px-2 flex flex-row-reverse">
        <div className="w-60 flex flex-col gap-1 items-end">
          <AccrualToggle />
          <ClearedMonthlyToggle />
          <DeletedItemsToggle />
          <SetupLink />
          <FinalizeLink />
        </div>
      </div>
    </div>
  );
};

export { BudgetMenu, AccrualToggle };
