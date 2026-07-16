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

type AdjustmentInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "type" | "className"
> & {
  classes?: Array<string>;
};

const amountInputClasses = [
  "text-right",
  "input",
  "input-xs",
  "input-secondary",
];

const AdjustmentInput = (props: AdjustmentInputProps) => {
  const { adjustment, adjustmentInputId, updateItemByAdjustment } =
    useAdjustmentInputsContext();
  const { classes = [], ...rest } = props;
  const className = [...classes, ...amountInputClasses].join(" ");

  return (
    <input
      type="text"
      id={adjustmentInputId}
      onChange={(ev) => updateItemByAdjustment(ev.target.value)}
      value={adjustment.adjustmentAmount.display}
      className={className}
      placeholder={"0"}
      {...rest}
    />
  );
};

const TotalInput = (props: AdjustmentInputProps) => {
  const { adjustment, updateItemByTotal, totalInputId } =
    useAdjustmentInputsContext();
  const { classes = [], ...rest } = props;
  const className = [...classes, ...amountInputClasses].join(" ");

  return (
    <input
      type="text"
      id={totalInputId}
      onChange={(ev) => updateItemByTotal(ev.target.value)}
      value={adjustment.newTotal.display}
      className={className}
      {...rest}
    />
  );
};

export { useAdjustmentInputsContext, AdjustmentInput, TotalInput };
