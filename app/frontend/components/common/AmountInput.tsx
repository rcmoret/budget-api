import { decimalToInt, moneyFormatter } from "@/lib/MoneyFormatter";

type AmountInputProps = {
  name: string;
  amount: TInputAmount;
  onChange: (a: string) => void;
  disabled?: boolean;
  style?: {
    width?: string;
  }
  classes?: Array<string>;
  textAlign?: "left" | "right"
}

const AmountInput = (props: AmountInputProps) => {
  const { 
    amount,
    textAlign,
    disabled,
    name
  } = { textAlign: "right", ...props }
  const style = props.style || {}
  const onChange = (
    ev: React.ChangeEvent & { target: HTMLInputElement },
  ) => {
    props.onChange(ev.target.value)
  }

  const classes = props.classes || []
  const className = [`rounded text-${textAlign}`, ...classes].join(" ")

  return (
    <input
      name={name}
      onChange={onChange}
      value={amount.display}
      style={style}
      className={className}
      disabled={!!disabled}
    />
  )
}
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
