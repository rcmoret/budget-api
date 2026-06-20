import { useTransactionContext } from "../context-provider"
import { Stack } from "./stack"

const TransactionDetails = () => {
  const { transaction } = useTransactionContext()
  const details = transaction.details.map((detail) => {
    return detail.budgetCategoryName ?? ""
  })
  const description = transaction.description ?? "-"

  return (
    <Stack items={details}>
      {description}
    </Stack>
  )
}

export { TransactionDetails }
