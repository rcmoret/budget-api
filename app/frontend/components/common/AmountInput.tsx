import { decimalToInt, moneyFormatter } from "@/lib/MoneyFormatter";
import { forwardRef } from "react";

const warningOutlineClasses = {
  outlineColor: "outline-red-300",
  outline: "outline",
  classes: [
    "p-1",
    "w-full",
    "outline-2",
    "focus:outline-red-300",
    "focus-visible:outline-red-300",
    "focus-visible:outline-1",
    "focus:outline-1",
  ],
};

const defaultOutlineClasses = {
  outlineColor: "outline-gray-400",
  outline: "outline",
  classes: [
    "p-1",
    "w-full",
    "outline-1",
    "focus:outline-chartreuse-300",
    "focus:outline-2",
    "focus-visible:outline-chartreuse-300",
    "focus-visible:outline-2",
  ],
};

const handleInputIncrement = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const target = event.target as HTMLInputElement;
  if (!target.classList.contains("numericInput")) {
    return null;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const currentValue = inputAmount({ display: target.value || "" });
    const increment = event.shiftKey ? 1 : 100;
    // const increment = event.key === "ArrowUp" ? 1.0 : -1.0;
    const newValue =
      event.key === "ArrowUp"
        ? currentValue.cents + increment
        : currentValue.cents - increment;
    target.value = inputAmount({ cents: newValue }).display;
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
};

type AmountInputProps = {
  amount: TInputAmount;
  borderColor?: string;
  classes?: Array<string>;
  disabled?: boolean;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  name: string;
  onChange: (a: string) => void;
  style?: {
    height?: string;
    width?: string;
  };
  tabindex?: number;
  textAlign?: "left" | "right";
};

const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (props, ref) => {
    const defaultProps = {
      textAlign: "right",
      outlineColor: "outline-gray-300",
      outline: "outline",
    };
    const { amount, textAlign, disabled, outline, outlineColor, name } = {
      ...defaultProps,
      ...props,
    };
    const style = props.style || {};
    const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) => {
      props.onChange(ev.target.value);
    };

    const classes = props.classes || [];
    const className = [
      "rounded",
      outline,
      outlineColor,
      `text-${textAlign}`,
      "border-none",
      "focus:border-none",
      "focus:border-none",
      ...classes,
    ].join(" ");

    const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
      handleInputIncrement(ev);
      if (props.handleKeyDown) {
        props.handleKeyDown(ev);
      }
    };

    return (
      <input
        ref={ref}
        name={name}
        step="1.0"
        tabIndex={props.tabindex}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={amount.display}
        style={style}
        className={className}
        disabled={!!disabled}
      />
    );
  },
);

type InputAmountProps = {
  decimal?: string | number;
  cents?: number;
  display?: string;
};

export type TInputAmount = {
  cents?: number;
  display?: string;
};

type TInputAmountReturn = {
  cents: number;
  display: string;
};

const inputAmount = (props: InputAmountProps): TInputAmountReturn => {
  const { cents, display } = props;

  if (display === "" || !!display) {
    return {
      cents: decimalToInt(display),
      display: display,
    };
  } else {
    const amount = cents || 0;

    return {
      cents: amount,
      display: moneyFormatter(amount),
    };
  }
};

export {
  AmountInput,
  defaultOutlineClasses,
  inputAmount,
  warningOutlineClasses,
};
