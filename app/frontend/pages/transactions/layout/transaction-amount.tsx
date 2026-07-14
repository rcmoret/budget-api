import { AmountSpan } from "@/components/amount-span";
import { useTransactionContext } from "../context-provider";
import { Stack } from "./stack";

const TransactionAmounts = () => {
  const { transaction } = useTransactionContext();
  const { amount } = transaction;
  const items =
    transaction.details.length === 1
      ? []
      : transaction.details.map(({ amount }) => (
          <AmountSpan amount={amount.cents} colorize="normal" />
        ));

  return (
    <Stack textAlign="right" items={items}>
      <AmountSpan amount={amount.cents} colorize="normal" />
    </Stack>
  );
};

export { TransactionAmounts };
