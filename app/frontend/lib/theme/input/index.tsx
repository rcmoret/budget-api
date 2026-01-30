type ThemedInputProps = {
  id?: string;
  name?: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: "number" | "text" | "email" | "tel" | "password" | "search" | "url";
  value: number | string;
  disabled?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
  autoComplete?: string;
  placeholder?: string;
};

const focusClasses = [
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-blue-500",
];

const ThemedInput = (props: ThemedInputProps) => {
  const required = props.required ?? false;
  const disabled = props.disabled ?? false;
  const type = props.type ?? "text";
  const { id, name, onChange, value } = props;

  const className = [
    "border",
    "border-gray-300",
    "rounded",
    "h-input-lg",
    "px-1",
    ...focusClasses,
    disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "",
    props["aria-invalid"] ? "border-red-500" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
      aria-required={required}
      aria-disabled={disabled}
      aria-invalid={props["aria-invalid"]}
      aria-describedby={props["aria-describedby"]}
      aria-label={props["aria-label"]}
    />
  );
};

export { ThemedInput };
export type { ThemedInputProps };
