import { CardRow } from "@/layout/card";
import { AmountSpan } from "@/components/amount-span";
import { useBudgetItemContext } from "./context-provider";

const VariableItemCard = () => {
  const { item } = useBudgetItemContext()
  const label = item.isExpense ? "Spent" : "Deposited"

  return (
    <>
      <CardRow>
        <div>
          Budgeted:
        </div>
        <div>
          <AmountSpan amount={item.amount.cents} colorize="none" absolute={true} />
        </div>
      </CardRow>
      <CardRow>
        <div>
          {label}
        </div>
        <div>
          <AmountSpan amount={item.transactionDetailTotal.cents} colorize="none" absolute={true} />
        </div>
      </CardRow>
    </>
  )
}

export { VariableItemCard }
