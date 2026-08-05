import { CloseFormButton, CardLabel } from "@budget/design-system";

export const Default = () => <CloseFormButton onDismiss={() => {}} />;

export const InCardLabel = () => (
  <div className="w-80">
    <CardLabel label="Groceries">
      <CloseFormButton onDismiss={() => {}} />
    </CardLabel>
  </div>
);
