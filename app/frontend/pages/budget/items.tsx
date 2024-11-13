import React, { useContext } from "react";

import { Cell } from "@/components/common/Cell";
import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { Discretionary } from "@/pages/budget/discretionary";
import { DiscretionaryData } from "@/types/budget";
import { ClearedMonthItem, DayToDayItem, PendingMonthItem } from "./item_components";
import { ItemCollection } from "@/pages/budget";

import { AppConfigContext } from "@/components/layout/Provider";

type ItemsProps = {
  data: DiscretionaryData;
  clearedMonthlyExpenseItems: ItemCollection;
  clearedMonthlyRevenueItems: ItemCollection;
  dayToDayExpenseItems: ItemCollection;
  dayToDayRevenueItems: ItemCollection;
  pendingMonthlyExpenseItems: ItemCollection;
  pendingMonthlyRevenueItems: ItemCollection;
}

const PendingMonthlyItemsSection = ({ title, items }: { title: string, items: ItemCollection }) => {
  const { collection, hidden } = items

  if (!collection.length) {
    return null
  } else {
    return (
      <Section title={title}>
        <HiddenCount {...hidden} />
        {collection.map((item) => <PendingMonthItem key={item.key} item={item} />)}
      </Section>
    )
  }
}

const HiddenCount = (props: { accruals: number, deleted: number }) => {
  const { accruals, deleted } = props

  const HiddenItem = ({ name, count }: { name: string, count: number }) => {
    if (!count) { return }

    const notice = `${count} non-visible ${name} item${count > 1 ? "s" : ""}`
    return (
      <p>
        <Point>{notice}</Point>
      </p>
    )
  }

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
const ClearedMonthlyItemsSection = (props: { title: string, items: ItemCollection }) => {
  const { items, title } = props
  const { collection, hidden } = items

  if (!collection.length) {
    return null
  }
  return (
    <Section title={title}>
      <HiddenCount {...hidden} />
      {collection.map((item) => {
        return (
          <ClearedMonthItem key={item.key} item={item} />
        )
      })}
    </Section>
  )
}
const DayToDayItemsSection = ({ title, items }: { title: string, items: ItemCollection }) => {
  const { collection, hidden } = items

  if (!collection.length) {
    return null
  }

  return (
    <Section title={title}>
      <HiddenCount {...hidden} />
      {collection.map((item) => {
        return <DayToDayItem key={item.key} item={item} />
      })}
    </Section>
  )
}
const ClearedMonthlyItemsSections = ({ clearedMonthlyExpenseItems, clearedMonthlyRevenueItems }: {
  clearedMonthlyExpenseItems: ItemCollection,
  clearedMonthlyRevenueItems: ItemCollection
}) => {
  const { appConfig } = useContext(AppConfigContext);

  if (!appConfig.budget.showClearedMonthly) {
    return null
  }

  return (
    <Row styling={{ flexWrap: "flex-wrap" }}>
      <div className="w-full text-2xl p-2">Cleared Monthly Items</div>
      <ClearedMonthlyItemsSection title="Revenues" items={clearedMonthlyRevenueItems} />
      <ClearedMonthlyItemsSection title="Expenses" items={clearedMonthlyExpenseItems} />
    </Row>
  )
}

const Items = (props: ItemsProps) =>  {
  return (
    <>
      <Column title="Day-to-Day">
        <Section title="Discretionary">
          <Discretionary data={props.data} />
        </Section>
        <DayToDayItemsSection title="Revenues" items={props.dayToDayRevenueItems} />
        <DayToDayItemsSection title="Expenses" items={props.dayToDayExpenseItems} />
      </Column>
      <Column title="Monthly">
        <PendingMonthlyItemsSection title="Revenues" items={props.pendingMonthlyRevenueItems} />
        <PendingMonthlyItemsSection title="Expenses" items={props.pendingMonthlyExpenseItems} />
        <ClearedMonthlyItemsSections
          clearedMonthlyExpenseItems={props.clearedMonthlyExpenseItems}
          clearedMonthlyRevenueItems={props.clearedMonthlyRevenueItems}
        />
      </Column>
    </>
  )
};

interface ColumnProps {
  title: string;
  children: React.ReactNode;
}

const Column = (props: ColumnProps) => (
  <Cell
    styling={{
      width: "w-full md:w-1/2",
      padding: "px-2",
    }}
  >
    <div className="w-full text-2xl p-2">{props.title}</div>
    {props.children}
  </Cell>
);

const Section = (props: { title: string; children: React.ReactNode }) => (
  <Row
    styling={{
      flexWrap: "flex-wrap",
    }}
  >
    <Row
      styling={{
        backgroundColor: "bg-gradient-to-r from-green-300 to-green-600",
        margin: "mb-1",
        fontWeight: "font-semibold",
        fontSize: "text-xl",
        rounded: "rounded",
        overflow: "overflow-hidden",
        padding: "pt-2 pb-2 pl-1 pr-1",
      }}
    >
      <Point>
        <span className="underline">{props.title}</span>
      </Point>
    </Row>
    {props.children}
  </Row>
);

export { Items };
