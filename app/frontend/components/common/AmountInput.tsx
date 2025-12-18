import { decimalToInt, moneyFormatter } from "@/lib/MoneyFormatter";
import { forwardRef } from "react";

const handleInputKeyDown = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement;
  if (!target.classList.contains("numericInput")) { return null }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const currentValue = parseFloat(target.value) || 0;
    const increment = event.shiftKey ? 0.1 : 1.0
    // const increment = event.key === "ArrowUp" ? 1.0 : -1.0;
    const newValue = event.key === "ArrowUp" ?
      (currentValue + increment) :
      (currentValue - increment)
    target.value = newValue.toString();
    // Trigger input event so React/other listeners see the change
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

type AmountInputProps = {
  name: string;
  amount: TInputAmount;
  onChange: (a: string) => void;
  disabled?: boolean;
  style?: {
    height?: string;
    width?: string;
  }
  classes?: Array<string>;
  textAlign?: "left" | "right"
  borderColor?: string;
}

const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>((props, ref) => {
  const defaultProps = {
   textAlign: "right",
   outlineColor: "outline-gray-300",
   outline: "outline"
  }
  const { 
    amount,
    textAlign,
    disabled,
    outline,
    outlineColor,
    name
  } = { ...defaultProps, ...props }
  const style = props.style || {}
  const onChange = (
    ev: React.ChangeEvent & { target: HTMLInputElement },
  ) => {
    props.onChange(ev.target.value)
  }

  const classes = props.classes || []
  const className = [
    "rounded",
    outline,
    outlineColor,
    `text-${textAlign}`,
    "border-none",
    "focus:border-none",
    "focus:border-none",
    ...classes
  ].join(" ")

  return (
    <input
      ref={ref}
      name={name}
      step="1.0"
      onChange={onChange}
      onKeyDown={handleInputKeyDown}
      value={amount.display}
      style={style}
      className={className}
      disabled={!!disabled}
    />
  )
})

type InputAmountProps = {
  decimal?: string | number;
  cents?: number;
  display?: string;
}

export type TInputAmount = {
  cents?: number;
  display?: string;
}

type TInputAmountReturn = {
  cents: number;
  display: string;
}

const inputAmount = (props: InputAmountProps): TInputAmountReturn => {
  const { cents, display } = props

  if (display === "" || !!display) {
    return {
      cents: decimalToInt(display),
      display: display
    }
  } else {
    const amount = cents || 0

    return {
      cents: amount,
      display: moneyFormatter(amount)
    }
  }
}

export { AmountInput, inputAmount }
