import { CardRow, AmountSpan, EditButton } from "@budget/design-system";

export const Default = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <CardRow><span className="mr-auto">Budgeted</span><AmountSpan amount={65000} colorize="none" /></CardRow>
    <CardRow><span className="mr-auto">Spent</span><AmountSpan amount={-41275} colorize="normal" /></CardRow>
    <CardRow><span className="mr-auto">Remaining</span><AmountSpan amount={23725} colorize="normal" /></CardRow>
  </div>
);

export const MinHeightLg = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <CardRow minHeight="lg"><span className="mr-auto">Taller row</span><EditButton showForm={() => {}} /></CardRow>
  </div>
);
