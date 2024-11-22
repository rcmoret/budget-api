import { MouseEventHandler } from "react";

import {
  CursorOptions,
} from "types/component_classes";

import type {
  FontSizeOption,
  FontWeightOption,
  TextColor,
} from "types/components/text-classes";

import type {
  AlignItemsOption,
  BgColorOption,
  FlexAlignOption,
  FlexDirectionOption,
  FlexWrapOption,
  OverflowOption,
} from "types/components/display-classes";

type StylingProps = {
  alignItems?: AlignItemsOption;
  alternatingBgColor?: string;
  backgroundColor?: BgColorOption;
  border?: string;
  color?: TextColor;
  cursor?: CursorOptions;
  flexAlign?: FlexAlignOption;
  flexDirection?: FlexDirectionOption;
  flexWrap?: FlexWrapOption | null;
  fontSize?: FontSizeOption;
  fontWeight?: FontWeightOption;
  margin?: string;
  overflow?: OverflowOption;
  padding?: string;
  rounded?: "rounded" | null;
}

type DisabledButtonProps = {
  children: React.ReactNode
  styling: StylingProps;
}

const DisabledButton = (props: DisabledButtonProps) => {
  return (
    <ButtonComponent
      onClick={() => null}
      isDisabled={true}
      styling={{ ...props.styling }}
      type="button"
    >
      {props.children}
    </ButtonComponent>
  )
}

type SubmitButtonProps = {
  children: React.ReactNode;
  isEnabled?: boolean;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  styling: StylingProps;
  disabledStyling?: StylingProps;
}

const SubmitButton = (props: SubmitButtonProps) => {
  const { children, onSubmit } = props

  const isEnabled = !!props.isEnabled

  if (isEnabled) {
    return (
      <ButtonComponent
        onClick={onSubmit}
        styling={{ ...props.styling }}
        type="submit"
      >
        {children}
      </ButtonComponent>
    )
  } else {
    return (
      <DisabledButton
        styling={{ ...props.styling, ...props.disabledStyling }}
      >
        {children}
      </DisabledButton>
    )
  }
}

type ButtonProps = {
  children: React.ReactNode
  isDisabled?: boolean;
  onClick: () => void;
  type: "button" | "submit";
  styling?: StylingProps;
  title?: string;
  disabledStyling?: StylingProps;
}

const Button = (props: ButtonProps) => {
  const {
    children,
    title,
    type,
  } = props

  const isDisabled = !!props.isDisabled

  if (isDisabled) {
    return (
      <DisabledButton styling={{...props.disabledStyling}}>
        {children}
      </DisabledButton>
    )
  } else if (type === "submit") {
    return (
      <SubmitButton styling={{...props.styling}} onSubmit={props.onClick}>
        {children}
      </SubmitButton>
    )
  } else {
    return (
      <ButtonComponent
        styling={{...props.styling}}
        type={type}
        onClick={props.onClick}
        title={title}
      >
        {children}
      </ButtonComponent>
    )
  }
}

type ButtonComponentProps = {
  children: React.ReactNode;
  isDisabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: "button" | "submit";
  styling: StylingProps;
  title?: string
}


const ButtonComponent = (props: ButtonComponentProps) => {
  const {
    children,
    onClick,
    styling,
    title,
    type,
  } = props

  const className = Object.values(styling)
    .filter((val) => val !== null && val !== "")
    .join(" ");

  const buttonProps = {
    type,
    onClick,
    disabled: !!props.isDisabled,
    className,
    ...(!!title ? { title } : {})
  }

  return (
    <button {...buttonProps}>
      {children}
    </button>
  )
}

export { Button, SubmitButton }
