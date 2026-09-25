import React from "react";
import { Icon } from "@/components/icon";
import { useAdjustmentInputsContext } from "./context-provider";

// Explicit input prop list: (non-exhaustive)
// type AppTextInputProps = {
//   id: string;
//   name?: string;
//   value?: string;
//   defaultValue?: string;
//   placeholder?: string;
//   disabled?: boolean;
//   required?: boolean;
//   readOnly?: boolean;
//   autoComplete?: string;
//   autoFocus?: boolean;
//   maxLength?: number;
//   minLength?: number;
//   pattern?: string;
//   onChange?: React.ChangeEventHandler<HTMLInputElement>;
//   onBlur?: React.FocusEventHandler<HTMLInputElement>;
//   onFocus?: React.FocusEventHandler<HTMLInputElement>;
//   onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
//   className?: string;
//   'aria-label'?: string;
//   'aria-labelledby'?: string;
//   'aria-describedby'?: string;
//   'aria-invalid'?: boolean | 'true' | 'false';
//   'aria-required'?: boolean | 'true' | 'false';
// };

type GenericAmountInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  id: string;
  classes?: Array<string>;
};

const amountInputClasses = [
  "text-right",
  "input",
  "input-xs",
  "input-secondary",
];

// iOS's decimal pad has no minus key, so a typed "-" is unreachable there.
// Keep inputMode="decimal" for the numeric keypad and let this button toggle
// the sign instead.
const toggleAmountSign = (value: string): string => {
  const trimmed = value.trim();

  if (trimmed.startsWith("-")) return trimmed.slice(1);
  if (trimmed === "") return "-";

  return `-${trimmed}`;
};

const GenericAmountInput = (props: GenericAmountInputProps) => {
  const { classes = [], value, onChange, ...rest } = props;
  const className = [...classes, ...amountInputClasses].join(" ");

  const toggleSign = () => {
    if (!onChange) return;

    const newValue = toggleAmountSign(typeof value === "string" ? value : "");
    onChange({
      target: { value: newValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="grid col-span-full grid-cols-[auto_1fr]">
      <div>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-square"
          onClick={toggleSign}
          aria-label="Toggle positive or negative"
        >
          &#8722;
        </button>
      </div>
      <div>
        <input
          className={className}
          placeholder="-0.00"
          type="text"
          inputMode="decimal"
          pattern="[0-9.,-]*"
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
    </div>
  );
};

const AdjustmentInput = (props: { name?: string }) => {
  const { adjustment, adjustmentInputId, updateItemByAdjustment } =
    useAdjustmentInputsContext();

  const updateAdjustment = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateItemByAdjustment(ev.target.value);
  };

  return (
    <GenericAmountInput
      id={adjustmentInputId}
      onChange={updateAdjustment}
      name={props.name}
      value={adjustment.adjustmentAmount.display}
    />
  );
};

const TotalInput = () => {
  const { adjustment, updateItemByTotal, totalInputId } =
    useAdjustmentInputsContext();
  const updateTotal = (ev: React.ChangeEvent<HTMLInputElement>) =>
    updateItemByTotal(ev.target.value);

  return (
    <GenericAmountInput
      id={totalInputId}
      onChange={updateTotal}
      classes={["w-full"]}
      value={adjustment.newTotal.display}
    />
  );
};

export { AdjustmentInput, GenericAmountInput, TotalInput };
