import { MonetaryAmount } from "@/types/amount"
import { useBudgetDashboardStore } from "../store"
import { AmountSpan } from "@/components/amount-span"

const Row = (props: { index: number, label: string, amount: MonetaryAmount }) => {
  const { index, label, amount } = props

  const rowClassName = [
    "flex",
    "justify-between",
    "w-full",
    ...(index === 3 ? ["border-t", "border-secondary", "pt-2"] : [])
  ].join(" ")

  return (
    <div className={rowClassName}>
      <div>
        {label}
      </div>
      <div>
        <AmountSpan amount={amount.cents} colorize="normal" />
      </div>
    </div>
  )
}

const Discretionary = () => {
  const discretionary = useBudgetDashboardStore((s) => s.discretionary)

  const valueMap = [
    {
      label: "Initial",
      key: "initial",
      amount: discretionary.initialAmount
    },
    {
      label: "Over/Under Budget",
      key: "overunder",
      amount: discretionary.overUnderBudget
    },
    {
      label: "Transactions Total",
      key: "txn-total",
      amount: discretionary.transactionsTotal
    },
    {
      label: "Remaining",
      key: "remaining",
      amount: discretionary.remaining
    }
  ]

  return (
    <div>
      <div className="text-lg">
        Discretionary
      </div>
      <div className="text-sm grid gap-0 py-2 pl-4 pr-2 bg-base-200 rounded shadow-md">
        {valueMap.map((tuple, index) => (
          <Row
            key={tuple.key}
            index={index}
            label={tuple.label}
            amount={tuple.amount}
          />
        ))}
      </div>
    </div>
  )
}

export { Discretionary }
