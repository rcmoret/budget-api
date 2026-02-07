import { MouseEventHandler } from "react";
import { Icon } from "@/components/common/Icon";
import { greenBackgrounds } from "../colors/greens";
import { grayBackgrounds } from "../colors/grays";
import { IconName } from "@/components/common/Icon";

const outerClassDisabledOptions = {
  backgroundColor: grayBackgrounds.disabled,
};

const outerClassEnabledOptions = {
  backgroundColor: greenBackgrounds.withHover,
  color: "text-white",
  disabled: {},
  fontWeight: "font-semibold",
  padding: "px-2 py-1",
  rounded: "rounded",
  shadow: "shadow-md",
};

type OuterClassOptions = {
  fontWeight?: "font-semibold" | "";
  padding?: "px-4 py-2" | "";
  rounded?: "rounded" | "";
  shadow?: "";
  disabled?: {
    backgroundColor: "";
  };
};

const focusClasses = [
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-blue-500",
];

const outerClassName = (providedOptions?: OuterClassOptions) => {
  const combinedOptions = {
    ...outerClassEnabledOptions,
    ...providedOptions,
  };

  const { disabled: disabledOptions, ...providedEnabledOptions } =
    combinedOptions;

  const enabledClasses = Object.values({
    ...outerClassEnabledOptions,
    ...providedEnabledOptions,
  });

  const disabledClasses = Object.values({
    ...outerClassEnabledOptions,
    ...outerClassDisabledOptions,
    ...disabledOptions,
  });

  return {
    enabled: [...enabledClasses, ...focusClasses].join(" "),
    disabled: [
      ...disabledClasses,
      ...focusClasses,
      "opacity-50",
      "cursor-not-allowed",
    ].join(" "),
  };
};

const ButtonIcon = (props: { iconName: IconName }) => {
  return (
    <div className="text-chartreuse-300">
      <Icon name={props.iconName} />
    </div>
  );
};

const FormSubmitButton = (props: {
  children: React.ReactNode;
  iconName?: IconName;
  outer?: OuterClassOptions;
  title?: string;
  isEnabled?: boolean;
  isBusy?: boolean;
}) => {
  const isEnabled = !!props.isEnabled;
  const isBusy = props.isBusy ?? false;
  const buttonClassName = isEnabled
    ? outerClassName(props.outer).enabled
    : outerClassName(props.outer).disabled;

  // Generate accessible label from children if title not provided
  const accessibleLabel =
    props.title ??
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <button
      type="submit"
      className={buttonClassName}
      disabled={!isEnabled}
      title={props.title}
      aria-label={accessibleLabel}
      aria-busy={isBusy}
      aria-disabled={!isEnabled}
    >
      <div className="flex flex-row gap-2 items-center">
        <div>{props.children}</div>
        {!!props.iconName && <ButtonIcon iconName={props.iconName} />}
      </div>
    </button>
  );
};

export { FormSubmitButton, outerClassName };
