import { KeySpan } from "@/components/common/KeySpan";
import { useContext, createContext } from "react";
import { TransactionWithBalance } from "@/pages/accounts/transactions";

type ProviderProps = {
  index: number;
  showFormFn: (key: string | null) => void;
  transaction: TransactionWithBalance;
};

type TransactionFlags = "noDescription" | "noItems" | "singleItem";

type TransactionContextValue = {
  isOdd: boolean;
  showForm: () => void;
  flags: Record<TransactionFlags, boolean>;
  transaction: TransactionWithBalance;
};

const LocalContext = createContext<TransactionContextValue | null>(null);

/**
 * @property index - The transaction's index in the list (used for alternating row styles)
 * @property setShowFormKey - Callback to show/hide the transaction form
 * @property transaction - The transaction data with balance information
 */
const TransactionProvider = (
  props: ProviderProps & { children: React.ReactNode },
) => {
  const { children, index, transaction } = props;
  const { description, details } = transaction;

  const flags: Record<TransactionFlags, boolean> = {
    noDescription: !description,
    noItems: !details.length,
    singleItem: details.length === 1,
  };

  const value: TransactionContextValue = {
    flags,
    isOdd: index % 2 === 1,
    showForm: () => props.showFormFn(transaction.key),
    transaction,
  };

  return (
    <LocalContext.Provider value={value}>
      <KeySpan _key={transaction.key} />

      {children}
    </LocalContext.Provider>
  );
};

const useTransactionContext = (): TransactionContextValue => {
  const context = useContext(LocalContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a Transaction Provider",
    );
  }

  return context;
};

export {
  TransactionProvider,
  useTransactionContext,
  type ProviderProps as TransactionProviderProps,
};
