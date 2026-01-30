import { MouseEventHandler } from "react";
import { Icon, IconName } from "@/components/common/Icon";
import { textColorFor } from "@/lib/context-colors";

type ColorOption = "black" | "blue" | "green" | "red";

const textColorOptions: Record<ColorOption, string> = {
  black: "text-black",
  blue: "text-blue-300 hover:text-blue-400",
  green: `${textColorFor("positiveGreen")} hover:text-green-800`,
  red: `text-red-300 hover:text-red-400`,
};

type SharedActionButtonType = {
  icon: IconName;
  title: string; // Required for accessibility - icon-only buttons must have a label
  color?: ColorOption;
  isEnabled?: boolean;
  isBusy?: boolean; // For loading/processing states
};

type ActionSubmitButtonType = SharedActionButtonType & {
  onSubmit: MouseEventHandler<HTMLButtonElement>;
};

type ActionButtonType = SharedActionButtonType & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  buttonType?: "button";
};

const IconComponent = (props: { name: IconName }) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Icon name={props.name} />
    </div>
  );
};

const buttonClasses = [
  "bg-transparent",
  "text-lg",
  "p-1",
  "m-1",
  // Focus styles for keyboard navigation
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-blue-300",
  "rounded",
  // Transition for smooth state changes
  "transition-opacity",
];

const ActionButton = (props: ActionButtonType) => {
  const isEnabled = props.isEnabled ?? !props.isEnabled;
  const isBusy = props.isBusy ?? false;
  const buttonType = props.buttonType || "button";
  const textColor = textColorOptions[props.color ?? "blue"];
  const disabledStyles = !isEnabled ? "opacity-50 cursor-not-allowed" : "";
  const buttonClassName = [...buttonClasses, textColor, disabledStyles]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={buttonType}
      aria-label={props.title}
      title={props.title}
      className={buttonClassName}
      onClick={props.onClick}
      disabled={!isEnabled}
      aria-busy={isBusy}
      aria-disabled={!isEnabled}
    >
      <IconComponent name={props.icon} />
    </button>
  );
};

const ActionSubmitButton = (props: ActionSubmitButtonType) => {
  const isEnabled = !!props.isEnabled;
  const isBusy = props.isBusy ?? false;
  const textColor = textColorOptions[props.color ?? "green"];
  const disabledStyles = !isEnabled ? "opacity-50 cursor-not-allowed" : "";
  const buttonClassName = [...buttonClasses, textColor, disabledStyles]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onSubmit={props.onSubmit}
      type="submit"
      aria-label={props.title}
      title={props.title}
      disabled={!isEnabled}
      aria-busy={isBusy}
      aria-disabled={!isEnabled}
      className={buttonClassName}
    >
      <IconComponent name={props.icon} />
    </button>
  );
};

export { ActionSubmitButton, ActionButton };
