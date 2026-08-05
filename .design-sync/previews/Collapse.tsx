import { Collapse, CardRow, AmountSpan } from "@budget/design-system";

const Body = () => (
  <div className="px-3 py-2 rounded bg-base-200">
    <CardRow><span className="mr-auto">Budgeted</span><AmountSpan amount={65000} colorize="none" /></CardRow>
    <CardRow><span className="mr-auto">Spent</span><AmountSpan amount={-41275} colorize="normal" /></CardRow>
  </div>
);

export const Open = () => (
  <div className="w-80"><Collapse open><Body /></Collapse></div>
);

export const Closed = () => (
  <div className="w-80">
    <div className="text-sm opacity-70 mb-1">closed — collapses to zero height</div>
    <Collapse open={false}><Body /></Collapse>
  </div>
);

export const Fade = () => (
  <div className="w-80"><Collapse open fade durationMs={300}><Body /></Collapse></div>
);
