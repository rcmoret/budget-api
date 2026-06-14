import { useContext, createContext } from "react";

type SelectableVariant = "base-300" | "base-300";

type SelectableGroupContextValue = {
  disabled: boolean;
  name: string;
};

const SelectableGroupContext =
  createContext<SelectableGroupContextValue | null>(null);

const SelectableGroupProvider = (props: {
  children: React.ReactNode;
  disabled?: boolean;
  name: string;
}) => {
  const { disabled = false } = props;

  const value: SelectableGroupContextValue = {
    disabled,
    name: props.name,
  };

  return (
    <SelectableGroupContext.Provider value={value}>
      {props.children}
    </SelectableGroupContext.Provider>
  );
};

const useSelectableGroupContext = () => {
  const context = useContext(SelectableGroupContext);

  if (!context) {
    throw new Error(
      "useSelectableGroupContext must be used within a SelectableGroupProvider",
    );
  }

  return context;
};

type SelectableGroupProps = {
  children: React.ReactNode;
  disabled?: boolean;
  groupLabel: string;
  name: string;
  variant?: SelectableVariant;
};

const formSelectableRowClassName = ["flex", "flex-col", "gap-2", "px-1"].join(
  " ",
);

const SelectableGroup = (props: SelectableGroupProps) => {
  const { children, groupLabel, name, disabled = false } = props;

  return (
    <div className={formSelectableRowClassName}>
      <div className="text-sm">{groupLabel}</div>
      <SelectableGroupProvider name={name} disabled={disabled}>
        {children}
      </SelectableGroupProvider>
    </div>
  );
};

const selectableItemBaseClasses = [
  "group",
  "relative",
  "flex",
  "items-center",
  "w-full",
  "bg-white",
  "justify-between",
  "gap-1",
  "p-2",
  "text-sm",
  "text-left",
  "rounded",
  "outline",
  "cursor-pointer",
];

const SelectableInputContainer = (props: {
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  type: "radio" | "checkbox";
  value: string;
}) => {
  const { checked, type } = props;
  const { disabled, name } = useSelectableGroupContext();

  const inputClassName = ["radio", "radio-sm", "radio-base-300", "relative"].join(
    " ",
  );

  const labelClassName = [
    ...selectableItemBaseClasses,
    "outline-base-300",
    "has-checked:outline-2",
    "has-checked:bg-white/100",
    "hover:outline-base-300",
    "has-disabled:outline-base-300/70",
    "has-disabled:cursor-default",
    "has-[input:checked:disabled]:bg-white/90",
    "has-disabled:bg-white/60",
  ].join(" ");

  return (
    <label className={labelClassName}>
      <span className="relative">{props.children}</span>
      <input
        name={name}
        type={type}
        className={inputClassName}
        checked={checked}
        disabled={disabled}
        onChange={props.onChange}
        value={props.value}
      />
    </label>
  );
};

// For when the situation calls for controlled radio inputs
const RadioInput = (props: {
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  value: string;
}) => {
  return <SelectableInputContainer type="radio" {...props} />;
};

// For when the situation calls for controlled checkbox inputs
const SelectableInput = (props: {
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  value: string;
}) => {
  return <SelectableInputContainer type="checkbox" {...props} />;
};

export {
  RadioInput,
  SelectableGroup,
  SelectableInput,
  formSelectableRowClassName,
  selectableItemBaseClasses,
  type SelectableVariant,
};
