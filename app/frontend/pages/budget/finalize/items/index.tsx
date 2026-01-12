import { AmountInput, warningOutlineClasses, defaultOutlineClasses as outlineClasses } from "@/components/common/AmountInput";
import { AmountSpan } from "@/components/common/AmountSpan";
import { useCategory } from "@/pages/budget/finalize/categories/context_provider";
import { FinalizeCategoryFormItem } from "@/lib/hooks/useFinalizeEventsForm";
import Select, { SingleValue } from "react-select";
import { ItemProvider, useItem } from "./context_provider";
import { ReactNode, useRef } from "react";
import { SelectSomeIndicator, SelectNoneOption, SelectAllOption } from "./option_button";
import { i18n } from "@/lib/i18n"
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

const ItemAmountForm = (props: { amountInputRef: React.RefObject<HTMLInputElement> }) => {
  const {  item, setRolloverAmountForItem } = useItem()
  const { remaining, appliedToExtra, showWarning } = item

  const onChange = setRolloverAmountForItem

  const inputProps = showWarning ? warningOutlineClasses : outlineClasses

  // Ref callback to sync both refs
  const refCallback = (element: HTMLInputElement | null) => {
    // Update the local ref
    if (props.amountInputRef) {
      (props.amountInputRef as React.MutableRefObject<HTMLInputElement | null>).current = element
    }
    // Update the item's ref so it can be accessed from context
    if (item.amountInputRef) {
      item.amountInputRef.current = element
    }
  }

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
          ref={refCallback}
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

const ItemCard = (props: { item: FinalizeCategoryFormItem; index: number; budgetCategoryKey: string; children?: ReactNode }) => {
  const { setItemEventKey, setRolloverAmountForItem, setRolloverNoneForItem } = useCategory()
  const { item } = props
  const amountInputRef = useRef<HTMLInputElement>(null)

  const bgColor = item.needsReview ? "bg-sky-50" : "bg-gray-50"
  const borderColor = item.needsReview ? "border-sky-100" : "border-gray-300"

  return (
    <ItemProvider
      budgetCategoryKey={props.budgetCategoryKey}
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
