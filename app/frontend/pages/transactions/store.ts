import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { detailsToAdjustments } from "./detail-adjustments";
import { blankTransaction } from "./blank-transaction";
import { AccountProps, FeaturedAccountType } from "@/types/account";
import {
  AccountTransaction,
  TransactionDetailBudgetItem,
} from "@/types/transaction";
import { useEffect, useRef } from "react";
import { create } from "zustand";

type FeaturedAccount = Omit<FeaturedAccountType, "transactions">;

type SortDirection = "asc" | "desc";

type TransactionsIndexState = {
  accounts: Array<AccountProps>;
  budgetItems: Array<TransactionDetailBudgetItem>;
  showFormKey: null | string;
  showNewTransactionForm: boolean;
  sortDirection: SortDirection;
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
  toggleSortDirection: () => void;
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
  // Transactions arrive from the server oldest-first (ascending clearance
  // date, matching how running balances accrue) — "desc" reverses that for
  // display so newest lands on top, which is the default view.
  sortDirection: "desc",
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
  toggleSortDirection: () =>
    set((s) => ({ sortDirection: s.sortDirection === "asc" ? "desc" : "asc" })),
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

const EDITING_PARAM = "editing";
// Matches the `new_transaction` route, which is the index page with a trailing
// `/new` segment (after the optional month/year).
const NEW_TRANSACTION_SEGMENT = /\/new\/?$/;

type OpenForm = { isNew: true } | { isNew: false; objectKey: string | null };

// Client-only state, so this rewrites the URL in place rather than making an
// Inertia visit (which would refetch props). Inertia's own history.state is
// passed back through untouched so its back/forward handling keeps working.
const replaceFormUrl = (form: OpenForm) => {
  const url = new URL(window.location.href);
  const basePath = url.pathname.replace(NEW_TRANSACTION_SEGMENT, "");

  url.pathname = form.isNew ? `${basePath}/new` : basePath;
  if (!form.isNew && form.objectKey) {
    url.searchParams.set(EDITING_PARAM, form.objectKey);
  } else {
    url.searchParams.delete(EDITING_PARAM);
  }
  if (url.href === window.location.href) return;

  window.history.replaceState(window.history.state, "", url);
};

// Deep-links the form modal: `…/transactions(/:month/:year)/new` opens "Add
// Transaction", `?editing=<objectKey>` opens that row. Once the URL has been
// read, it tracks whichever form is open so it can be refreshed or shared.
//
// Takes the page's transactions directly instead of reading the store: the
// store is populated by an effect in this same component, so on the first
// pass it is still empty.
const useFormDeepLink = (transactions: Array<AccountTransaction>) => {
  const showFormKey = useTransactionsIndexStore((s) => s.showFormKey);
  const showNewTransactionForm = useTransactionsIndexStore(
    (s) => s.showNewTransactionForm,
  );
  const setShowFormKey = useTransactionsIndexStore((s) => s.setShowFormKey);
  const openNewTransactionForm = useTransactionsIndexStore(
    (s) => s.openNewTransactionForm,
  );
  const setAdjustments = useAdjustmentStore((s) => s.setAdjustments);
  const resetItems = useAdjustmentStore((s) => s.resetItems);
  const hasReadUrl = useRef(false);

  useEffect(() => {
    if (hasReadUrl.current) return;
    hasReadUrl.current = true;

    if (NEW_TRANSACTION_SEGMENT.test(window.location.pathname)) {
      resetItems();
      openNewTransactionForm();
      return;
    }

    const editing = new URLSearchParams(window.location.search).get(
      EDITING_PARAM,
    );
    if (!editing) return;

    // Only the current month's transactions are loaded, so a key from another
    // month simply doesn't match — the sync effect below then strips it.
    const transaction = transactions.find((t) => t.objectKey === editing);
    if (!transaction) return;

    setAdjustments(detailsToAdjustments(transaction.details));
    setShowFormKey(transaction.objectKey);
    // Deliberately once per mount: later prop reloads (e.g. after a save)
    // shouldn't reopen a form the user has closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasReadUrl.current) return;

    replaceFormUrl(
      showNewTransactionForm
        ? { isNew: true }
        : { isNew: false, objectKey: showFormKey },
    );
  }, [showFormKey, showNewTransactionForm]);
};

const getBudgetItems = () => useTransactionsIndexStore((s) => s.budgetItems);
const getFeaturedAccount = () =>
  useTransactionsIndexStore((s) => s.featuredAccount);
// Stored ascending (server order); "desc" reverses for display without
// mutating the stored order itself.
const getTransactions = () => {
  const transactions = useTransactionsIndexStore((s) => s.transactions);
  const sortDirection = useTransactionsIndexStore((s) => s.sortDirection);

  return sortDirection === "desc" ? [...transactions].reverse() : transactions;
};
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

type ActiveTransactionForm =
  | { isOpen: false }
  | {
      isOpen: true;
      isNew: boolean;
      objectKey: string;
      transaction: AccountTransaction;
      toggleForm: () => void;
    };

// The single source of truth for "which transaction form, if any, is open" —
// backs the one page-level form modal instead of each row/card computing its
// own open state. `showFormKey` (editing a row) and `showNewTransactionForm`
// (the "Add Transaction" card) are already mutually exclusive in this store,
// so at most one of these branches can ever apply.
const useActiveTransactionForm = (): ActiveTransactionForm => {
  const showFormKey = useTransactionsIndexStore((s) => s.showFormKey);
  const showNewTransactionForm = useTransactionsIndexStore(
    (s) => s.showNewTransactionForm,
  );
  const transactions = useTransactionsIndexStore((s) => s.transactions);
  const featuredAccount = useTransactionsIndexStore((s) => s.featuredAccount);
  const resetShowFormKey = useTransactionsIndexStore((s) => s.resetShowFormKey);
  const closeNewTransactionForm = useTransactionsIndexStore(
    (s) => s.closeNewTransactionForm,
  );
  const resetItems = useAdjustmentStore((s) => s.resetItems);

  if (showNewTransactionForm) {
    const { key: accountKey, slug: accountSlug, isCashFlow } = featuredAccount;
    const transaction = blankTransaction(accountKey, accountSlug, isCashFlow);

    return {
      isOpen: true,
      isNew: true,
      objectKey: transaction.objectKey,
      transaction,
      toggleForm: () => {
        resetItems();
        closeNewTransactionForm();
      },
    };
  }

  const transaction = transactions.find((t) => t.objectKey === showFormKey);
  if (!transaction) return { isOpen: false };

  return {
    isOpen: true,
    isNew: false,
    objectKey: transaction.objectKey,
    transaction,
    toggleForm: () => {
      resetShowFormKey();
      resetItems();
    },
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

const useTransactionSort = () => {
  const sortDirection = useTransactionsIndexStore((s) => s.sortDirection);
  const toggleSortDirection = useTransactionsIndexStore(
    (s) => s.toggleSortDirection,
  );

  return { sortDirection, toggleSortDirection };
};

export {
  initTransactionIndexStore,
  getBudgetItems,
  getFeaturedAccount,
  getTransactions,
  useActiveTransactionForm,
  useFormDeepLink,
  useNewTransactionForm,
  useShowFormKey,
  useSetShowFormKey,
  useTransactionSort,
  type ActiveTransactionForm,
  type SortDirection,
};
