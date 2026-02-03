import { IconName } from "@/components/common/Icon";

export interface AccountTransactionDetail {
  key: string;
  amount: number;
  budgetItemKey: null | string;
  budgetCategoryName: null | string;
  iconClassName: null | IconName;
}

export interface AccountTransaction {
  key: string;
  accountKey: string;
  accountSlug: string;
  amount: number;
  checkNumber: null | string;
  clearanceDate: string | null;
  description: string | null;
  details: AccountTransactionDetail[];
  isBudgetExclusion: boolean;
  notes: string | null;
  receiptContentType: string | null;
  receiptFilename: string | null;
  receiptUrl: string | null;
  shortClearanceDate: string | null;
  transferKey?: string;
  updatedAt: string;
}
