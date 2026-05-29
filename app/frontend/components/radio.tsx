//
// type RadioVariant = "accent" | "secondary";
// variant?: RadioVariant;

const RadioInput = (props: {
  children: React.ReactNode;
  defaultChecked: boolean;
  disabled?: boolean;
  name: string;
  value: string;
}) => {
  const { defaultChecked, disabled = false, name, value } = props;

  const inputClassName = ["relative", "radio", "radio-sm", "radio-accent"].join(
    " ",
  );

  const labelClassName = [
    "group",
    "relative",
    "flex",
    "items-center",
    "justify-between",
    "gap-1",
    "p-2",
    "text-sm",
    "rounded",
    "bg-white/100",
    "has-checked:outline-2",
    "has-checked:outline-accent",
    "cursor-pointer",
    "disabled:cursor-default",
  ].join(" ");

  return (
    <label className={labelClassName}>
      <span className="relative">{props.children}</span>
      <input
        name={name}
        type="radio"
        className={inputClassName}
        defaultChecked={defaultChecked}
        disabled={disabled}
        value={value}
      />
    </label>
  );
};

export { RadioInput };
