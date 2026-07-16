type CheckMarkButtonProps = {
  ariaLabel: string;
  disabled?: boolean;
  onClick?: () => void;
  tabIndex?: number;
  title?: string;
  type?: "button" | "submit";
};

const CheckMarkButton = (props: CheckMarkButtonProps) => {
  const {
    disabled = false,
    ariaLabel,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button
      type={type}
      {...buttonProps}
      aria-label={ariaLabel}
      disabled={disabled}
      className="round-cta"
    >
      <div className="shadow-lg" aria-hidden="true">
        &#x2713;
      </div>
    </button>
  );
};

const iconButtonClassName = [
  "bg-white/60",
  "cursor-pointer",
  "hover:bg-white",
  "hover:font-medium",
  "hover:text-base-content",
  "leading-none",
  "rounded-full",
  "text-base-content/70",
  "grid",
  "place-items-center",
  "h-8",
  "w-8",
].join(" ");

const IconButton = (props: {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
  type?: "button" | "submit";
}) => {
  const type = props.type ?? "button";
  return (
    <button
      className={iconButtonClassName}
      type={type}
      onClick={props.onClick}
      title={props.title}
      aria-label={props.title}
    >
      {props.children}
    </button>
  );
};

type CloseButtonProps = {
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  tabIndex?: number;
  title: string;
};

const CloseButton = (props: CloseButtonProps) => {
  const { disabled = false, ariaLabel, ...buttonProps } = props;

  return (
    <button
      type="button"
      {...buttonProps}
      aria-label={ariaLabel}
      disabled={disabled}
      className="round-cta cancel"
    >
      <div className="shadow-lg">&#x2718;</div>
    </button>
  );
};

export { CheckMarkButton, CloseButton, IconButton };
