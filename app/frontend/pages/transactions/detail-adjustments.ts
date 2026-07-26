import {
  AdjustmentAmountItem,
  buildNewItem,
} from "@/lib/adjustment-amount-store";
import { TransactionDetail } from "@/types/transaction";

// Seed values for the adjustment store: each detail's saved amount becomes that
// item's initial amount, keyed by the detail's objectKey. Lives here (rather
// than in the form or the index store) so both the pre-mount seed and the
// form's own seed build identical items.
const detailsToAdjustments = (
  details: Array<Pick<TransactionDetail, "objectKey" | "amount">>,
): Array<AdjustmentAmountItem> =>
  details.map(({ objectKey, amount }) =>
    buildNewItem({ objectKey, amount: amount.display }),
  );

export { detailsToAdjustments };
