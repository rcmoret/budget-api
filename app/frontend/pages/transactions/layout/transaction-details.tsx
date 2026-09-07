import { useTransactionContext } from "../context-provider"
import { Stack } from "./stack"

const TransactionDetails = () => {
  const { transaction } = useTransactionContext()
  const hasSingleUnlabeledDetail =
    transaction.details.length === 1 && !transaction.description

  if (hasSingleUnlabeledDetail) {
    return (
      <Stack items={[]} className="min-w-0">
        {transaction.details[0].budgetCategoryName ?? "-"}
      </Stack>
    )
  }

  const details = transaction.details.map((detail) => {
    return detail.budgetCategoryName ?? ""
  })
  const description = transaction.description ?? "-"

  return (
    <Stack items={details} className="min-w-0">
      {description}
    </Stack>
  )
}

export { TransactionDetails }
