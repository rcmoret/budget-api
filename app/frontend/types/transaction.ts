import { IconName } from "@/components/icon";
import { BudgetItem } from "./budget";
import { MonetaryAmount } from "./amount";

type AccountTransactionDetail = {
  key: string;
  amount: MonetaryAmount;
  budgetItemKey: null | string;
  budgetCategoryName: null | string;
  iconClassName: null | IconName;
}

type AccountTransaction = {
  key: string;
  accountKey: string;
  accountSlug: string;
  amount: MonetaryAmount;
  checkNumber: null | string;
  clearanceDate: string | null;
  description: string | null;
  details: AccountTransactionDetail[];
  isBudgetExclusion: boolean;
  notes: string | null;
  receiptContentType: string | null;
  receiptFilename: string | null;
  receiptUrl: string | null;
  transferKey?: string;
  runningBalance: MonetaryAmount;
  updatedAt: string;
}

type TransactionDetailBudgetItem = Pick<
  BudgetItem,
  "name" |
  "remaining" |
  "key" |
  "isAccrual" |
  "isMature"
>

export { AccountTransaction, TransactionDetailBudgetItem }
