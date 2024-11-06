import { MouseEventHandler } from "react";

import {
  AlignItemsOption,
  BgColorOption,
  CursorOptions,
  FlexAlignOption,
  FlexDirectionOption,
  FlexWrapOption,
  FontSizeOption,
  FontWeightOption,
  OverflowOption,
  TextColor,
} from "types/component_classes";

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
  disabledStyling?: StylingProps;
}

const Button = (props: ButtonProps) => {
  const {
    children,
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
}


const ButtonComponent = (props: ButtonComponentProps) => {
  const {
    children,
    onClick,
    type,
  } = props

  const styles = { ...props.styling, };
  const className = Object.values(styles)
    .filter((val) => val !== null && val !== "")
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={!!props.isDisabled}
      className={className}
    >
      {children}
    </button>
  )
}

export { Button, SubmitButton }
