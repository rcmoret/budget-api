import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { useTransactionContext } from "../context-provider";
import { AmountSpan } from "@/components/amount-span";
import { CheckMarkButton } from "@/components/cta";
import { useTransactionFormContent } from "./context-provider";
import { LineItems } from "./line-items";
import { useAdjustmentsTotals } from "@/lib/adjustment-amount-store";
import { useTransactionContext } from "../context-provider";
import { SupplementalFormDetails } from "./supplemental-details";

const SubmitButton = () => {
  const { processing } = useTransactionFormContent();

  return (
    <CheckMarkButton
      type="submit"
      ariaLabel="Save transaction"
      disabled={processing}
    />
  );
};

const FormComponent = () => {
  const {
    clearanceDate,
    description,
    processing,
    setClearanceDate,
    setDescription,
    submit,
  } = useTransactionFormContent();

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (processing) return;

    submit();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-subgrid col-span-full text-left gap-y-4"
    >
      <div className="grid description">
        <div className="grid gap-1 content-start">
          <label htmlFor="clearance-date">Clearance Date</label>
          <DatePicker
            id="clearance-date"
            name="clearance-date"
            selected={clearanceDate}
            onChange={setClearanceDate}
            className="input input-xs input-secondary w-full"
          />
        </div>
        <div className="grid gap-1 content-start">
          <label htmlFor="transaction-description">Description</label>
          <input
            id="transaction-description"
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            className="input input-xs input-secondary"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 text-right self-end">
        <TransactionTotal />
      </div>
      <LineItems />
      <SupplementalFormDetails />
      <div className="flex justify-end col-span-full">
        <SubmitButton />
      </div>
    </form>
  );
};

const TransactionTotal = () => {
  const { newTotal } = useAdjustmentsTotals();
  const { transaction } = useTransactionContext();

  if (transaction.amount.cents === newTotal) {
    return (
      <div>
        <AmountSpan amount={newTotal} />
      </div>
    );
  } else {
    return (
      <>
        <div className="line-through">
          <AmountSpan amount={transaction.amount.cents} />
        </div>
        <div>
          <AmountSpan amount={newTotal} />
        </div>
      </>
    );
  }
};

export { FormComponent };
