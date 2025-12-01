export type AlignItemsOption =
  | "items-start"
  | "items-end"
  | "items-center"
  | "items-baseline"
  | "items-stretch"

export type DisplayOption =
  | "block"
  | "inline-block"
  | "inline"
  | "flex"
  | "inline-flex"
  | "inline-table"
  | "table"
  | "table-caption"

export type FlexAlignOption =
  | "justify-around"
  | "justify-between"
  | "justify-between md:justify-start"
  | "justify-center"
  | "justify-end"
  | "justify-evenly"
  | "justify-normal"
  | "justify-start"
  | "justify-stretch"

export type FlexDirectionOption = "flex-row" | "flex-col" | "flex-row-reverse" | "flex-col-reverse"

export type FlexWrapOption =
  | "flex-wrap"
  | "flex-wrap-reverse"
  | "flex-nowrap"
  | "flex-wrap md:flex-nowrap"

export type OverflowOption =
  | "overflow-auto"
  | "overflow-hidden"
  | "overflow-clip"
  | "overflow-visible"
  | "overflow-scroll"
  | "overflow-x-auto"
  | "overflow-y-auto"
  | "overflow-x-hidden"

type OddBgColorOption =
  | "odd:bg-blue-100"
  | "odd:bg-cyan-50"
  | "odd:bg-cyan-100"
  | "odd:bg-cyan-200"
  | "odd:bg-gray-100"
  | "odd:bg-gray-200"
  | "odd:bg-gray-400"
  | "odd:bg-gray-50"
  | "odd:bg-sky-50"
  | "odd:bg-white"

type EvenBgColorOption =
  | "even:bg-cyan-100"
  | "even:bg-cyan-200"
  | "even:bg-gray-100"
  | "even:bg-gray-200"
  | "even:bg-gray-400"
  | "even:bg-gray-50"
  | "even:bg-sky-50"
  | "even:bg-white"

export type StripedRowColorOption = OddBgColorOption | EvenBgColorOption

type GradientBgOption =
  | "bg-gradient-to-b from-blue-200 to-white"
  | "bg-gradient-to-r from-green-150 to-chartreuse-200"
  | "bg-gradient-to-t from-blue-400 to-white"
  | "bg-gradient-to-l from-gray-50 to-gray-200"

type BlueBgOpion =
  | "bg-blue-300"
  | "bg-blue-400"
  | "bg-blue-800"
  | "bg-blue-900"

type GrayBgOptoin =
  | "bg-gray-50"
  | "bg-gray-100"
  | "bg-gray-200"
  | "bg-gray-300"
  | "bg-gray-400"

type GreenBgOpion =
  | "bg-green-600"
  | "bg-green-700"
  | "bg-green-800"

type IndigoBgOption =
  | "bg-indigo-100"
  | "bg-indigo-200"

type SkyBgOpion =
  | "bg-sky-50"
  | "bg-sky-100"

type YellowBgOption =
  | "bg-yellow-100"
  | "bg-yellow-200"

export type BgColorOption =
  | "bg-white"
  | StripedRowColorOption
  | BlueBgOpion
  | GrayBgOptoin
  | IndigoBgOption
  | GreenBgOpion
  | SkyBgOpion
  | YellowBgOption
  | GradientBgOption

export type BgHoverOption =
  | "hover:bg-gray-300"
  | "hover:bg-gray-400"
  | "hover:bg-green-700"

export type PositionOption =
  | "absolute"
  | "fixed"
  | "relative"
  | "static"
  | "sticky"
