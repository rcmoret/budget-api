import { useTransactionContext } from "../context-provider"
import { Stack } from "./stack"

const TransactionDetails = () => {
  const { transaction } = useTransactionContext()
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
