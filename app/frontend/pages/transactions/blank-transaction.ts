import { AccountTransaction } from "@/types/transaction";

const blankTransaction = (
  accountKey: string,
  accountSlug: string,
  isCashFlow: boolean,
): AccountTransaction => ({
  key: "",
  objectKey: "new",
  accountKey,
  accountSlug,
  amount: { cents: 0, display: "" },
  checkNumber: null,
  clearanceDate: null,
  description: null,
  details: [],
  isBudgetExclusion: !isCashFlow,
  isoClearanceDate: null,
  notes: null,
  receiptContentType: null,
  receiptFilename: null,
  receiptUrl: null,
  runningBalance: { cents: 0, display: "" },
  updatedAt: "",
});

export { blankTransaction };
