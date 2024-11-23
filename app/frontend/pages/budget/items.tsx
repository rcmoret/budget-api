import React, { useContext, useState } from "react";

import { Cell } from "@/components/common/Cell";
import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { ClearedMonthItem, DayToDayItem, PendingMonthItem } from "./item_components";
import { ItemCollection, DraftItem } from "@/pages/budget";
import { DraftChange, TChangeForm } from "@/lib/hooks/useDraftEvents";
import { SelectBudgetCategry } from "@/types/budget"

import { AppConfigContext } from "@/components/layout/Provider";
import { Icon } from "@/components/common/Icon";
import { Button, SubmitButton } from "@/components/common/Button";
import Select from "react-select";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { inputAmount, AmountInput } from "@/components/common/AmountInput";
import { useToggle } from "@/lib/hooks/useToogle";

const CategorySelect = (props: {
  categories: Array<SelectBudgetCategry>;
  addChange: (c: DraftChange) => void;
}) => {
  const [selectedKey, setSelectedKey] = useState<string>("")

  const categories = props.categories.sort((c1, c2) => c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1)
  const options = categories.map((category) => {
    return { label: category.name, value: category.key }
  })
  const value = options.find((option) => option.value === selectedKey) || { label: "", value: "" }
  const addChange = () => {
    if (!selectedKey) { return }
    props.addChange({
      budgetItemKey: generateKeyIdentifier(),
      budgetCategoryKey: selectedKey,
      amount: inputAmount({ display: "" })
    })
    setSelectedKey("")
  }

  return (
    <div className="w-full p-2 flex flex-row justify-between mb-2 border-t border-b border-gray-600">
      <div className="w-6/12">
        <Select
          options={options}
          value={value}
          onChange={(ev) => setSelectedKey(ev?.value || "")}
        />
      </div>
      <div className="text-right">
        <Button type="button" onClick={addChange}>
          <div className="text-blue-300 text-lg">
            <Icon name="plus-circle" />
          </div>
        </Button>
      </div>
    </div>
  )
}

const PendingMonthlyItemsSection = (props: {
  title: string,
  items: ItemCollection,
  form: TChangeForm;
}) => {
  const { title, items, form } = props
  const { collection, hidden } = items

  if (!collection.length) {
    return null
  } else {
    return (
      <Section title={title}>
        <HiddenCount {...hidden} />
        {collection.map((item) => <PendingMonthItem key={item.key} item={item} form={form} />)}
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
const ClearedMonthlyItemsSection = (props: {
  title: string,
  items: ItemCollection,
  form: TChangeForm;
}) => {
  const { items, title, form } = props
  const { collection, hidden } = items

  if (!collection.length) {
    return null
  }
  return (
    <Section title={title}>
      <HiddenCount {...hidden} />
      {collection.map((item) => {
        return (
          <ClearedMonthItem
            key={item.key}
            item={item}
            form={form}
          />
        )
      })}
    </Section>
  )
}

type DayToDayItemsSectionProps = {
  title: string;
  items: ItemCollection;
  form: TChangeForm;
}

const DayToDayItemsSection = (props: DayToDayItemsSectionProps) => {
  const { title, items, form } = props
  const { collection, hidden } = items

  if (!collection.length) {
    return null
  }

  return (
    <Section title={title}>
      <HiddenCount {...hidden} />
      {collection.map((item) => {
        return (
          <DayToDayItem
            key={item.key}
            item={item}
            form={form}
          />
        )
      })}
    </Section>
  )
}
const ClearedMonthlyItemsSections = (props: {
  clearedMonthlyExpenseItems: ItemCollection,
  clearedMonthlyRevenueItems: ItemCollection,
  form: TChangeForm;
}) => {
  const { clearedMonthlyExpenseItems, clearedMonthlyRevenueItems, form } = props
  const { appConfig } = useContext(AppConfigContext);

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
          items={clearedMonthlyRevenueItems}
          form={form}
        />
        <ClearedMonthlyItemsSection
          title="Expenses"
          items={clearedMonthlyExpenseItems}
          form={form}
        />
      </Row>
    </>
  )
}

const NewItemSubmitButton = (props: {
  item: DraftItem;
  onSubmit: () => void;
  processing: boolean;
}) => {
  return (
    <SubmitButton
      onSubmit={props.onSubmit}
      isEnabled={!props.processing}
      styling={{}}
    >
      <span className="text-green-600 text-lg">
        <Icon name="plus-circle" />
      </span>
    </SubmitButton>
  )
}

const NewItem = (props: {
  item: DraftItem
  updateChange: (k: string, a: string) => void;
  changes: DraftChange[];
  removeChange: (k: string) => void;
  postEvent: () => void;
  processing: boolean;
}) => {
  const { item, changes, updateChange, postEvent } = props

  const onChange = (amount: string) => {
    updateChange(item.key, amount)
  }

  const change = changes.find((c) => {
    return c.budgetItemKey === item.key
  })

  const amount = change?.amount || inputAmount({ display: "" })
  const removeChange = () => props.removeChange(item.key)

  return (
    <div className="w-full flex flex-row justify-between">
      <div>
        {item.budgetCategoryName}
      </div>
      <div className="w-6/12 text-right flex flex-row gap-2 justify-end">
        <div>
          <AmountInput
            name={`new-item-${item.key}`}
            onChange={onChange}
            amount={amount}
            classes={["border border-gray-300"]}
          />
        </div>
        {changes.length === 1 && <NewItemSubmitButton
          item={item}
          onSubmit={postEvent}
          processing={props.processing}
        />}
        <div>
          <Button
            type="button"
            onClick={removeChange}
            styling={{ color: "text-gray-600", fontSize: "text-lg" }}
            >
            <Icon name="times-circle" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const NewItems = (props: {
  items: DraftItem[]
  updateChange: (k: string, a: string) => void;
  changes: DraftChange[];
  removeChange: (k: string) => void;
  postEvent: () => void;
  processing: boolean;
}) => {
  const { items, updateChange, changes, removeChange, postEvent } = props

  if (!items.length) { return null }

  return (
    <div className="w-full flex flex-col gap-2 px-2 mb-4">
      <div className="underline">New Items</div>
      {items.map((item) => {
        return (
          <NewItem
            key={item.key}
            item={item}
            updateChange={updateChange}
            changes={changes}
            removeChange={removeChange}
            postEvent={postEvent}
            processing={props.processing}
          />
        )
      })}
    </div>
  )
}

interface ColumnProps {
  title: string;
  children: React.ReactNode;
  categories: Array<SelectBudgetCategry>;
  addChange: (c: DraftChange) => void;
  newItems: Array<DraftItem>;
  updateChange: (k: string, a: string) => void;
  changes: DraftChange[];
  removeChange: (k: string) => void;
  postEvent: () => void;
  processing: boolean;
}

const Column = (props: ColumnProps) => {
  const [isSelectShown, toggleSelect] = useToggle(false)

  return (
    <Cell
      styling={{
        width: "w-full md:w-1/2",
        padding: "px-2",
      }}
    >
      <div className="w-full p-2 flex flex-row justify-between">
        <div className="text-2xl">
          {props.title}
        </div>
        <div className="text-lg">
          <Button type="button" onClick={toggleSelect} styling={{ color: "text-blue-300"}}>
            <Icon name={isSelectShown ? "times-circle" : "plus-circle"} />
          </Button>
        </div>
      </div>
      {isSelectShown && <CategorySelect
          categories={props.categories}
          addChange={props.addChange}
        />}
      <NewItems
        items={props.newItems}
        changes={props.changes}
        updateChange={props.updateChange}
        removeChange={props.removeChange}
        postEvent={props.postEvent}
        processing={props.processing}
      />
      {props.children}
    </Cell>
  )
};

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

export {
  Column,
  ClearedMonthlyItemsSections,
  DayToDayItemsSection,
  PendingMonthlyItemsSection,
  Section
};
