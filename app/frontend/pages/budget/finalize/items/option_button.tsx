import { useItem } from "./context_provider";
import { inputAmount } from "@/components/common/AmountInput";

const SelectionMarker = (props: { isSelected: boolean }) => {
  if (props.isSelected) {
    return (
      <div className="text-xl text-chartreuse-700">
        &#9679;
      </div>
    )
  } else {
    return (
      <div>&#9675;</div>
    )
  }
}

type OptionButtonProps = {
  isSelected: boolean;
  children: React.ReactNode;
  type: "button";
  onClick: () => void;
}

type OptionIndicatorProps = {
  isSelected: boolean;
  children: React.ReactNode;
  type: "div";
}

const SelectAllOption = (props: { amountInputRef: React.RefObject<HTMLInputElement> }) => {
  const { item, setRolloverAmountForItem } = useItem()

  const rolloverAll = () => {
    setRolloverAmountForItem((inputAmount({ cents: item.remaining }).display))
    props.amountInputRef.current?.focus()
  }
  const rolloverAllSelected = item.rolloverAmount.cents === item.remaining

  return (
    <div>
      <OptionButton isSelected={rolloverAllSelected} onClick={rolloverAll} type="button">
        <div>
          Rollover All
        </div>
        <SelectionMarker isSelected={rolloverAllSelected} />
      </OptionButton>
    </div>
  )
}

const SelectNoneOption = (props: { amountInputRef: React.RefObject<HTMLInputElement> }) => {
  const { setRolloverNoneForItem } = useItem()
  const { item } = useItem()
  const { rolloverAmount } = item

  const rolloverNoneSelected = !rolloverAmount.cents && !!rolloverAmount.display

  const onClick = () => {
    setRolloverNoneForItem()
    props.amountInputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <OptionButton isSelected={rolloverNoneSelected} onClick={onClick} type="button">
        <div>
          Rollover None
        </div>
        <SelectionMarker isSelected={rolloverNoneSelected} />
      </OptionButton>
    </div>
  )
}

const SelectSomeIndicator = () => {
  const { item } = useItem()
  const { rolloverAmount } = item

  const rolloverNoneSelected = !rolloverAmount.cents && !!rolloverAmount.display
  const rolloverAllSelected = item.rolloverAmount.cents === item.remaining
  const rolloverSomeSelected = !rolloverNoneSelected && !rolloverAllSelected && !!rolloverAmount.display

  return (
    <div>
      <OptionButton isSelected={rolloverSomeSelected} type="div">
        <div>
          Rollover Partial
        </div>
        <SelectionMarker isSelected={rolloverSomeSelected} />
      </OptionButton>
    </div>
  )
}
const OptionButton = (props: OptionButtonProps | OptionIndicatorProps) => {
  const { children, isSelected } = props
  const isButton = "onClick" in props

  const sharedClasses = [
    "rounded",
    "w-full",
    "flex",
    "flex-row",
    "justify-between",
    "items-center",
    "outline",
    "px-4",
    "h-12",
  ]

  const selectedClasses = [
    "bg-chartreuse-50",
    "hover:bg-chartreuse-50",
    "font-semibold",
    "text-gray-700",
    "py-1",
    "outline-2",
    "outline-chartreuse-300"
  ]

  const unselectedClasses = [
    "text-gray-600",
    "py-2",
    "outline-1",
    "outline-gray-200",
    ...(isButton ? [
      "hover:outline-chartreuse-300",
      "hover:text-chartreuse-600",
      "hover:outline-2"
      // "hover:bg-gray-0"
    ] : []),
  ]

  const buttonClasses = [
    ...sharedClasses,
    ...(isSelected ? selectedClasses : unselectedClasses),
  ]

  const buttonClassName = buttonClasses.reduce((acc, string) => {
    if (!!string) {
      return `${acc} ${string}`
    } else {
      return acc
    }
  })

  if ("onClick" in props) {
    return (
      <button className={buttonClassName} type="button" onClick={props.onClick}>
        {children}
      </button>
    )
  } else {
    return (
      <div className={buttonClasses.join(" ")}>
        {children}
      </div>
    )
  }
}

export { OptionButton, SelectAllOption, SelectNoneOption, SelectSomeIndicator }
