import { AmountSpan } from "@/components/common/AmountSpan";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import {
  type TransactionProviderProps,
  TransactionProvider,
  useTransactionContext,
} from "@/pages/accounts/transactions/context-provider";
import { Button } from "@/components/common/Button";
import { BalanceComponent } from "./partials/balance-component";
import { ClearanceDateComponent } from "./partials/clearance-date";
import { DescriptionComponent } from "./partials/description-component";
import { EntryDetailsComponent } from "./partials/entry-details";
import { EntryActionsComponent } from "./partials/entry-actions-component";
import { ReceiptDisplayComponent } from "./partials/receipt-display-component";

const TransactionAmountComponent = () => {
  const { transaction, showForm } = useTransactionContext();

  return (
    <div className="w-full text-right">
      <Button type="button" onClick={showForm}>
        <AmountSpan amount={transaction.amount} negativeColor="text-red-400" />
      </Button>
      {transaction.details.length > 1 &&
        transaction.details.map((d) => (
          <div className="text-sm">
            <AmountSpan amount={d.amount} negativeColor="text-red-400" />
          </div>
        ))}
    </div>
  );
};

const TransactionShowContent = () => {
  const { isOdd } = useTransactionContext();

  const bgColor = isOdd ? "bg-sky-100" : "bg-sky-50";

  const outerClassName = [
    "grid",
    "grid-cols-[minmax(125px,auto)_minmax(200px,auto)_minmax(125px,auto)_minmax(125px,auto)_1fr]",
    "gap-x-4",
  ].join(" ");

  const subgridClassName = [
    "col-span-5",
    "grid",
    "grid-cols-subgrid",
    "items-start",
    "px-4",
    "py-2",
    bgColor,
  ].join(" ");

  return (
    <div>
      <div className={outerClassName}>
        <div className={subgridClassName}>
          <ClearanceDateComponent />
          <DescriptionComponent />
          <div className="flex flex-col items-end">
            <TransactionAmountComponent />
          </div>
          <BalanceComponent />
          <div className="flex justify-between items-end px-2">
            <EntryDetailsComponent />
            <EntryActionsComponent />
          </div>
        </div>
      </div>
      <div className={`w-full p-4 ${bgColor}`}>
        <ReceiptDisplayComponent />
      </div>
    </div>
  );
};

const TransactionShow = (props: TransactionProviderProps) => {
  return (
    <TransactionProvider {...props}>
      <TransactionShowContent />
    </TransactionProvider>
  );
};

export { TransactionShow };
