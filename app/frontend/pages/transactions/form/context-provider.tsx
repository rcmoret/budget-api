// import { useForm } from "@inertiajs/react";
import { JSONContent } from "@tiptap/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTransactionContext } from "../context-provider";
import { useToggle } from "@/utils/hooks/useToogle";
import { useForm } from "@inertiajs/react";
import { DetailAttribute, useTransactionFormDetails } from "./details-context";
import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { detailsToAdjustments } from "../detail-adjustments";

type TransactionFormContextType = {
  accountKey: string;
  addDetail: (key?: string) => void;
  budgetExclusion: boolean;
  checkNumber: string;
  clearanceDate: null | Date;
  description: string;
  details: Array<DetailAttribute>;
  notes: JSONContent | null;
  nullifyDetailBudgetItemKey: (key: string) => void;
  processing: boolean;
  // The file picked in this editing session, and nothing else. What's already
  // attached to the transaction lives on the transaction itself
  // (`receiptUrl`/`receiptFilename`/`receiptContentType`) — read it from
  // `useTransactionContext`.
  receipt: null | File;
  removeDetail: (key: string) => void;
  setAccountKey: (val: string) => void;
  setCheckNumber: (val: string) => void;
  setClearanceDate: (val: Date | null) => void;
  setDescription: (val: string) => void;
  setDetailBudgetItemKey: (
    key: string,
    budgetItemKey: string,
    budgetCategoryName: string,
  ) => void;
  setNotes: (val: JSONContent) => void;
  setReceipt: (val: null | File) => void;
  submit: () => void;
  toggleBudgetExclusion: () => void;
};

// `clearanceDate` is a calendar date, not an instant — formatting it through
// `toISOString` would shift it by the local UTC offset. Reading the parts
// straight off the `Date` keeps the day the user picked.
const toDateParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TransactionFormContext = createContext<null | TransactionFormContextType>(
  null,
);

const TransactionFormProvider = (props: { children: React.ReactNode }) => {
  const { transaction, toggleForm } = useTransactionContext();
  const {
    addDetail,
    details: detailsAttributes,
    nullifyDetailBudgetItemKey,
    removeDetail,
    setDetailBudgetItemKey,
  } = useTransactionFormDetails();
  const initialClearanceDate = transaction.isoClearanceDate
    ? new Date(transaction.isoClearanceDate)
    : null;
  const [description, setDescription] = useState<string>(
    transaction.description ?? "",
  );
  const [checkNumber, setCheckNumber] = useState<string>(
    transaction.checkNumber ?? "",
  );
  const [notes, setNotes] = useState<JSONContent | null>(transaction.notes);
  const [clearanceDate, setClearanceDate] = useState<null | Date>(
    initialClearanceDate,
  );
  const [receipt, setReceipt] = useState<null | File>(null);
  const [accountKey, setAccountKey] = useState<string>(transaction.accountKey);
  const [budgetExclusion, toggleBudgetExclusion] = useToggle(
    transaction.isBudgetExclusion,
  );
  const { transform, put, processing } = useForm({});
  const setAdjustments = useAdjustmentStore((s) => s.setAdjustments);

  // Re-seed only when the *set* of details changes. Joining the keys keeps the
  // dep stable across prop refreshes (e.g. a PUT response) so in-progress edits
  // held in the store aren't wiped back to their saved values.
  const detailKeys = transaction.details
    .map(({ objectKey }) => objectKey)
    .sort()
    .join(".");

  useEffect(() => {
    setAdjustments(detailsToAdjustments(transaction.details));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailKeys]);

  // Clearing a line item only blanks it on screen — a detail that was already
  // saved still exists server-side, and Rails ignores nested records that are
  // simply absent from the payload. So a blank *persisted* detail is submitted
  // with `_destroy: true`, which `accepts_nested_attributes_for :details,
  // allow_destroy: true` and the controller's permitted `_destroy` expect.
  //
  // Blank means no budget item *and* a zero amount. Requiring both matters:
  // budget-exclusion transactions legitimately carry details with no budget
  // item, and those have a non-zero amount, so they're never destroyed here.
  const persistedKeys = transaction.details.map(({ objectKey }) => objectKey);
  const isBlank = (detail: DetailAttribute) =>
    !detail.budgetItemKey && detail.amount.cents === 0;

  // The backend identifies a detail by `key` (looked up via
  // `transaction.details.by_key` to resolve its `id`) and stores `amount` as a
  // plain integer column — neither `objectKey` nor a `{ cents, display }`
  // object means anything to it, and `budgetCategoryName` is display-only, so
  // it's dropped rather than sent as an unpermitted param.
  const detailPayload = (detail: DetailAttribute) => {
    const base = {
      key: detail.key,
      budgetItemKey: detail.budgetItemKey,
      amount: detail.amount.cents,
    };

    return isBlank(detail) && persistedKeys.includes(detail.objectKey)
      ? { ...base, _destroy: true }
      : base;
  };

  // `receipt` is included only when a file was actually picked. Sending it empty
  // would reach `assign_attributes` as nil, and nil on a `has_one_attached`
  // purges the attachment — so an untouched picker would wipe the receipt that's
  // already there. Purging is the DELETE .../receipt route's job.
  transform(() => {
    return {
      transaction: {
        accountKey,
        checkNumber,
        clearanceDate: clearanceDate ? toDateParam(clearanceDate) : null,
        description,
        isBudgetExclusion: budgetExclusion,
        notes,
        detailsAttributes: detailsAttributes.map(detailPayload),
        ...(receipt ? { receipt } : {}),
      },
    };
  });

  const updateUrl =
    `/account/${transaction.accountSlug}/transaction/${transaction.key}`;

  const submit = () => put(updateUrl, { onSuccess: toggleForm });

  const value: TransactionFormContextType = {
    accountKey,
    addDetail,
    budgetExclusion,
    checkNumber,
    clearanceDate,
    description,
    details: detailsAttributes,
    notes,
    nullifyDetailBudgetItemKey,
    processing,
    receipt,
    removeDetail,
    setAccountKey,
    setCheckNumber,
    setClearanceDate,
    setDescription,
    setDetailBudgetItemKey,
    setNotes,
    setReceipt,
    submit,
    toggleBudgetExclusion,
  };

  return (
    <TransactionFormContext.Provider value={value}>
      {props.children}
    </TransactionFormContext.Provider>
  );
};

const useTransactionFormContent = () => {
  const context = useContext(TransactionFormContext);

  if (!context) {
    throw (
      new Error(),
      "useTransactionFormContent must be used within TransactionFormProvider"
    );
  }

  return context;
};

export { useTransactionFormContent, TransactionFormProvider };
