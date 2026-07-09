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
  featuredAccount: FeaturedAccount;
  transactions: Array<AccountTransaction>;
  setAccounts: (a: Array<AccountProps>) => void;
  setBudgetItems: (i: Array<TransactionDetailBudgetItem>) => void;
  setFeaturedAccount: (ft: FeaturedAccount) => void;
  setTransactions: (txn: Array<AccountTransaction>) => void;
};

const emptyFeaturedAccount: FeaturedAccount = {
  name: "",
  balancePriorTo: { cents: 0, display: "" },
  key: "",
  slug: "",
};

const useTransactionsIndexStore = create<TransactionsIndexState>((set) => ({
  accounts: [],
  budgetItems: [],
  featuredAccount: emptyFeaturedAccount,
  transactions: [],
  setAccounts: (accounts) => set({ accounts }),
  setBudgetItems: (budgetItems) => set({ budgetItems }),
  setFeaturedAccount: (featuredAccount) => set({ featuredAccount }),
  setTransactions: (transactions) => set({ transactions }),
}));

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

export {
  initTransactionIndexStore,
  getBudgetItems,
  getFeaturedAccount,
  getTransactions,
};
