import { ArchivedItemCard, ArchivedAtRow, CardRow, AmountSpan } from "@budget/design-system";

export const Default = () => (
  <div className="w-96">
    <ArchivedItemCard
      name="Old Savings"
      itemKey="c81d4fa27b03"
      title="Unarchive account"
      onClick={() => {}}
    >
      <CardRow><span className="mr-auto">Final balance</span><AmountSpan amount={128400} colorize="none" /></CardRow>
      <ArchivedAtRow archivedAt="2026-04-12" />
    </ArchivedItemCard>
  </div>
);
