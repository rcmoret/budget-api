import { AccountSummary } from "@/types/account";
import { AccountTransactionDetail } from "@/types/transaction";
import { ModeledTransaction as Transaction } from "@/lib/models/transaction";

const byPriority = (account1: AccountSummary, account2: AccountSummary) =>
  account2.priority - account1.priority;

const byClearanceDate = (transaction1: Transaction, transaction2: Transaction) => {
  const today = new Date().toISOString().split("T")[0];
  const txn1ClearanceDate = String(transaction1.clearanceDate);
  const txn2ClearanceDate = String(transaction2.clearanceDate);

  if (txn1ClearanceDate === txn2ClearanceDate) {
    return transaction1.updatedAt < transaction2.updatedAt ? -1 : 1;
  } else if (transaction1.isCleared && transaction2.isCleared) {
    return txn1ClearanceDate < txn2ClearanceDate ? -1 : 1;
  } else if (transaction1.isPending) {
    return txn2ClearanceDate > today ? -1 : 1;
  } else {
    return txn1ClearanceDate <= today ? -1 : 1;
  }
};


const byCategoryName = (detail1: AccountTransactionDetail, detail2: AccountTransactionDetail) => {
  if (detail1.budgetCategoryName === detail2.budgetCategoryName) {
    return detail1.key > detail2.key ? -1 : 1;
  } else {
    return String(detail1.budgetCategoryName) < String(detail2.budgetCategoryName) ? -1 : 1;
  }
};

const byAmount = (detail1: AccountTransactionDetail, detail2: AccountTransactionDetail) => {
  if (detail1.amount === detail2.amount) {
    return detail1.key > detail2.key ? -1 : 1;
  } else {
    return Math.abs(detail2.amount) - Math.abs(detail1.amount);
  }
};

export {
  byAmount, byCategoryName, byClearanceDate, byPriority,
};
