import React from "react";

import type {
  FontSizeOption,
  FontWeightOption,
  TextColor,
} from "types/components/text-classes";

import {
  GapOption
} from "types/components/spacing-classes";

import type {
  AlignItemsOption,
  BgColorOption,
  FlexAlignOption,
  FlexDirectionOption,
  FlexWrapOption,
  OverflowOption,
  StripedRowColorOption,
} from "types/components/display-classes";

interface RowProps {
  children: React.ReactNode;
  styling?: {
    alignItems?: AlignItemsOption;
    alternatingBgColor?: string;
    backgroundColor?: BgColorOption;
    border?: string;
    color?: TextColor
    flexAlign?: FlexAlignOption;
    flexDirection?: FlexDirectionOption;
    flexWrap?: FlexWrapOption | null;
    fontSize?: FontSizeOption;
    fontWeight?: FontWeightOption;
    gap?: GapOption;
    margin?: string;
    overflow?: OverflowOption;
    padding?: string;
    rounded?: "rounded" | null;
  };
}

const Row = (suppliedProps: RowProps) => {
  const { styling, children } = suppliedProps;
  const styles = {
    display: "flex",
    width: "w-full",
    ...styling,
  };
  const className = Object.values(styles)
    .filter((val) => val !== null && val !== "")
    .join(" ");

  return <div className={className}>{children}</div>;
};

interface StripedRowProps {
  children: React.ReactNode;
  evenColor?: StripedRowColorOption;
  oddColor?: StripedRowColorOption;
  styling: {
    alignItems?: AlignItemsOption;
    border?: string;
    color?: TextColor
    flexAlign?: FlexAlignOption;
    flexDirection?: FlexDirectionOption;
    flexWrap?: FlexWrapOption | null;
    fontSize?: FontSizeOption;
    fontWeight?: FontWeightOption;
    margin?: string;
    overflow?: OverflowOption;
    padding?: string;
    rounded?: "rounded" | null;
  };
}

const StripedRow = (props: StripedRowProps) => {
  const evenColor = props.evenColor || "even:bg-white";
  const oddColor = props.oddColor || "odd:bg-gray-50";

  console.log([ oddColor, evenColor])
  const styling = {
    ...props.styling,
    alternatingBgColor: [oddColor, evenColor].join(" ")
  };

  return <Row styling={styling}>{props.children}</Row>;
};

interface TitleRowProps {
  children: React.ReactNode;
  styling: {
    alignItems: AlignItemsOption;
    backgroundColor?: BgColorOption;
    border?: string;
    flexAlign?: FlexAlignOption;
    flexWrap?: FlexWrapOption | null;
    fontSize?: FontSizeOption;
    fontWeight?: FontWeightOption;
    margin?: string;
    overflow?: OverflowOption;
    padding?: string;
    rounded?: "rounded" | null;
  };
}

interface TitleRowDefaultStyles {
  fontSize: FontSizeOption;
  fontWeight: FontWeightOption;
  margin: string;
  padding: string;
}

const TitleRow = (props: TitleRowProps) => {
  const defaultStyling: TitleRowDefaultStyles = {
    fontSize: "text-xl",
    fontWeight: "font-semibold",
    margin: "mb-1",
    padding: "pt-2 pb-2 pl-1 pr-1",
  };
  const styling = {
    ...defaultStyling,
    ...props.styling,
  };

  return <Row styling={styling}>{props.children}</Row>;
};

export { Row, StripedRow, TitleRow };
