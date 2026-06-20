import { useBudgetDashboardStore, useBudgetItemGroups as getBudgetItemGroup, FilterKeys, ItemGroup } from "@/pages/budget/dashboard/store";
import { BudgetItemCard } from "./card";
import { BudgetItem } from "@/types/budget";
import { useShowAccruals } from "@/layout/app-config-store";

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

const ItemGroupComponent = (props: { group: ItemGroup }) => {
  const { group } = props
  const [expenseOrRevenue, fixedOrVariable] = group.labels

  const showClearedItems = useShowClearedItems()
  const showAccruals = useShowAccruals()

  const items = group.items.filter((item) => {
    return accrualItemFilter({ item, showAccruals }) &&
      clearedItemFilter({ item, showClearedItems })
  })

  const nonVisibleAccrualItems = group.items.filter((item) => {
    return !accrualItemFilter({ item, showAccruals }) || !clearedItemFilter({ item, showClearedItems })
  })

  if (!group.visible || !group.items.length) return null

  return (
    <div className="flex flex-col gap-2 border-b border-primary/75 pb-4 py-1">
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

type ItemTupleType = {
  group: ItemGroup,
  key: string,
}

const ItemsContainer = () => {
  const groupMap: Array<ItemTupleType> = [
    {
      key: "fixed-revenue",
      group: getBudgetItemGroup({ type: "revenue", frequency: "fixed" })
    },
    {
      key: "fixed-expense",
      group: getBudgetItemGroup({ type: "expense", frequency: "fixed" })
    },
    {
      key: "variable-revenue",
      group: getBudgetItemGroup({ type: "revenue", frequency: "variable" })
    },
    {
      key: "variable-expense",
      group: getBudgetItemGroup({ type: "expense", frequency: "variable" })
    },
  ]

  return (
    <>
      {groupMap.map(({ key, group }) => (
        <ItemGroupComponent key={key} group={group} />
      ))}
    </>
  )
}

export { ItemsContainer }
