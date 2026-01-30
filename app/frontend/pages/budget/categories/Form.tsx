import Select from "react-select";
import { ActionButton } from "@/lib/theme/buttons/action-button";
import { AmountInput, inputAmount } from "@/components/common/AmountInput";
import { useCategoryFormContext } from "@/pages/budget/categories/category-form-context";
import { useCategoriesIndexContext } from "./CategoriesContext";
import { FormRow, FormRowContainer } from "@/lib/theme/forms/manage";
import { FormSubmitButton } from "@/lib/theme/buttons/form-submit-button";
import { Icon } from "@/components/common/Icon";
import { SelectionGroup, SelectableOption } from "@/lib/theme/options";
import { ToggleSlider } from "@/lib/theme/input/slider";

const LocalSelectionGroup = (props: {
  "aria-label": string;
  children: React.ReactNode;
}) => {
  return (
    <SelectionGroup
      role="radio"
      aria-label={props["aria-label"]}
      optionTheme={{ stature: "slim", showMarker: true }}
    >
      <div className="w-full flex flex-row justify-between">
        {props.children}
      </div>
    </SelectionGroup>
  );
};

const LocalSelectableOption = (props: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="w-5/12">
      <SelectableOption isSelected={props.isSelected} onClick={props.onClick}>
        <div className="text-xs">{props.children}</div>
      </SelectableOption>
    </div>
  );
};

const AccrualFormComponent = () => {
  const { data, formHeadingId, changeHanlders } = useCategoryFormContext();
  const { key } = data;
  const labelId = `category-accrual-label-${key}`;

  return (
    <div className="w-6/12 flex flex-row justify-between items-center">
      <span id={labelId}>Accrual?</span>
      <ToggleSlider
        toggleValue={data.isAccrual}
        onClick={changeHanlders.toggleAccrual}
        id={`category-accrual-${key}`}
        ariaLabelledby={labelId}
      />
    </div>
  );
};

const PerDayCalculationsFormComponent = () => {
  const { data, formHeadingId, changeHanlders } = useCategoryFormContext();
  const { key } = data;
  const labelId = `category-per-diem-label-${key}`;

  return (
    <div className="w-6/12 flex flex-row justify-between items-center">
      <span id={labelId}>Per Diem Enabled?</span>
      <ToggleSlider
        toggleValue={data.isPerDiemEnabled}
        onClick={changeHanlders.togglePerDiem}
        id={`category-per-diem-${key}`}
        ariaLabelledby={labelId}
      />
    </div>
  );
};

const MonthlyFormComponent = () => {
  const { changeHanlders, data } = useCategoryFormContext();
  const setMonthly = () => changeHanlders.updateMonthlyOrDayToDay(true);
  const setDayToDay = () => changeHanlders.updateMonthlyOrDayToDay(false);

  const isMonthly = data.isMonthly ?? false;
  const isDayToDay = !(data.isMonthly ?? true);

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Frequency</legend>
      <LocalSelectionGroup aria-label="Frequency">
        <LocalSelectableOption isSelected={isMonthly} onClick={setMonthly}>
          Monthly
        </LocalSelectableOption>
        <LocalSelectableOption isSelected={isDayToDay} onClick={setDayToDay}>
          Day-to-Day
        </LocalSelectableOption>
      </LocalSelectionGroup>
    </fieldset>
  );
};

const ExpenseFormComponent = () => {
  const { changeHanlders, data } = useCategoryFormContext();
  const setExpense = () => changeHanlders.updateExpenseOrRevenue(true);
  const setRevenue = () => changeHanlders.updateExpenseOrRevenue(false);

  const isExpense = data.isExpense ?? false;
  const isRevenue = !(data.isExpense ?? true);

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Type</legend>
      <LocalSelectionGroup aria-label="Expense or Revenue">
        <LocalSelectableOption isSelected={isRevenue} onClick={setRevenue}>
          Revenue
        </LocalSelectableOption>
        <LocalSelectableOption isSelected={isExpense} onClick={setExpense}>
          Expense
        </LocalSelectableOption>
      </LocalSelectionGroup>
    </fieldset>
  );
};

const DefaultAmountComponent = () => {
  const { data, changeHanlders } = useCategoryFormContext();
  const { key, name } = data;

  return (
    <FormRowContainer
      id={`category-default-amount-${key}`}
      name="defaultAmount"
      label="Default Amount"
      labelAriaId={`Default Amount for ${name}`}
    >
      <AmountInput
        id={`category-default-amount-${key}`}
        name="defaultAmount"
        classes={["h-input-lg"]}
        amount={data.defaultAmount}
        onChange={changeHanlders.handleAmount}
      />
    </FormRowContainer>
  );
};

const CategoryForm = () => {
  const {
    category,
    changeHanlders,
    closeForm,
    data,
    isNew,
    processing,
    onChange,
    onSubmit,
  } = useCategoryFormContext();
  const { icons } = useCategoriesIndexContext();
  const { key } = category;
  const iconOptions = icons
    .map((icon) => {
      return { label: icon.name, value: icon.key };
    })
    .sort((i1, i2) => (i1.label < i2.label ? -1 : 1));
  const selectedIcon = iconOptions.find(
    (icon) => icon.value === data.iconKey,
  ) || { label: "", value: "" };
  const iconClassName = icons.find(
    (icon) => icon.key === selectedIcon.value,
  )?.className;
  const formHeadingId = `category-form-heading-${key}`;
  const showDefaultAmount =
    (data.isExpense && data.isMonthly) || data.isAccrual;

  return (
    <div className="w-96 flex flex-row flex-wrap justify-between border-b border-gray-400 pb-2">
      <form
        onSubmit={onSubmit}
        aria-labelledby={formHeadingId}
        className="w-full"
      >
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <div>
              <ActionButton
                aria-label="Close form"
                icon="times-circle"
                onClick={closeForm}
                title="Close form"
              />
            </div>
            <FormRow
              label="Name"
              id={`category-name-${key}`}
              aria-required={true}
              inputValue={data.name}
              labelAriaId={formHeadingId}
              name="name"
              onChange={onChange}
              required={true}
            />
            <FormRow
              label="Slug"
              name="slug"
              inputValue={data.slug}
              labelAriaId={formHeadingId}
              required={true}
              onChange={onChange}
              id={`category-slug-${key}`}
            />
            {showDefaultAmount && <DefaultAmountComponent />}
            <FormRowContainer
              label="Icon"
              id={`category-icon-${key}`}
              labelAriaId={formHeadingId}
              name="icon"
            >
              <div className="w-8/12 flex flex-row-reverse gap-2 items-center">
                <Select
                  inputId={`category-icon-${key}`}
                  options={iconOptions}
                  value={selectedIcon}
                  onChange={changeHanlders.updateIconKey}
                  className="w-full"
                  aria-label="Select an icon"
                />
                <div className="text-right" aria-hidden="true">
                  {!!iconClassName && <Icon name={iconClassName} />}
                </div>
              </div>
            </FormRowContainer>
          </div>
          {isNew && <ExpenseFormComponent />}
          {isNew && <MonthlyFormComponent />}
          {data.isExpense && <AccrualFormComponent />}
          {(data.isMonthly ?? false) && <PerDayCalculationsFormComponent />}
          <div className="w-full flex flex-row justify-end">
            <FormSubmitButton
              onSubmit={onSubmit}
              isEnabled={!processing}
              isBusy={processing}
              iconName="check-circle"
              title={isNew ? "Create category" : "Update category"}
            >
              {isNew ? "CREATE" : "UPDATE"}
            </FormSubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export { CategoryForm };
