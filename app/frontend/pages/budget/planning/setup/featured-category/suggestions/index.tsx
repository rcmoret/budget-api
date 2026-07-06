const Suggestion = (props: {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const { children, isSelected, onClick } = props;

  const inputClassName = [
    "radio",
    "radio-sm",
    isSelected ? "radio-accent" : "radio-base-300",
    "relative",
  ].join(" ");

  const className = [
    "col-span-full",
    "grid",
    "px-4",
    "py-2",
    "grid-cols-subgrid",
    "rounded",
    isSelected ? "bg-base-200" : "bg-base-100",
    "has-checked:outline-2",
    "has-checked:outline-secondary",
    "hover:outline-2",
    "hover:outline-secondary",
  ].join(" ");

  return (
    <label aria-selected={isSelected} className={className}>
      <div>
        <input
          className={inputClassName}
          type="radio"
          checked={isSelected}
          onClick={onClick}
          onChange={() => null}
          aria-selected={isSelected}
        />{" "}
      </div>
      {children}
    </label>
  );
};

export { Suggestion };
