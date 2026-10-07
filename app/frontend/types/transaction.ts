import { JSONContent } from "@tiptap/react";
import { IconName } from "@/components/icon";
import { BudgetItem } from "./budget";
import { MonetaryAmount } from "./amount";

type AccountTransactionDetail = {
  key: string;
  objectKey: string;
  amount: MonetaryAmount;
  iconClassName: null | IconName;
} & (
  | { budgetItemKey: null; budgetCategoryName: null; budgetItemHref?: null }
  | {
      budgetItemKey: string;
      budgetCategoryName: string;
      // Absent on details added in the form before they're saved
      budgetItemHref?: string;
    }
);

type AccountTransaction = {
  key: string;
  objectKey: string;
  accountKey: string;
  accountSlug: string;
  amount: MonetaryAmount;
  checkNumber: null | string;
  clearanceDate: string | null;
  description: string | null;
  details: AccountTransactionDetail[];
  isBudgetExclusion: boolean;
  isoClearanceDate: null | string;
  notes: JSONContent | null;
  // Optional, not nullable: EntrySerializer emits the whole group only
  // `if: receipt_attached?`, so on a transaction with no receipt these keys are
  // absent rather than null.
  receiptContentType?: null | string;
  receiptFilename?: null | string;
  receiptUrl?: null | string;
  transferKey?: string;
  runningBalance: MonetaryAmount;
  updatedAt: string;
};

type TransactionDetailBudgetItem = Pick<
  BudgetItem,
  | "name"
  | "remaining"
  | "key"
  | "isAccrual"
  | "isMature"
  | "isFixed"
  | "isCleared"
>;

export {
  AccountTransaction,
  AccountTransactionDetail as TransactionDetail,
  TransactionDetailBudgetItem,
};
