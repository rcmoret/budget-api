import { ActiveItemCard, CardLabel, CardRow } from "@/components/card";
import { ItemContextProvider, useBudgetItemContext } from "./context-provider";
import { BudgetItem } from "@/types/budget";
import { AmountSpan } from "@/components/amount-span";
import { Icon } from "@/components/icon";
import { FixedItemCard } from "./fixed-item-card";
import { VariableItemCard } from "./variable-item-card";
import { ItemCompositionDetails } from "./previous-current-budget-indicator";
import { AccrualPill } from "./accrual-pill";
import { KeyIdentifier } from "@/components/key-identifier";

const LabelMain = (props: { item: BudgetItem }) => {
  const { item } = props

  return (
    <div className="flex flex-row gap-2 items-center">
      <div>
        {item.name}
      </div>
      <div>
        <Icon name={item.iconClassName} />
      </div>
    </div >
  )
}

const BudgetItemCardLabel = (props: { item: BudgetItem }) => {
  const { item } = props

  return (
    <CardLabel label={<LabelMain item={item} />}>
      <AmountSpan amount={item.remaining.cents} colorize="none" absolute={true} />
    </CardLabel >
  )
}

const InnerCard = () => {
  const { item } = useBudgetItemContext()

  if (item.isVariable) {
    return <VariableItemCard />
  } else {
    return <FixedItemCard />
  }
}

const BudgetItemCard = (props: { item: BudgetItem }) => {
  const { item } = props

  return (
    <ItemContextProvider item={item} >
      <ActiveItemCard
        key={item.objectKey}
        id={item.objectKey}
        label={<BudgetItemCardLabel item={item} />}
      >
        <InnerCard />
        <AccrualPill />
        <CardRow>
          <KeyIdentifier identifier={item.key} className="text-base-content/66" />
        </CardRow>
        <ItemCompositionDetails />
      </ActiveItemCard>
    </ItemContextProvider>
  )
}

export { BudgetItemCard }
