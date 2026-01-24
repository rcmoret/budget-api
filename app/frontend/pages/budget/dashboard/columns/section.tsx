import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { PendingMonthItem } from "@/pages/budget/dashboard/items/pending-monthly";
import { DayToDayItem } from "@/pages/budget/dashboard/items/day-to-day";
import { ClearedMonthItem } from "@/pages/budget/dashboard/items/cleared-monthly";

import { useAppConfigContext } from "@/components/layout/Provider";
import { TItemCollection, useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";
import { BudgetDashboardItemProvider } from "@/pages/budget/dashboard/items/context_provider";

const PendingMonthlyItemsSection = (props: { itemData: TItemCollection; title: string, }) => {
  const { title, itemData } = props

  if (!itemData.count) {
    return null
  } else {
    return (
      <Section title={title}>
        <HiddenCount accruals={itemData.hidden.accruals} deleted={itemData.hidden.deleted} />
        {itemData.items.map((item, index) => (
          <BudgetDashboardItemProvider key={item.key} item={item} index={index}>
            <PendingMonthItem key={item.key} />
          </BudgetDashboardItemProvider>
        ))}
      </Section>
    )
  }
}

const HiddenItem = ({ name, count }: { name: string, count: number }) => {
  if (!count) { return }

  const notice = `${count} non-visible ${name} item${count > 1 ? "s" : ""}`
  return (
    <div>
      <Point>{notice}</Point>
    </div>
  )
}

const HiddenCount = ({ accruals, deleted }: { accruals: number, deleted: number }) => {
  if (!accruals && !deleted) {
    return null
  }

  return (
    <div className="w-full my-4 text-xs italic text-gray-800">
      <HiddenItem name="accrual" count={accruals} />
      <HiddenItem name="deleted" count={deleted} />
    </div>
  )
}
const ClearedMonthlyItemsSection = (props: {
  title: string;
  itemData: TItemCollection;
}) => {
  const { itemData, title } = props

  if (!itemData.count) {
    return null
  }

  return (
    <Section title={title}>
      <HiddenCount accruals={itemData.hidden.accruals} deleted={itemData.hidden.deleted} />
      {itemData.items.map((item, index) => (
        <BudgetDashboardItemProvider key={`${item.key}.${index}`} item={item} index={index}>
          <ClearedMonthItem key={item.key} />
        </BudgetDashboardItemProvider>
      ))}
    </Section>
  )
}

type DayToDayItemsSectionProps = {
  title: string;
  itemData: TItemCollection;
}

const DayToDayItemsSection = (props: DayToDayItemsSectionProps) => {
  const { title, itemData } = props

  if (!itemData.count) {
    return null
  }

  return (
    <Section title={title}>
      <HiddenCount
        accruals={itemData.hidden.accruals}
        deleted={itemData.hidden.deleted}
      />
      {itemData.items.map((item, index) => {
        return (
          <BudgetDashboardItemProvider key={item.key} item={item} index={index}>
            <DayToDayItem key={item.key} />
          </BudgetDashboardItemProvider>
        )
      })}
    </Section>
  )
}

const ClearedMonthlyItemsSections = () => {
  const { appConfig } = useAppConfigContext()
  const { itemCollections } = useBudgetDashboardContext()

  if (!appConfig.budget.showClearedMonthly) {
    return null
  }

  return (
    <>
      <div className="w-full h-0.5 my-2 px-4">
        <div className="bg-gray-300 h-full w-full"></div>
      </div>
      <Row styling={{ flexWrap: "flex-wrap" }}>
        <div className="w-full text-2xl p-2">Cleared Monthly Items</div>
        <ClearedMonthlyItemsSection
          title="Revenues"
          itemData={itemCollections.monthly.cleared.revenues}
        />
        <ClearedMonthlyItemsSection
          title="Expenses"
          itemData={itemCollections.monthly.cleared.expenses}
        />
      </Row>
    </>
  )
}

const Section = (props: { title: string; children: React.ReactNode }) => (
  <Row
    styling={{
      flexWrap: "flex-wrap",
      padding: "px-2"
    }}
  >
    <Row
      styling={{
        backgroundColor: "bg-gradient-to-l from-chartreuse-200 to-green-100",
        margin: "mb-1",
        fontWeight: "font-semibold",
        fontSize: "text-xl",
        rounded: "rounded",
        overflow: "overflow-hidden",
        padding: "p-2",
      }}
    >
      <Point>
        <span className="underline">{props.title}</span>
      </Point>
    </Row>
    {props.children}
  </Row>
);


export {
  ClearedMonthlyItemsSections,
  DayToDayItemsSection,
  PendingMonthlyItemsSection,
  Section
};
