import { SelectableGroup, SelectableInput } from "@budget/design-system";

export const Checked = () => (
  <div className="w-72">
    <SelectableGroup name="opts-a" groupLabel="Options">
      <SelectableInput value="clear" checked onChange={() => {}}>Clear on rollover</SelectableInput>
    </SelectableGroup>
  </div>
);

export const Unchecked = () => (
  <div className="w-72">
    <SelectableGroup name="opts-b" groupLabel="Options">
      <SelectableInput value="accrual" checked={false} onChange={() => {}}>Accrues</SelectableInput>
    </SelectableGroup>
  </div>
);
