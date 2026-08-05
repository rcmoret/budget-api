import { EditButton, CardLabel } from "@budget/design-system";

export const Default = () => <EditButton showForm={() => {}} />;

export const InCardLabel = () => (
  <div className="w-80">
    <CardLabel label="Groceries">
      <EditButton showForm={() => {}} />
    </CardLabel>
  </div>
);
