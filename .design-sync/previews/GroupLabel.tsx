import { GroupLabel, AmountSpan } from "@budget/design-system";

export const Default = () => (
  <div className="w-80"><GroupLabel>Fixed expenses</GroupLabel></div>
);

export const WithTrailingAmount = () => (
  <div className="w-80">
    <GroupLabel>
      <span className="mr-auto">Variable spending</span>
      <AmountSpan amount={-91450} colorize="none" />
    </GroupLabel>
  </div>
);

export const Stacked = () => (
  <div className="flex flex-col gap-2 w-80">
    <GroupLabel>Income</GroupLabel>
    <GroupLabel>Fixed expenses</GroupLabel>
    <GroupLabel>Variable spending</GroupLabel>
  </div>
);
