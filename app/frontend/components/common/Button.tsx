import { MouseEventHandler } from "react";
import {
  GreenBackgrounOption,
  greenBackgrounds,
} from "@/lib/theme/colors/greens";

import {
  CursorOptions,
  DisplayOption,
  TextAlignOption,
} from "types/component_classes";

import type {
  FontSizeOption,
  FontWeightOption,
  TextColor,
} from "types/components/text-classes";

import type {
  AlignItemsOption,
  BgColorOption,
  BgHoverOption,
  FlexAlignOption,
  FlexDirectionOption,
  FlexWrapOption,
  OverflowOption,
} from "types/components/display-classes";

import type { GapOption } from "types/components/spacing-classes";

type StylingProps = {
  alignItems?: AlignItemsOption;
  alternatingBgColor?: string;
  backgroundColor?: BgColorOption | GreenBackgrounOption;
  border?: string;
  color?: TextColor;
  cursor?: CursorOptions;
  display?: DisplayOption;
  flexAlign?: FlexAlignOption;
  flexDirection?: FlexDirectionOption;
  flexWrap?: FlexWrapOption | null;
  fontSize?: FontSizeOption;
  fontWeight?: FontWeightOption;
  height?: string;
  gap?: GapOption;
  hoverColor?: BgHoverOption;
  margin?: string;
  overflow?: OverflowOption;
  padding?: string;
  rounded?: "rounded" | null;
  shadow?: "shadow-md";
  textAlign?: TextAlignOption;
  shadow?: string;
  width?: string;
};

const focusClasses =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500";

type DisabledButtonProps = {
  children: React.ReactNode;
  styling: StylingProps;
  "aria-label"?: string;
};

const DisabledButton = (props: DisabledButtonProps) => {
  return (
    <ButtonComponent
      onClick={() => null}
      isDisabled={true}
      styling={{ ...props.styling }}
      type="button"
      aria-label={props["aria-label"]}
    >
      {props.children}
    </ButtonComponent>
  );
};

const defaultSubmitStyling: StylingProps = {
  backgroundColor: greenBackgrounds.withHover,
};

type SubmitButtonProps = {
  children: React.ReactNode;
  isEnabled?: boolean;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  styling: StylingProps;
  title?: string;
  disabledStyling?: StylingProps;
  "aria-label"?: string;
};

const SubmitButton = (props: SubmitButtonProps) => {
  const { children, onSubmit, title } = props;
  const providedStyling = props.styling;
  const combinedStyling = {
    ...defaultSubmitStyling,
    ...providedStyling,
  };

  const isEnabled = !!props.isEnabled;

  if (isEnabled) {
    return (
      <ButtonComponent
        onClick={onSubmit}
        styling={{ ...combinedStyling }}
        type="submit"
        title={title}
        aria-label={props["aria-label"]}
      >
        {children}
      </ButtonComponent>
    );
  } else {
    return (
      <DisabledButton
        styling={{ ...combinedStyling, ...props.disabledStyling }}
        aria-label={props["aria-label"]}
      >
        {children}
      </DisabledButton>
    );
  }
};

type ButtonProps = {
  children: React.ReactNode;
  isDisabled?: boolean;
  onClick: () => void;
  type: "button" | "submit";
  styling?: StylingProps;
  title?: string;
  disabledStyling?: StylingProps;
  "aria-label"?: string;
};

const Button = (props: ButtonProps) => {
  const { children, title, type } = props;

  const isDisabled = !!props.isDisabled;

  if (isDisabled) {
    return (
      <DisabledButton
        styling={{
          cursor: "cursor-not-allowed",
          ...props.styling,
          ...props.disabledStyling,
        }}
        aria-label={props["aria-label"]}
      >
        {children}
      </DisabledButton>
    );
  } else if (type === "submit") {
    return (
      <SubmitButton
        styling={{ ...props.styling }}
        onSubmit={props.onClick}
        aria-label={props["aria-label"]}
      >
        {children}
      </SubmitButton>
    );
  } else {
    return (
      <ButtonComponent
        styling={{ ...props.styling }}
        type={type}
        onClick={props.onClick}
        title={title}
        aria-label={props["aria-label"]}
      >
        {children}
      </ButtonComponent>
    );
  }
};

type ButtonComponentProps = {
  children: React.ReactNode;
  isDisabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: "button" | "submit";
  styling: StylingProps;
  title?: string;
  "aria-label"?: string;
};

const ButtonComponent = (props: ButtonComponentProps) => {
  const { children, onClick, styling, title, type } = props;

  const isDisabled = !!props.isDisabled;

  const className = [
    ...Object.values(styling).filter((val) => val !== null && val !== ""),
    focusClasses,
    isDisabled ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      title={title}
      aria-label={props["aria-label"]}
      aria-disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export { Button, SubmitButton };
