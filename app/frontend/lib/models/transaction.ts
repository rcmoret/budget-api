import { AccountTransaction } from "@/types/transaction";

interface ModeledTransaction extends AccountTransaction {
  isCleared: boolean;
  isPending: boolean;
}

const accountTransaction = (
  transaction: AccountTransaction,
): ModeledTransaction => {
  const isCleared = !!transaction.clearanceDate;

  return {
    ...transaction,
    isCleared,
    isPending: !isCleared,
  };
};

export { accountTransaction, ModeledTransaction };
