import { AmountSpan } from "@/components/amount-span"
import { useTransactionContext } from "../context-provider"

const RunningBalance = () => {
  const { transaction } = useTransactionContext()

  return (
    <div className="text-right">
      <AmountSpan
        amount={transaction.runningBalance.cents}
        only="negative"
      />
    </div>
  )
}

export { RunningBalance }
