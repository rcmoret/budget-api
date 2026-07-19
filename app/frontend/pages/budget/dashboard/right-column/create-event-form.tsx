import { getBudgetMonth } from "@/pages/budget/month-store";
import { useBudgetDashboardStore } from "../store";
import { TCategoryScope } from "@/types/budget/planning";
import {
  CreateEventSelectComponent,
  CreateEventSelectProvider,
  useCreateEventSelectContext,
} from "@/components/create-event-form";
import { CloseButton } from "@/components/close-button";

const sixtyFourtyClasses = ["grid grid-cols-[2fr_3fr] items-center"].join(" ");

const CloseFormButton = () => {
  const { resetForm, selectedKey } = useCreateEventSelectContext();

  return (
    <CloseButton
      onClick={resetForm}
      tabIndex={-1}
      ariaLabel="Close Create Item Form"
      title="Close Create Item Form"
      disabled={!selectedKey}
    />
  );
};

const CreateEventForm = () => {
  const { month, year } = getBudgetMonth();
  const { expenseOrRevenueFilter, fixedOrVariableFilter } =
    useBudgetDashboardStore();

  const allscopes = [
    expenseOrRevenueFilter === "revenue" ? "revenues" : null,
    expenseOrRevenueFilter === "expense" ? "expenses" : null,
    fixedOrVariableFilter === "fixed" ? "monthly" : null,
    fixedOrVariableFilter === "variable" ? "weekly" : null,
  ];
  const scopes: Array<TCategoryScope> = allscopes.filter(
    (s) => !!s,
  ) as Array<TCategoryScope>;

  return (
    <CreateEventSelectProvider
      scopes={scopes}
      eventContext="current"
      month={month}
      year={year}
    >
      <FormComponent />
    </CreateEventSelectProvider>
  );
};

const FormComponent = () => {
  const { isSubmittable, handleSubmit, processing, resetForm, selectedKey } =
    useCreateEventSelectContext();

  const formClassName = [
    "grid",
    "duration-400",
    "ease-in-out",
    "transition-[gap]",
    selectedKey ? "gap-4" : "gap-0",
  ].join(" ");

  const rowClasses = [
    "items-center",
    "transition-[grid-template-rows,opacity]",
    "duration-400",
    "ease-in-out",
    selectedKey
      ? "grid-rows-[minmax(0,1fr)]"
      : "grid-rows-[minmax(0,0fr)] opacity-0",
  ];

  const childRowClassName = [
    "grid",
    "col-span-full",
    "gap-2",
    ...rowClasses,
  ].join(" ");

  const formLabelClasses = [
    "grid grid-cols-[1fr_auto] gap-8 items-center",
    ...rowClasses,
  ].join(" ");

  const disabled = !isSubmittable || processing;

  const buttonClassName = [
    "btn",
    "btn-sm",
    ...(disabled
      ? ["!cursor-not-allowed"]
      : ["btn-success", "text-success-content"]),
    "w-full",
  ].join(" ");

  const onSubmit = (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    handleSubmit({
      onSuccess: resetForm,
    });
  };

  return (
    <form onSubmit={onSubmit} className={formClassName}>
      <div className={formLabelClasses}>
        <div>Add an item</div>
        <CloseFormButton />
      </div>
      <div className="col-span-full">
        <CreateEventSelectComponent aria-label="Choose Category" />
      </div>
      <div className={childRowClassName}>
        <AmountInput />
      </div>
      <div className={childRowClassName}>
        <button type="submit" className={buttonClassName} disabled={disabled}>
          Add item
        </button>
      </div>
    </form>
  );
};

const AmountInput = () => {
  const { amount, setAmount, errors } = useCreateEventSelectContext();
  const amountError = errors.amount;

  return (
    <div className="grid gap-1">
      <div className={sixtyFourtyClasses}>
        <label htmlFor="dashboard-create-event-amount">Amount</label>
        <input
          type="text"
          id="dashboard-create-event-amount"
          name="dashboard-create-event-amount"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          aria-invalid={!!amountError}
          className="w-full input input-xs text-right"
        />
      </div>
      {amountError && (
        <div className="text-error text-xs text-right">{amountError}</div>
      )}
    </div>
  );
};

export { CreateEventForm, FormComponent };
