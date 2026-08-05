import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { detailsToAdjustments } from "./detail-adjustments";
import { AccountProps, FeaturedAccountType } from "@/types/account";
import {
  AccountTransaction,
  TransactionDetailBudgetItem,
} from "@/types/transaction";
import { useEffect } from "react";
import { create } from "zustand";

type FeaturedAccount = Omit<FeaturedAccountType, "transactions">;

type TransactionsIndexState = {
  accounts: Array<AccountProps>;
  budgetItems: Array<TransactionDetailBudgetItem>;
  showFormKey: null | string;
  showNewTransactionForm: boolean;
  featuredAccount: FeaturedAccount;
  transactions: Array<AccountTransaction>;
  closeNewTransactionForm: () => void;
  openNewTransactionForm: () => void;
  resetShowFormKey: () => void;
  setAccounts: (a: Array<AccountProps>) => void;
  setBudgetItems: (i: Array<TransactionDetailBudgetItem>) => void;
  setFeaturedAccount: (ft: FeaturedAccount) => void;
  setShowFormKey: (key: string) => void;
  setTransactions: (txn: Array<AccountTransaction>) => void;
};

const emptyFeaturedAccount: FeaturedAccount = {
  key: "",
  balancePriorTo: { cents: 0, display: "" },
  editRoute: "",
  isCashFlow: false,
  name: "",
  slug: "",
};

const useTransactionsIndexStore = create<TransactionsIndexState>((set) => ({
  accounts: [],
  budgetItems: [],
  featuredAccount: emptyFeaturedAccount,
  showFormKey: null,
  showNewTransactionForm: false,
  transactions: [],
  closeNewTransactionForm: () => set({ showNewTransactionForm: false }),
  // Opening the "Add Transaction" card and opening a row's edit form share the
  // same adjustment store, so only one can be open at a time — each closes
  // the other.
  openNewTransactionForm: () =>
    set({ showFormKey: null, showNewTransactionForm: true }),
  resetShowFormKey: () => set({ showFormKey: null }),
  setShowFormKey: (key) => set({ showFormKey: key, showNewTransactionForm: false }),
  setAccounts: (accounts) => set({ accounts }),
  setBudgetItems: (budgetItems) => set({ budgetItems }),
  setFeaturedAccount: (featuredAccount) => set({ featuredAccount }),
  setTransactions: (transactions) => set({ transactions }),
}));

const useSetShowFormKey = () => {
  const setShowFormKey = useTransactionsIndexStore((s) => s.setShowFormKey);
  const transactions = useTransactionsIndexStore((s) => s.transactions);
  const setAdjustments = useAdjustmentStore((s) => s.setAdjustments);

  return (objectKey: string) => {
    const transaction =
      transactions.find((t) => t.objectKey === objectKey) ?? null;
    if (!transaction) return;

    // Seed before the form mounts so the amount inputs paint with their saved
    // values instead of flashing empty.
    setAdjustments(detailsToAdjustments(transaction.details));
    setShowFormKey(objectKey);
  };
};

const initTransactionIndexStore = (
  props: Pick<
    TransactionsIndexState,
    "accounts" | "budgetItems" | "featuredAccount" | "transactions"
  >,
) => {
  const { budgetItems, accounts, featuredAccount, transactions } = props;
  const setAccounts = useTransactionsIndexStore((s) => s.setAccounts);
  const setFeaturedAccount = useTransactionsIndexStore(
    (s) => s.setFeaturedAccount,
  );
  const setBudgetItems = useTransactionsIndexStore((s) => s.setBudgetItems);
  const setTransactions = useTransactionsIndexStore((s) => s.setTransactions);

  useEffect(() => {
    setBudgetItems(budgetItems);
  }, [budgetItems, setBudgetItems]);

  useEffect(() => {
    setAccounts(accounts);
  }, [accounts, setAccounts]);

  useEffect(() => {
    setFeaturedAccount(featuredAccount);
  }, [featuredAccount, setFeaturedAccount]);

  useEffect(() => {
    setTransactions(transactions);
  }, [transactions, setTransactions]);
};

const getBudgetItems = () => useTransactionsIndexStore((s) => s.budgetItems);
const getFeaturedAccount = () =>
  useTransactionsIndexStore((s) => s.featuredAccount);
const getTransactions = () => useTransactionsIndexStore((s) => s.transactions);
const useShowFormKey = () => {
  const showFormKey = useTransactionsIndexStore((s) => s.showFormKey);
  const setShowFormKey = useTransactionsIndexStore((s) => s.setShowFormKey);
  const resetShowFormKey = useTransactionsIndexStore((s) => s.resetShowFormKey);

  return {
    resetShowFormKey,
    setShowFormKey,
    showFormKey,
  };
};

const useNewTransactionForm = () => {
  const showNewTransactionForm = useTransactionsIndexStore(
    (s) => s.showNewTransactionForm,
  );
  const openNewTransactionForm = useTransactionsIndexStore(
    (s) => s.openNewTransactionForm,
  );
  const closeNewTransactionForm = useTransactionsIndexStore(
    (s) => s.closeNewTransactionForm,
  );
  const resetItems = useAdjustmentStore((s) => s.resetItems);

  const toggle = () => {
    resetItems();
    if (showNewTransactionForm) {
      closeNewTransactionForm();
    } else {
      openNewTransactionForm();
    }
  };

  return { showNewTransactionForm, toggle };
};

export {
  initTransactionIndexStore,
  getBudgetItems,
  getFeaturedAccount,
  getTransactions,
  useNewTransactionForm,
  useShowFormKey,
  useSetShowFormKey,
};
