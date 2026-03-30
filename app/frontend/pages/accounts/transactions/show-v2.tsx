import { AmountSpan } from "@/components/common/AmountSpan";
import { dateParse } from "@/lib/DateFormatter";
import {
  type TransactionProviderProps,
  TransactionProvider,
  useTransactionContext,
} from "@/pages/accounts/transactions/context-provider";

const TransactionShowContent = () => {
  const { transaction, showForm } = useTransactionContext();
  const { isPending } = transaction;
  const { isOdd } = useTransactionContext();
  const bgColor = isOdd ? "bg-sky-100" : "bg-sky-50";

  const clearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate));
  const shortClearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate), {
        format: "m/d/yy",
      });

  return (
    <tr className={bgColor}>
      <td>{clearanceDate}</td>
      <td>{transaction.description}</td>
      <td>
        <AmountSpan amount={transaction.amount} />
      </td>
      <td>
        <AmountSpan amount={transaction.balance || 0} />
      </td>
    </tr>
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
