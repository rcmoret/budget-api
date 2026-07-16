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

export { CloseButton };
