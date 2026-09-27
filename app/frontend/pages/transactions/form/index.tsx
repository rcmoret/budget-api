// import { useTransactionContext } from "../context-provider";
import { AmountSpan } from "@/components/amount-span";
import {
  parseDateParam,
  toDateParam,
  useTransactionFormContent,
} from "./context-provider";
import { LineItems } from "./line-items";
import { useAdjustmentsTotals } from "@/lib/adjustment-amount-store";
import { useTransactionContext } from "../context-provider";
import { SupplementalFormDetails } from "./supplemental-details";
import { ReceiptUpload } from "./receipt-upload";
import { Section } from "./section";
import { getFeaturedAccount } from "../store";
import { LineItemSummary, useActiveSectionKey } from "./line-item-summary";
import { useRef } from "react";

const TRANSACTION_FORM_ID = "transaction-form";

const SubmitButtonRow = () => {
  const { processing } = useTransactionFormContent();
  const { toggleForm } = useTransactionContext();

  return (
    <div className="grid grid-cols-[3fr_1fr] gap-4 col-span-full md:flex md:justify-end md:gap-2">
      <button
        type="submit"
        form={TRANSACTION_FORM_ID}
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

// Cash flow accounts always count toward the budget, so the exclusion only
// applies to non-cash-flow accounts.
const BudgetExclusion = () => {
  const { isCashFlow } = getFeaturedAccount();
  const { budgetExclusion, toggleBudgetExclusion } =
    useTransactionFormContent();

  if (isCashFlow) return null;

  return (
    <div className="col-span-full grid form-field-row items-center">
      <label htmlFor="budget-exclusion">Budget Exclusion?</label>
      <input
        id="budget-exclusion"
        type="checkbox"
        checked={budgetExclusion}
        onChange={toggleBudgetExclusion}
        className="checkbox checkbox-xs checkbox-secondary justify-self-start"
      />
    </div>
  );
};

const DetailsSection = () => {
  const { clearanceDate, description, setClearanceDate, setDescription } =
    useTransactionFormContent();
  const { isCashFlow } = getFeaturedAccount();

  return (
    <Section sectionKey="details">
      <div className="grid form-field-row">
        <label htmlFor="transaction-description">Description</label>
        <input
          id="transaction-description"
          type="text"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          className="input input-xs input-secondary"
        />
      </div>
      <div className="grid form-field-row">
        <label htmlFor="clearance-date">Clearance Date</label>
        <input
          id="clearance-date"
          name="clearance-date"
          type="date"
          value={clearanceDate ? toDateParam(clearanceDate) : ""}
          onChange={(ev) => setClearanceDate(parseDateParam(ev.target.value))}
          className="input input-xs input-secondary w-full"
        />
      </div>
      {/* Receipt is always pinned to the right column, whether or not budget
          exclusion (non-cash-flow accounts only) fills the left one. */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {!isCashFlow && <BudgetExclusion />}
        <div className="col-start-2 justify-self-end">
          <ReceiptUpload />
        </div>
      </div>
    </Section>
  );
};

const FormComponent = () => {
  const { processing, submit } = useTransactionFormContent();
  const scrollRef = useRef<HTMLFormElement>(null);
  const { activeSectionKey, scrollToSection } = useActiveSectionKey(scrollRef);

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (processing) return;

    submit();
  };

  return (
    <>
      <div className="transaction-form-modal-header flex justify-end gap-2 text-right">
        <TransactionTotal />
      </div>
      <form
        ref={scrollRef}
        id={TRANSACTION_FORM_ID}
        onSubmit={onSubmit}
        className="transaction-form-modal-scroll text-left"
      >
        <LineItems />
        <DetailsSection />
        <SupplementalFormDetails />
      </form>
      <LineItemSummary
        activeSectionKey={activeSectionKey}
        onSelect={scrollToSection}
      />
      <div className="transaction-form-modal-footer">
        <SubmitButtonRow />
      </div>
    </>
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
