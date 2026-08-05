import {
  ActiveItemCard,
  AmountSpan,
  CardLabel,
  CardRow,
  EditButton,
  KeyIdentifier,
} from "@budget/design-system";

export const Default = () => (
  <div className="w-96">
    <ActiveItemCard
      id="account-groceries"
      label={
        <CardLabel label="Groceries">
          <EditButton showForm={() => {}} />
        </CardLabel>
      }
    >
      <CardRow>
        <span>Budgeted</span>
        <AmountSpan amount={65000} colorize="none" />
      </CardRow>
      <CardRow>
        <span>Spent</span>
        <AmountSpan amount={-41275} colorize="normal" />
      </CardRow>
      <CardRow minHeight="lg">
        <KeyIdentifier identifier="a3f91c22b7de" />
      </CardRow>
    </ActiveItemCard>
  </div>
);

export const FormShown = () => (
  <div className="w-96">
    <ActiveItemCard
      id="account-utilities"
      isFormShown
      label={<CardLabel label="Utilities" />}
    >
      <CardRow>
        <span>Budgeted</span>
        <AmountSpan amount={18000} colorize="none" />
      </CardRow>
      <CardRow>
        <span>Remaining</span>
        <AmountSpan amount={4325} colorize="normal" />
      </CardRow>
    </ActiveItemCard>
  </div>
);
