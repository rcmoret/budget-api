import { useState } from "react";
import { SelectBudgetCategory } from "@/types/budget"
import { SubmitButton, Button } from "@/components/common/Button";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { inputAmount, AmountInput } from "@/components/common/AmountInput";
import { useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";
import { Icon } from "@/components/common/Icon";
import Select from "react-select";
import { DraftItem } from "@/pages/budget/dashboard";

const CategorySelect = (props: {
  categories: Array<SelectBudgetCategory>;
}) => {
  const { form } = useBudgetDashboardContext()
  const [selectedKey, setSelectedKey] = useState<string>("")

  const categories = props.categories.sort((c1, c2) => c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1)
  const options = categories.map((category) => {
    return { label: category.name, value: category.key }
  })
  const value = options.find((option) => option.value === selectedKey) || { label: "", value: "" }
  const addChange = () => {
    if (!selectedKey) { return }
    form.addChange({
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

const NewItem = (props: { item: DraftItem }) => {
  const { item } = props
  const { form } = useBudgetDashboardContext()

  const onChange = (amount: string) => {
    form.updateChange(item.key, amount)
  }

  const change = form.changes.find((c) => {
    return c.budgetItemKey === item.key
  })

  const amount = change?.amount || inputAmount({ display: "" })
  const removeChange = () => form.removeChange(item.key)

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
        {form.changes.length === 1 && <NewItemSubmitButton
          item={item}
          onSubmit={form.post}
          processing={form.processing}
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

const NewItems = (props: { items: DraftItem[] }) => {
  const { items } = props

  if (!items.length) { return null }

  return (
    <div className="w-full flex flex-col gap-2 px-2 mb-4">
      <div className="underline">New Items</div>
      {items.map((item) => (
        <NewItem key={item.key} item={item} />
      ))}
    </div>
  )
}

export { CategorySelect, NewItems }
