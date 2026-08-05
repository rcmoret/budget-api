import { GenericAmountInput } from "@budget/design-system";

export const Default = () => (
  <div className="w-40"><GenericAmountInput id="budgeted" name="budgeted" defaultValue="650.00" /></div>
);

export const Placeholder = () => (
  <div className="w-40"><GenericAmountInput id="empty" name="empty" /></div>
);

export const InFormRow = () => (
  <div className="flex items-center gap-2 w-72 px-3 py-2 rounded bg-base-200">
    <span className="mr-auto text-sm">Budgeted</span>
    <div className="w-32"><GenericAmountInput id="row-budgeted" name="budgeted" defaultValue="650.00" /></div>
  </div>
);
