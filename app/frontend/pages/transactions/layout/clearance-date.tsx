import { useTransactionContext } from "../context-provider";

const ClearanceDate = () => {
  const { transaction } = useTransactionContext();

  return (
    <div className="col-span-2 md:col-span-1">{transaction.clearanceDate}</div>
  );
};

export { ClearanceDate };
