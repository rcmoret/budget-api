import { ItemContainer, LocalAmountInput } from ".";
import { useBudgetDashboardItemContext } from "./context_provider"
import { useBudgetDashboardContext } from "../context_provider"
import { useToggle } from "@/lib/hooks/useToogle"
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { AmountSpan } from "@/components/common/AmountSpan"

const PendingItemForm = () => {
  const { form } = useBudgetDashboardContext()
  const { item } = useBudgetDashboardItemContext()

  const [showAdjustmentInput, toggleAdjustmentInput] = useToggle(true)

  const { change, draftItem } = item

  if (!draftItem || !change) { return null }
  const onChange = (amount: string) => { form.updateChangeV2({ key: item.key, adjustment: amount }) }

  const onChange2 = (amount: string) => {
    form.updateChangeV2({ key: item.key, amount })
    // setNewAmountValue(amount)
  }
  return (
    <Row styling={{ padding: "p-2", flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
      <Cell styling={{ width: "w-6/12" }}>
        Adjustment
      </Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right", padding: "py-1" }}>
        <LocalAmountInput
          isInputShown={showAdjustmentInput}
          itemKey={item.key}
          amount={change.amount}
          onChange={onChange}
          toggleInput={toggleAdjustmentInput}
        >
          <AmountSpan color="text-gray-800" amount={change.amount.cents ?? 0} />
        </LocalAmountInput>
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        New Amount
      </Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right", padding: "py-1" }}>
        <LocalAmountInput
          isInputShown={!showAdjustmentInput}
          itemKey={item.key}
          amount={change.updatedAmount}
          onChange={onChange2}
          toggleInput={toggleAdjustmentInput}
        >
          <AmountSpan color="text-gray-800" amount={draftItem.amount} />
        </LocalAmountInput>
      </Cell>
    </Row>
  )
}
const PendingMonthItem = () => {
  return (
    <ItemContainer>
      <PendingItemForm />
    </ItemContainer>
  )
}

export { PendingMonthItem }
