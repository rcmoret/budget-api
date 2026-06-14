import {
  SelectableGroup as RadioGroup,
  RadioInput,
} from "@/components/selectable";
import {
  BudgetCategoryFormProvider,
  useBudgetCategoryFormContext,
} from "./context-provider";
import { CardRow } from "@/layout/card";
import { useBudgetCategoryContext } from "@/pages/budget/categories/context-provider";
import {
  useBudgetCategoriesStore,
  useShowNewCategoryForm,
} from "@/pages/budget/categories/store";

const inputClassName = ["input", "input-sm"].join(" ");

const NameInput = () => {
  const { category } = useBudgetCategoryContext();
  const { data, setData } = useBudgetCategoryFormContext();
  const inputid = `name-${category.key}`;

  return (
    <CardRow>
      <label htmlFor={inputid}>Name</label>
      <div>
        <input
          className={inputClassName}
          id={inputid}
          type="text"
          name="category.name"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
      </div>
    </CardRow>
  );
};

const SlugInput = () => {
  const { category } = useBudgetCategoryContext();
  const { data, setData } = useBudgetCategoryFormContext();
  const inputid = `slug-${category.key}`;

  return (
    <CardRow>
      <label htmlFor={inputid}>Slug</label>
      <div>
        <input
          className={inputClassName}
          id={inputid}
          type="text"
          name="category.slug"
          value={data.slug}
          onChange={(e) => setData("slug", e.target.value)}
        />
      </div>
    </CardRow>
  );
};

const FixOrVariableInput = () => {
  const { data, setData } = useBudgetCategoryFormContext();

  return (
    <RadioGroup name="category.monthly" groupLabel="Fixed or Variable">
      <RadioInput
        checked={data.isMonthly === true}
        onChange={() => setData("isMonthly", true)}
        value="true"
      >
        Fixed
      </RadioInput>
      <RadioInput
        checked={data.isMonthly === false}
        onChange={() => setData("isMonthly", false)}
        value="false"
      >
        Variable
      </RadioInput>
    </RadioGroup>
  );
};

const DefaultAmountInput = () => {
  const { category } = useBudgetCategoryContext();
  const inputid = `slug-${category.key}`;
  const { data, setData } = useBudgetCategoryFormContext();

  return (
    <FormRow>
      <label htmlFor={inputid}>Default Amount</label>
      <div>
        <input
          className={`text-right ${inputClassName}`}
          id={inputid}
          type="text"
          name="category.defaultAmount"
          value={data.defaultAmount ?? ""}
          onChange={(e) => setData("defaultAmount", e.target.value)}
        />
      </div>
    </FormRow>
  );
};

const AccrualToggle = () => {
  const { data, setData } = useBudgetCategoryFormContext();

  return (
    <FormRow>
      <RadioGroup name="category.accrual" groupLabel="Accrual">
        <div className="flex flex-row">
          <div className="w-1/2 px-2">
            <RadioInput
              checked={data.isAccrual === true}
              onChange={() => setData("isAccrual", true)}
              value="true"
            >
              Yes
            </RadioInput>
          </div>
          <div className="w-1/2 px-2">
            <RadioInput
              checked={data.isAccrual === false}
              onChange={() => setData("isAccrual", false)}
              value="false"
            >
              No
            </RadioInput>
          </div>
        </div>
      </RadioGroup>
    </FormRow>
  );
};

const ExpenseOrRevenueRadioInput = () => {
  const { data, setData } = useBudgetCategoryFormContext();

  return (
    <RadioGroup name="category.expense" groupLabel="Expense or Revenue">
      <RadioInput
        checked={data.isExpense === false}
        onChange={() => setData("isExpense", false)}
        value="false"
      >
        Revenue
      </RadioInput>
      <RadioInput
        checked={data.isExpense === true}
        onChange={() => setData("isExpense", true)}
        value="true"
      >
        Expense
      </RadioInput>
    </RadioGroup>
  );
};

const FormRow = (props: {
  children: React.ReactNode;
  classes?: Array<string>;
}) => {
  const providedClasses = props.classes || [];

  const rowClassName = [
    "border-b",
    "border-base-300",
    "mb-2",
    "py-4",
    ...providedClasses,
  ].join(" ");

  return <div className={rowClassName}>{props.children}</div>;
};

const FormComponent = () => {
  const { data, isSubmittable } = useBudgetCategoryFormContext();
  const isNewForm = useShowNewCategoryForm();
  const label = `${isNewForm ? "Create" : "Update"} Budget Category`;
  const showDefaultAmountInput = data.isMonthly || data.isAccrual;

  return (
    <div>
      <NameInput />
      <SlugInput />
      <div className="grid">
        <fieldset disabled={!isNewForm}>
          <FormRow classes={["mt-4", "pt-2"]}>
            <ExpenseOrRevenueRadioInput />
          </FormRow>
          <FormRow>
            <FixOrVariableInput />
          </FormRow>
        </fieldset>
        {data.isExpense && <AccrualToggle />}
        {showDefaultAmountInput && <DefaultAmountInput />}
        <CardRow>
          <button
            type="submit"
            className="btn btn-success btn-wide"
            disabled={!isSubmittable}
          >
            {label}
          </button>
        </CardRow>
      </div>
    </div>
  );
};

const BudgetCategoryForm = () => {
  return (
    <BudgetCategoryFormProvider>
      <FormComponent />
    </BudgetCategoryFormProvider>
  );
};

export { BudgetCategoryForm };
