import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { useTransactionContext } from "../context-provider";
import { AmountSpan } from "@/components/amount-span";
import { useTransactionFormContent } from "./context-provider";
import { LineItems } from "./line-items";
import { useAdjustmentsTotals } from "@/lib/adjustment-amount-store";
import { useTransactionContext } from "../context-provider";
import { SupplementalFormDetails } from "./supplemental-details";

const SubmitButtonRow = () => {
  const { processing } = useTransactionFormContent();
  const { toggleForm } = useTransactionContext();

  return (
    <div className="grid grid-cols-[3fr_1fr] gap-4 col-span-full md:flex md:justify-end md:gap-2">
      <button
        type="submit"
        className="btn btn-success"
        aria-label="Save transaction"
        disabled={processing}
      >
        <span className="hidden md:inline">Save Transaction</span>
        <span className="md:hidden">Save</span>
      </button>
      <button
        type="button"
        className="btn btn-error"
        aria-label="Close transaction form"
        onClick={toggleForm}
      >
        <div className="shadow-lg">&#x2718;</div>
      </button>
    </div>
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
      <div className="col-span-full flex justify-end gap-2 text-right self-end">
        <TransactionTotal />
      </div>
      <LineItems />
      <div className="col-span-full grid form-field-row">
        <label htmlFor="transaction-description">Description</label>
        <input
          id="transaction-description"
          type="text"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          className="input input-xs input-secondary"
        />
      </div>
      <div className="col-span-full grid form-field-row">
        <label htmlFor="clearance-date">Clearance Date</label>
        <DatePicker
          id="clearance-date"
          name="clearance-date"
          selected={clearanceDate}
          onChange={setClearanceDate}
          className="input input-xs input-secondary w-full"
        />
      </div>
      <SupplementalFormDetails />
      <SubmitButtonRow />
    </form>
  );
};

const TransactionTotal = () => {
  const { newTotal } = useAdjustmentsTotals();
  const { transaction, isNew } = useTransactionContext();

  // A new transaction has no prior amount to diff against — the strikethrough
  // comparison only makes sense once editing an existing one.
  if (isNew || transaction.amount.cents === newTotal) {
    return (
      <div>
        <AmountSpan amount={newTotal} classes={["text-2xl"]} />
      </div>
    );
  } else {
    return (
      <>
        <div className="line-through opacity-60">
          <AmountSpan amount={transaction.amount.cents} />
        </div>
        <div>
          <AmountSpan amount={newTotal} classes={["text-2xl"]} />
        </div>
      </>
    );
  }
};

export { FormComponent };
