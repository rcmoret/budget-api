import { KeyIdentifier, CardRow } from "@budget/design-system";

export const Default = () => <KeyIdentifier identifier="a3f91c22b7de" />;

export const InCardRow = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <CardRow>
      <span className="mr-auto text-sm">Groceries</span>
      <KeyIdentifier identifier="a3f91c22b7de" />
    </CardRow>
  </div>
);
