import { CardLabel, EditButton, KeyIdentifier } from "@budget/design-system";

export const Default = () => (
  <div className="w-80"><CardLabel label="Groceries" /></div>
);

export const WithAction = () => (
  <div className="w-80">
    <CardLabel label="Groceries"><EditButton showForm={() => {}} /></CardLabel>
  </div>
);

export const WithNodeLabel = () => (
  <div className="w-80">
    <CardLabel label={<span className="flex items-center gap-2">Groceries <KeyIdentifier identifier="a3f91c22b7de" /></span>} />
  </div>
);
