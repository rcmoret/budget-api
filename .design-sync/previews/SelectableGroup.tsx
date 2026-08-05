import { SelectableGroup, RadioInput, SelectableInput } from "@budget/design-system";

export const RadioGroup = () => (
  <div className="w-72">
    <SelectableGroup name="scope" groupLabel="Apply to">
      <RadioInput value="month" checked onChange={() => {}}>This month only</RadioInput>
      <RadioInput value="future" checked={false} onChange={() => {}}>This and future months</RadioInput>
      <RadioInput value="all" checked={false} onChange={() => {}}>Every month</RadioInput>
    </SelectableGroup>
  </div>
);

export const CheckboxGroup = () => (
  <div className="w-72">
    <SelectableGroup name="options" groupLabel="Options">
      <SelectableInput value="clear" checked onChange={() => {}}>Clear on rollover</SelectableInput>
      <SelectableInput value="accrual" checked={false} onChange={() => {}}>Accrues</SelectableInput>
    </SelectableGroup>
  </div>
);

export const Disabled = () => (
  <div className="w-72">
    <SelectableGroup name="scope-disabled" groupLabel="Apply to" disabled>
      <RadioInput value="month" checked onChange={() => {}}>This month only</RadioInput>
      <RadioInput value="all" checked={false} onChange={() => {}}>Every month</RadioInput>
    </SelectableGroup>
  </div>
);
