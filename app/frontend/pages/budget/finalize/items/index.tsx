import { AmountInput } from "@/components/common/AmountInput";
import { AmountSpan } from "@/components/common/AmountSpan";
import { useCategory } from "@/pages/budget/finalize/categories/context_provider";
import { FinalizeCategoryFormItem } from "@/lib/hooks/useFinalizeEventsForm";
import Select, { SingleValue } from "react-select";
import { ItemProvider, useItem } from "./context_provider";
import { ReactNode, useRef } from "react";
import { SelectSomeIndicator, SelectNoneOption, SelectAllOption } from "./option_button";
import { i18n } from "@/lib/i18n"
import { useFinalizeFormContext } from "../form_context";
import { KeySpan as MainKeySpan } from "@/components/common/KeySpan";

const KeySpan = () => {
  const { anchorId, item } = useItem()

  if (item.needsReview) {
    return <MainKeySpan id={anchorId} _key={item.key} />
  } else {
    return null
  }
}

type SelectOption = {
  label: string;
  value: string;
}

const JumpToBottomLink = () => {
  const { index } = useItem()
  const { category } = useCategory()
  const { allItemsReviewed } = useFinalizeFormContext()

  if (!allItemsReviewed || (index + 1) !== category.items.length) {
    return null
  } else {
    return (
      <div>
        <a href="#finalize-summary">go to summary &#8595;</a>
      </div>
    )
  }
}

const ItemAmountForm = (props: { amountInputRef: React.RefObject<HTMLInputElement> }) => {
  const {  item, setRolloverAmountForItem } = useItem()
  const { remaining, appliedToExtra, showWarning } = item

  const warningOutlineClasses = {
    outlineColor: "outline-red-300",
    outline: "outline",
    classes: ["p-1", "w-full", "outline-2", "focus:outline-red-300", "focus-visible:outline-red-300", "focus-visible:outline-2", "focus:outline-2"]
  }

  const onChange = setRolloverAmountForItem

  const outlineClasses = {
    outlineColor: "outline-gray-400",
    outline: "outline",
    classes: ["p-1", "w-full", "outline-1", "focus:outline-chartreuse-300", "focus:outline-2", "focus-visible:outline-chartreuse-300", "focus-visible:outline-1"]
  }

  const inputProps = showWarning ? warningOutlineClasses : outlineClasses

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        Remaining: <AmountSpan amount={remaining} />
      </div>
      <div className="w-full flex flex-row justify-between">
        Applied to extra: <AmountSpan amount={appliedToExtra} />
      </div>
      <div>
        <AmountInput
          ref={props.amountInputRef}
          name={`item-${item.key}`}
          amount={item.rolloverAmount}
          onChange={onChange}
          {...inputProps}
        />
      </div>
    </div>
  )
}

const EventSelect = () => {
  const { item, setItemEventKey } = useItem()
  const { category } = useCategory()
  const { events } = category

  if (events.length === 1) { return }

  const options: SelectOption[] = events
    .map((event) => ({
      label: i18n.t("events", event.eventType, { key: event.key }),
      value: event.key
    }))

  const selectedOption = options.find((option) => option.value === item.eventKey) || null

  const handleEventSelectChange = (option: SingleValue<SelectOption>) => {
    if (!option?.value) { return }

    setItemEventKey(option.value)
  }

  return (
    <div className="max-w-96">
      <Select
        value={selectedOption}
        onChange={handleEventSelectChange}
        options={options}
      />
    </div>
  )
}

const ItemCard = (props: { item: FinalizeCategoryFormItem; index: number; children?: ReactNode }) => {
  const { setItemEventKey, setRolloverAmountForItem, setRolloverNoneForItem } = useCategory()
  const { item } = props
  const amountInputRef = useRef<HTMLInputElement>(null)
  const bgColor = item.needsReview ? "bg-sky-50" : "bg-gray-50"
  const borderColor = item.needsReview ? "border-sky-100" : "border-gray-300"

  return (
    <ItemProvider
      index={props.index}
      item={item}
      setItemEventKey={setItemEventKey}
      setRolloverAmountForItem={setRolloverAmountForItem}
      setRolloverNoneForItem={setRolloverNoneForItem}
    >
      <KeySpan />
      <div className={`flex flex-col gap-2 border ${borderColor} rounded p-4 mb-2 shadow-lg ${bgColor}`}>
        <div className="flex flex-row mb-4 justify-between">
          <div className="flex flex-col gap-2 w-1/2 pr-4 justify-between">
            <ItemAmountForm amountInputRef={amountInputRef} />
            <EventSelect />
            <JumpToBottomLink />
          </div>
          <div className="flex flex-col gap-2 border-gray-100 border-l pl-4 w-1/2">
            <SelectAllOption amountInputRef={amountInputRef} />
            <SelectNoneOption amountInputRef={amountInputRef} />
            <SelectSomeIndicator />
          </div>
        </div>
      </div>
    </ItemProvider>
  )
}

export { ItemCard }
