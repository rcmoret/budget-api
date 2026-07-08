type CloseButtonProps = {
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  tabIndex?: number;
  title: string;
};

const CloseButton = (props: CloseButtonProps) => {
  const { disabled = false, ariaLabel, ...buttonProps } = props;
  const buttonClassName = [disabled ? "cursor-default" : "cursor-pointer"].join(
    " ",
  );
  const innerClassName = [
    "w-4",
    "h-4",
    "rounded-full",
    "text-center",
    "text-xs",
    "shadow-lg",
    ...(disabled
      ? ["text-neutral-content", "bg-neutral"]
      : ["text-error-content", "bg-error"]),
  ].join(" ");

  return (
    <button
      type="button"
      {...buttonProps}
      aria-label={ariaLabel}
      disabled={disabled}
      className={buttonClassName}
    >
      <div className={innerClassName}>&#215;</div>
    </button>
  );
};

export { CloseButton };
