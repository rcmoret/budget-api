import { AmountSpan } from "@/components/amount-span"
import { useTransactionContext } from "../context-provider"
import { Stack } from "./stack";

const DetailAmounts = () => {
  const { transaction } = useTransactionContext()
  const { details } = transaction;

  if (details.length === 1) return null

  return (
    <>
      {details.map(({ key, amount }) => (
        <div key={key} className="text-sm">
          <AmountSpan amount={amount.cents} colorize="normal" />
        </div>
      ))}
    </>
  )
}

const TransactionAmounts = () => {
  const { transaction } = useTransactionContext()
  const { amount } = transaction
  const items = transaction.details.length === 1 ?
    [] :
    transaction.details.map(({ amount }) => (
      <AmountSpan amount={amount.cents} colorize="normal" />
    ))

  return (
    <Stack
      textAlign="right"
      items={items}
    >
      <AmountSpan amount={amount.cents} colorize="normal" />
    </Stack>
  )
}

export { TransactionAmounts }
