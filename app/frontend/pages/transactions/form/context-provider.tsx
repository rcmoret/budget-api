// import { useForm } from "@inertiajs/react";
import { JSONContent } from "@tiptap/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTransactionContext } from "../context-provider";
import { useToggle } from "@/utils/hooks/useToogle";
import { useForm } from "@inertiajs/react";
import { DetailAttribute, useTransactionFormDetails } from "./details-context";
import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { detailsToAdjustments } from "../detail-adjustments";
import { getRedirectQueryParams } from "@/lib/app-stores/app-config-store";
import { generateKeyIdentifier } from "@/utils/KeyIdentifier";

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
  const { transaction, toggleForm, isNew } = useTransactionContext();
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
  const [newTransactionKey] = useState<string>(() => generateKeyIdentifier());
  const { transform, post, put, processing } = useForm({});
  const setAdjustments = useAdjustmentStore((s) => s.setAdjustments);

  const detailKeys = transaction.details
    .map(({ objectKey }) => objectKey)
    .sort()
    .join(".");

  useEffect(() => {
    setAdjustments(detailsToAdjustments(transaction.details));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailKeys]);

  useEffect(() => {
    if (isNew) addDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistedKeys = transaction.details.map(({ objectKey }) => objectKey);
  const isBlank = (detail: DetailAttribute) =>
    !detail.budgetItemKey && detail.amount.cents === 0;

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

  transform(() => {
    return {
      transaction: {
        ...(isNew ? { key: newTransactionKey } : {}),
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

  const createUrl = `/account/${transaction.accountSlug}/transaction`;
  const updateUrl =
    `/account/${transaction.accountSlug}/transaction/${transaction.key}`;
  const redirectParams = getRedirectQueryParams();

  const submit = () =>
    isNew
      ? post(`${createUrl}?${redirectParams}`, { onSuccess: toggleForm })
      : put(`${updateUrl}?${redirectParams}`, { onSuccess: toggleForm });

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
