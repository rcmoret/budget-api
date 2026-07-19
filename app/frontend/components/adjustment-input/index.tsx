import React from "react";
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

const GenericAmountInput = (props: GenericAmountInputProps) => {
  const { classes = [], ...rest } = props;
  const className = [...classes, ...amountInputClasses].join(" ");

  return (
    <input
      className={className}
      placeholder={rest.placeholder || "0.00"}
      type="text"
      {...rest}
    />
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
      value={adjustment.newTotal.display}
    />
  );
};

export { AdjustmentInput, GenericAmountInput, TotalInput };
