import { AccountTransaction } from "@/types/transaction";
import { TransactionContext } from "../context-provider";
import { FormComponent } from "../form";
import { TransactionFormProvider } from "../form/context-provider";
import { getFeaturedAccount, useNewTransactionForm } from "../store";
import { SupplementalInfo } from "./supplemental-info";

const blankTransaction = (
  accountKey: string,
  accountSlug: string,
): AccountTransaction => ({
  key: "",
  objectKey: "new",
  accountKey,
  accountSlug,
  amount: { cents: 0, display: "" },
  checkNumber: null,
  clearanceDate: null,
  description: null,
  details: [],
  isBudgetExclusion: false,
  isoClearanceDate: null,
  notes: null,
  receiptContentType: null,
  receiptFilename: null,
  receiptUrl: null,
  runningBalance: { cents: 0, display: "" },
  updatedAt: "",
});

const ToggleButton = () => {
  const { toggle } = useNewTransactionForm();

  return (
    <button
      type="button"
      onClick={toggle}
      className="col-span-full self-start shadow-md rounded text-center font-medium py-3 bg-base-300/70 hover:bg-base-300 transition-colors"
    >
      + Add Transaction
    </button>
  );
};

const ExpandedForm = () => {
  const { toggle } = useNewTransactionForm();
  const { key: accountKey, slug: accountSlug } = getFeaturedAccount();
  const transaction = blankTransaction(accountKey, accountSlug);

  const value = {
    isFormShown: true,
    isNew: true,
    objectKey: transaction.objectKey,
    transaction,
    toggleForm: toggle,
  };

  return (
    <TransactionContext.Provider value={value}>
      <div className="form-card shadow-md self-start">
        <TransactionFormProvider>
          <FormComponent />
        </TransactionFormProvider>
        <SupplementalInfo />
      </div>
    </TransactionContext.Provider>
  );
};

const NewTransactionCard = () => {
  const { showNewTransactionForm } = useNewTransactionForm();

  return showNewTransactionForm ? <ExpandedForm /> : <ToggleButton />;
};

export { NewTransactionCard };
