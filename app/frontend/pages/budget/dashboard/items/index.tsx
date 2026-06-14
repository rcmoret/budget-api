import { useBudgetDashboardStore, useBudgetItemGroups } from "@/pages/budget/dashboard/store";
import { BudgetItemCard } from "./card";
import { BudgetItem } from "@/types/budget";
import { useShowAccruals } from "@/layout/app-config-store";

type ItemGroupLabels = ["Fixed" | "Variable", "Expenses" | "Revenues"]

const useShowClearedItems = () => {
  return useBudgetDashboardStore((s) => s.clearedItemVisibilityToggle)
}

const groupLabelClassName = [
  "from-accent/70",
  "dark:from-accent/90",
  "to-accent/40",
  "dark:to-accent/66",
  "shadow-md",
  "text-base-content",
  "dark:text-accent-content",
  "flex",
  "gap-2",
  "px-4",
  "py-2",
  "rounded",
  "text-xl",
  "tracking-wide",
  "bg-gradient-to-r"
].join(" ")

const accrualItemFilter = (props: { item: BudgetItem, showAccruals: boolean }) => {
  const { item, showAccruals } = props
  const { isAccrual, isMature, isCleared } = item

  if (!isAccrual) {
    return true
  } else {
    return (showAccruals || isMature || isCleared)
  }
}

const clearedItemFilter = (props: { item: BudgetItem, showClearedItems: boolean }) => {
  const { item, showClearedItems } = props

  return item.isPending || showClearedItems
}

const FilteredItemsDetail = (props: { items: Array<BudgetItem>; label: string; }) => {
  if (!props.items.length) {
    return null
  } else {
    const description = [
      props.items.length,
      "non-visible",
      props.label,
      props.items.length === 1 ? "item" : "items"
    ].join(" ")

    return (
      <div className="flex text-sm items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-secondary"></div>
        <div>
          {description}
        </div>
      </div>
    )
  }
}

const ItemGroup = (props: { labels: ItemGroupLabels; items: Array<BudgetItem> }) => {
  const [expenseOrRevenue, fixedOrVariable] = props.labels
  const showClearedItems = useShowClearedItems()
  const showAccruals = useShowAccruals()

  const items = props.items.filter((item) => {
    return accrualItemFilter({ item, showAccruals }) &&
      clearedItemFilter({ item, showClearedItems })
  })

  const nonVisibleAccrualItems = props.items.filter((item) => {
    return !accrualItemFilter({ item, showAccruals }) || !clearedItemFilter({ item, showClearedItems })
  })

  return (
    <div className="grid gap-2 border-b border-primary/75 pb-4 py-1">
      <div className={groupLabelClassName}>
        <div>
          {expenseOrRevenue}
        </div>
        <div>
          {fixedOrVariable}
        </div>
      </div>
      <FilteredItemsDetail label="accrual" items={nonVisibleAccrualItems} />
      {items.map((item) => (
        <BudgetItemCard key={item.objectKey} item={item} />
      ))}
    </div>
  )
}

const FixedExpenses = () => {
  const group = useBudgetItemGroups({ type: "expense", frequency: "fixed" })

  if (!group.visible) return

  return (
    <ItemGroup labels={group.labels} items={group.items} />
  )
}

const FixedRevenues = () => {
  const group = useBudgetItemGroups({ type: "revenue", frequency: "fixed" })

  if (!group.visible) return

  return (
    <ItemGroup labels={group.labels} items={group.items} />
  )
}

const VariableExpenses = () => {
  const group = useBudgetItemGroups({ type: "expense", frequency: "variable" })

  if (!group.visible) return

  return (
    <ItemGroup labels={group.labels} items={group.items} />
  )
}

const VariableRevenues = () => {
  const group = useBudgetItemGroups({ type: "revenue", frequency: "variable" })

  if (!group.visible) return

  return (
    <ItemGroup labels={group.labels} items={group.items} />
  )
}

const ItemsContainer = () => {
  return (
    <div className="grid gap-6">
      <FixedRevenues />
      <FixedExpenses />
      <VariableRevenues />
      <VariableExpenses />
    </div>
  )
}

export { ItemsContainer }
