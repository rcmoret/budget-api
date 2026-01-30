import { AmountSpan } from "@/components/common/AmountSpan";
import { useTransactionContext } from "@/pages/accounts/transactions/context-provider";

const BalanceComponent = () => {
  const { transaction } = useTransactionContext();

  if (transaction.balance === null) {
    return null;
  }

  return (
    <>
      <div className="text-sm text-gray-700 md:hidden">Balance</div>
      <div className="w-4/12 md:w-full border-t border-gray-400 text-right text-bold md:border-none">
        <AmountSpan amount={transaction.balance} negativeColor="text-red-400" />
      </div>
    </>
  );
};

export { BalanceComponent };
