import { useState } from "react"
import { decimalToInt, moneyFormatter } from "@/lib/MoneyFormatter";
import { TInputAmount } from "@/components/common/AmountInput";

type InputAmountProps = {
  cents?: number;
  display?: string;
  defaultToNegative?: boolean;
}

const defaultProps = {
  display: ""
}

const useInputAmount = (props: InputAmountProps = defaultProps) => {
  const defaultToNegative = !!props.defaultToNegative

  const { display, cents } = props

  const emptyString = defaultToNegative ? "-" : ""

  const tuple = (display === "" || !!display) ?
    { cents: decimalToInt(display), display: display } :
    { cents: cents || 0, display: moneyFormatter(cents || 0) }

  const [ object, setObject ] = useState<TInputAmount>(tuple)

  const setCents = (cents: number) => {
    if (!cents) {
      setObject({
        ...object,
        cents,
        display: `${emptyString}0`
      })
    } else {
      setObject({
        ...object,
        cents,
        display: moneyFormatter(cents)
      })
    }
  }

  const setAmount = (amount: string) => {
    if (amount === "") {
      setObject({
        ...object,
        cents: 0,
        display: emptyString
      })
    } else {
      setObject({
        ...object,
        cents: decimalToInt(amount),
        display: amount
      })
    }
  }

  return {
    cents: object.cents,
    display: object.display,
    setAmount,
    setCents,
  }
}

export { useInputAmount }
