import { BudgetItemTransactionDetail } from "@/types/budget";
import { AmountSpan } from "@/components/amount-span";
import { Pill } from "@/components/pill";

const ClearanceDate = (props: { detail: BudgetItemTransactionDetail }) => {
  const { clearanceDate, isPending } = props.detail;

  if (isPending) {
    return (
      <div className="w-fit">
        <Pill themeOption="warning">pending</Pill>
      </div>
    );
  }

  return <div>{clearanceDate}</div>;
};

const TransactionDetailRow = (props: {
  detail: BudgetItemTransactionDetail;
}) => {
  const { detail } = props;

  return (
    <div className="grid grid-cols-subgrid col-span-full items-center">
      <ClearanceDate detail={detail} />
      <div className="min-w-0">
        <div className="truncate">{detail.description ?? "-"}</div>
        <div className="text-xs text-base-content/70">{detail.accountName}</div>
      </div>
      <div className="text-right">
        <AmountSpan amount={detail.amount.cents} />
      </div>
    </div>
  );
};

// The transactions applied to a budget item, rendered inside its card
const ItemTransactionDetails = (props: {
  details: Array<BudgetItemTransactionDetail>;
}) => {
  const { details } = props;

  if (!details.length) return null;

  return (
    <div className="flex flex-col gap-1 pt-2 border-t border-primary/40">
      <div className="font-medium">Transactions</div>
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2 text-sm">
        {details.map((detail) => (
          <TransactionDetailRow key={detail.key} detail={detail} />
        ))}
      </div>
    </div>
  );
};

export { ItemTransactionDetails };
