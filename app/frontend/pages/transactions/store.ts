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
  featuredAccount: FeaturedAccount;
  transactions: Array<AccountTransaction>;
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
  transactions: [],
  resetShowFormKey: () => set({ showFormKey: null }),
  setShowFormKey: (key) => set({ showFormKey: key }),
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

export {
  initTransactionIndexStore,
  getBudgetItems,
  getFeaturedAccount,
  getTransactions,
  useShowFormKey,
  useSetShowFormKey,
};
