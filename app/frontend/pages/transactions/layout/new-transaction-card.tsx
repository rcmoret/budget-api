import { useNewTransactionForm } from "../store";

const cardClassNames = [
  "shadow-md",
  "last:mb-12",
  "self-start",
  "odd:bg-base-300",
  "even:bg-base-300/50",
  "form-card",
  "self-start",
];

const NewTransactionCard = () => {
  const { toggle } = useNewTransactionForm();

  return (
    <div className={cardClassNames.join(" ")}>
      <button type="button" onClick={toggle}>
        + Add Transaction
      </button>
    </div>
  );
};

export { NewTransactionCard };
