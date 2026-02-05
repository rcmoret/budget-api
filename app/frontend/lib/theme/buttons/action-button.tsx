import { MouseEventHandler } from "react";
import { Icon, IconName } from "@/components/common/Icon";
import { textColorFor } from "@/lib/context-colors";
import { Link } from "@inertiajs/react";

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

type ActionSubmitButtonType = SharedActionButtonType;

type ActionButtonType = SharedActionButtonType & {
  buttonType?: "button";
  fontSize?: "text-xs" | "text-sm" | "text-lg";
  onClick: MouseEventHandler<HTMLButtonElement>;
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
  "p-1",
  "m-1",
  // Focus styles for keyboard navigation
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-blue-300",
  "rounded",
  "transition-opacity",
];

const ActionIconButton = (props: ActionButtonType) => {
  const isEnabled = props.isEnabled ?? !props.isEnabled;
  const isBusy = props.isBusy ?? false;
  const buttonType = props.buttonType || "button";
  const textColor = textColorOptions[props.color ?? "blue"];
  const disabledStyles = !isEnabled ? "opacity-50 cursor-not-allowed" : "";
  const fontSize = props.fontSize ?? "text-lg";
  const buttonClassName = [
    ...buttonClasses,
    textColor,
    disabledStyles,
    fontSize,
  ]
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

const ActionIconSubmitButton = (props: ActionSubmitButtonType) => {
  const isEnabled = !!props.isEnabled;
  const isBusy = props.isBusy ?? false;
  const textColor = textColorOptions[props.color ?? "green"];
  const disabledStyles = !isEnabled ? "opacity-50 cursor-not-allowed" : "";
  const buttonClassName = [...buttonClasses, textColor, disabledStyles]
    .filter(Boolean)
    .join(" ");

  return (
    <button
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

type ButtonStyleProps = {
  id: string;
  children: React.ReactNode;
  flexDirection?: "flex-row" | "flex-row-reverse";
  icon?: IconName;
};

const buttonStyleClassName = (props: {
  flexDirection?: "flex-row" | "flex-row-reverse";
}) => {
  const flexDirection = props.flexDirection ?? "flex-row";
  return [
    "bg-blue-300",
    flexDirection,
    "font-semibold",
    "gap-2",
    "group",
    "h-6",
    "hover:bg-blue-400",
    "hover:text-white",
    "inline-flex",
    "items-center",
    "leading-3",
    "outline",
    "outline-1",
    "outline-sky-200",
    "hover:outline-sky-300",
    "px-4",
    "py-0",
    "rounded",
    "shadow-md",
    "text-sm",
    "text-white",
  ].join(" ");
};

const ButtonIcon = (props: { icon: IconName }) => {
  return (
    <div className="text-sky-100 text-sm group-hover:text-sky-200">
      <Icon name={props.icon} />
    </div>
  );
};

const ButtonStyleLink = (
  props: ButtonStyleProps & { title: string; href: string },
) => {
  const className = buttonStyleClassName({
    flexDirection: props.flexDirection,
  });

  return (
    <Link
      href={props.href}
      id={props.id}
      className={className}
      title={props.title}
      aria-label={props.title}
    >
      {!!props.icon && <ButtonIcon icon={props.icon} />}
      {props.children}
    </Link>
  );
};

const ActionButton = (
  props: ButtonStyleProps & { title: string; onClick: () => void },
) => {
  const className = buttonStyleClassName({
    flexDirection: props.flexDirection,
  });

  return (
    <button
      type="button"
      id={props.id}
      aria-label={props.title}
      title={props.title}
      className={className}
      onClick={props.onClick}
    >
      {!!props.icon && <ButtonIcon icon={props.icon} />}
      {props.children}
    </button>
  );
};

export {
  ActionButton,
  ActionIconSubmitButton,
  ActionIconButton,
  ButtonStyleLink,
};
