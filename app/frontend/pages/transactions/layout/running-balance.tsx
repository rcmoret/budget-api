import { AmountSpan } from "@/components/amount-span"
import { useTransactionContext } from "../context-provider"

const RunningBalance = () => {
  const { transaction } = useTransactionContext()

  return (
    <div className="text-right col-span-2 md:col-span-1">
      <AmountSpan
        amount={transaction.runningBalance.cents}
        only="negative"
      />
    </div>
  )
}

export { RunningBalance }
