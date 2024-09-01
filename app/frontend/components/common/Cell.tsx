import React from "react";

import type {
  DisplayOption,
  FlexAlignOption,
  FlexDirectionOption,
  FlexWrapOption,
  FontSizeOption,
  OverflowOption,
  TextAlignOption,
} from "types/component_classes";

interface ComponentProps {
  children: React.ReactNode;
  styling: {
    bgColor?: string;
    display?: DisplayOption;
    flexAlign?: FlexAlignOption;
    flexDirection?: FlexDirectionOption;
    flexWrap?: FlexWrapOption;
    fontSize?: FontSizeOption;
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
