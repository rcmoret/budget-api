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
    <div className="w-full">
      <Button type="button" onClick={showForm}>
        <AmountSpan amount={transaction.amount} negativeColor="red" />
      </Button>
    </div>
  );
};

const TransactionShowContent = () => {
  const { isOdd } = useTransactionContext();

  const bgColor = isOdd ? "bg-sky-100" : "bg-sky-50";

  return (
    <Row
      styling={{
        backgroundColor: bgColor,
        flexAlign: "justify-start",
        flexWrap: "flex-wrap",
        padding: "px-4 py-2",
      }}
    >
      <div className="flex w-full md:w-6/12">
        <Cell
          styling={{
            width: "w-full",
            flexAlign: "justify-between",
            display: "flex",
            gap: "gap-2",
            flexWrap: "flex-wrap md:flex-nowrap",
          }}
        >
          <ClearanceDateComponent />
          <div className="w-4/12">
            <DescriptionComponent />
          </div>
          <div className="w-4/12 flex flex-row justify-end gap-12 text-right">
            <TransactionAmountComponent />
          </div>
          <div className="w-full md:w-4/12 flex flex-row justify-between mt-4 md:mt-0">
            <BalanceComponent />
          </div>
        </Cell>
      </div>
      <EntryDetailsComponent />
      <Cell
        styling={{
          width: "md:w-[14%] w-full",
          flexAlign: "md:justify-start justify-end",
          margin: "md:mr-4",
        }}
      >
        <EntryActionsComponent />
      </Cell>
      <ReceiptDisplayComponent />
    </Row>
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
