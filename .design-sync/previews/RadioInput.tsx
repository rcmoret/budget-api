import { SelectableGroup, RadioInput } from "@budget/design-system";

export const Checked = () => (
  <div className="w-72">
    <SelectableGroup name="scope-a" groupLabel="Apply to">
      <RadioInput value="month" checked onChange={() => {}}>This month only</RadioInput>
    </SelectableGroup>
  </div>
);

export const Unchecked = () => (
  <div className="w-72">
    <SelectableGroup name="scope-b" groupLabel="Apply to">
      <RadioInput value="all" checked={false} onChange={() => {}}>Every month</RadioInput>
    </SelectableGroup>
  </div>
);
