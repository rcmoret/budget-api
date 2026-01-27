import React from "react";

import type {
  FontSizeOption,
  FontWeightOption,
  TextAlignOption,
} from "types/components/text-classes";

import type {
  DisplayOption,
  FlexAlignOption,
  FlexDirectionOption,
  FlexWrapOption,
  OverflowOption,
} from "types/components/display-classes";

import type { GapOption } from "types/components/spacing-classes";

interface ComponentProps {
  children: React.ReactNode;
  styling: {
    bgColor?: string;
    display?: DisplayOption;
    flexAlign?: FlexAlignOption;
    flexDirection?: FlexDirectionOption;
    flexWrap?: FlexWrapOption;
    fontSize?: FontSizeOption;
    fontWeight?: FontWeightOption;
    gap?: GapOption;
    margin?: string;
    overflow?: OverflowOption;
    padding?: string;
    rounded?: "rounded";
    textAlign?: TextAlignOption;
    width?: string;
  };
}

const Cell = ({ children, styling }: ComponentProps) => {
  const className = Object.values(styling).join(" ");

  return <div className={className}>{children}</div>;
};

export { Cell };
