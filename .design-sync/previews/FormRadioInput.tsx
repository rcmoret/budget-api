import { FormRadioInput } from "@budget/design-system";

// The row label is bg-white and only outlines itself when checked, so these sit
// on a bg-base-200 surface — on a white background an unchecked row is invisible.
export const AccountType = () => (
  <div className="flex flex-col gap-2 w-72 p-3 rounded bg-base-200">
    <FormRadioInput name="account_type" value="cash_flow" defaultChecked>
      Cash flow
    </FormRadioInput>
    <FormRadioInput name="account_type" value="non_cash_flow" defaultChecked={false}>
      Non cash flow
    </FormRadioInput>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-col gap-2 w-72 p-3 rounded bg-base-200">
    <FormRadioInput name="locked" value="a" defaultChecked disabled>
      Locked selection
    </FormRadioInput>
    <FormRadioInput name="locked" value="b" defaultChecked={false} disabled>
      Also locked
    </FormRadioInput>
  </div>
);
