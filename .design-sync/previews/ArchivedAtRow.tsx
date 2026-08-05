import { ArchivedAtRow, CardRow, AmountSpan } from "@budget/design-system";

export const WithDate = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <ArchivedAtRow archivedAt="2026-04-12" />
  </div>
);

// archivedAt={null} renders the label with a blank value rather than omitting it.
export const NullDate = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <ArchivedAtRow archivedAt={null} />
  </div>
);

export const InCardBody = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <CardRow><span className="mr-auto">Final balance</span><AmountSpan amount={128400} colorize="none" /></CardRow>
    <ArchivedAtRow archivedAt="2026-04-12" />
  </div>
);
