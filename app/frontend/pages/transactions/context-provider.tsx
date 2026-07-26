import { AccountTransaction } from "@/types/transaction";
import { useContext, createContext } from "react";
import { useSetShowFormKey, useShowFormKey } from "./store";
import { useAdjustmentStore } from "@/lib/adjustment-amount-store";

type TransactionContextValue = {
  isFormShown: boolean;
  objectKey: string;
  transaction: AccountTransaction;
  toggleForm: () => void;
};

const TransactionContext = createContext<TransactionContextValue | null>(null);

const TransactionProvider = (props: {
  transaction: AccountTransaction;
  children: React.ReactNode;
}) => {
  const { resetShowFormKey, showFormKey } = useShowFormKey();
  const { transaction, children } = props;
  const { objectKey } = transaction;
  const isFormShown = objectKey === showFormKey;
  const resetItems = useAdjustmentStore((s) => s.resetItems);
  const setShowFormKey = useSetShowFormKey();

  const toggleForm = () => {
    if (isFormShown) {
      resetShowFormKey();
      resetItems();
    } else {
      setShowFormKey(objectKey);
    }
  };
  const value: TransactionContextValue = {
    isFormShown,
    objectKey,
    transaction,
    toggleForm,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

const useTransactionContext = (): TransactionContextValue => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider",
    );
  }
  return context;
};

export { TransactionProvider, useTransactionContext };
