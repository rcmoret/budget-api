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

// Same footprint as the resting button, just pinned rather than hover-only —
// for toggle-style controls (a Tiptap toolbar's bold/italic/underline) that
// need to show "currently on" without a hover.
const activeIconButtonClassName = [
  "bg-white",
  "font-medium",
  "text-base-content",
].join(" ");

const IconButton = (props: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
  type?: "button" | "submit";
}) => {
  const type = props.type ?? "button";
  const className = props.active
    ? `${iconButtonClassName} ${activeIconButtonClassName}`
    : iconButtonClassName;

  return (
    <button
      className={className}
      type={type}
      onClick={props.onClick}
      title={props.title}
      aria-label={props.title}
      aria-pressed={props.active}
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
