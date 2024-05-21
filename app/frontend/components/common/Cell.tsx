import React from "react";

import type {
  DisplayOption,
  FlexAlignOption,
  FlexWrapOption,
  FontSizeOption,
  OverflowOption,
  TextAlignOption,
} from "types/component_classes";

interface ComponentProps {
  children: React.ReactNode;
  styling: {
    display?: DisplayOption;
    flexWrap?: FlexWrapOption;
    flexAlign?: FlexAlignOption;
    fontSize?: FontSizeOption;
    margin?: string;
    overflow?: OverflowOption;
    padding?: string;
    textAlign?: TextAlignOption;
    width?: string;
  };
}

const Cell = ({ children, styling }: ComponentProps) => {
  const className = Object.values(styling).join(" ");

  return <div className={className}>{children}</div>;
};

export { Cell };
