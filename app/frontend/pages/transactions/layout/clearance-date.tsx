import { useTransactionContext } from "../context-provider";

const ClearanceDate = () => {
  const { transaction } = useTransactionContext();

  return <div>{transaction.clearanceDate}</div>;
};

export { ClearanceDate };
