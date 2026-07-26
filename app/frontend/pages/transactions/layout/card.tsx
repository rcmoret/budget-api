import { AccountTransaction } from "@/types/transaction";
import {
  TransactionProvider,
  useTransactionContext,
} from "../context-provider";
import { ClearanceDate } from "./clearance-date";
import { TransactionDetails } from "./transaction-details";
import { TransactionAmounts } from "./transaction-amount";
import { RunningBalance } from "./running-balance";
import { ReceiptComponent } from "./receipt-component";
import { SupplementalInfo } from "./supplemental-info";
import { getFeaturedAccount } from "../store";
import { getBudgetMonth } from "@/pages/budget/month-store";
import React from "react";
import { FormComponent } from "../form";
import { TransactionFormProvider } from "../form/context-provider";

const cardClassNames = [
  "shadow-md",
  "last:mb-12",
  "self-start",
  "odd:bg-base-300",
  "even:bg-base-300/50",
];

const MainComponent = () => {
  const { isFormShown } = useTransactionContext();

  if (isFormShown) {
    return (
      <TransactionFormProvider>
        <FormComponent />
      </TransactionFormProvider>
    );
  } else {
    return <ShowComponent />;
  }
};
const ShowComponent = () => {
  const { objectKey, toggleForm } = useTransactionContext();
  return (
    <button
      type="button"
      className="grid grid-cols-subgrid col-span-full text-left"
      id={objectKey}
      onClick={toggleForm}
    >
      <ClearanceDate />
      <TransactionDetails />
      <TransactionAmounts />
      <RunningBalance />
      <ReceiptComponent />
    </button>
  );
};

const InnerCard = () => {
  const { isFormShown, transaction } = useTransactionContext();
  const baseClassName = isFormShown ? "form-card" : "card";
  const cardClassName = [baseClassName, ...cardClassNames].join(" ");
  return (
    <div id={transaction.objectKey} className={cardClassName}>
      <MainComponent />
      <SupplementalInfo />
    </div>
  );
};

const AccountTransactionCard = (props: { transaction: AccountTransaction }) => {
  return (
    <TransactionProvider transaction={props.transaction}>
      <InnerCard />
    </TransactionProvider>
  );
};

const InitialBlance = () => {
  const featuredAccount = getFeaturedAccount();
  const budgetMonth = getBudgetMonth();
  const { balancePriorTo } = featuredAccount;

  const balanceInfo: AccountTransaction = {
    key: "initial",
    accountKey: "",
    accountSlug: "",
    amount: balancePriorTo,
    checkNumber: null,
    clearanceDate: budgetMonth.firstDate,
    description: "Initial Balance",
    details: [],
    isBudgetExclusion: false,
    isoClearanceDate: null,
    notes: null,
    objectKey: "",
    receiptContentType: null,
    receiptUrl: null,
    receiptFilename: null,
    runningBalance: balancePriorTo,
    updatedAt: "",
  };

  return (
    <TransactionProvider transaction={balanceInfo}>
      <div className={cardClassNames}>
        <ClearanceDate />
        <TransactionDetails />
        <TransactionAmounts />
        <RunningBalance />
      </div>
    </TransactionProvider>
  );
};

export { AccountTransactionCard, InitialBlance };
