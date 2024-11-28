export type FontSizeOption =
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-2xl"
  | "text-3xl"

export type FontWeightOption =
  | "font-thin"
  | "font-extralight"
  | "font-light"
  | "font-normal"
  | "font-medium"
  | "font-semibold"
  | "font-bold"
  | "font-extrabold"
  | "font-black"

export type TextAlignOption =
  | "text-left"
  | "text-center"
  | "text-right"
  | "text-justify"
  | "text-start"
  | "text-end"

type TextBlues =
  | "text-blue-300"
  | "text-blue-400"
  | "text-blue-700"
  | "text-blue-600"
  | "text-blue-800"

type TextChartreuse =
  | "text-chartreuse-300"

type TextGreens =
  | "text-green-700"
  | "text-green-800"

type TextGrayScale =
  | "text-black"
  | "text-gray-500"
  | "text-gray-800"
  | "text-white"

type TextReds =
  | "text-red-400"
  | "text-red-700"

export type TextColor =
  | TextBlues
  | TextChartreuse
  | TextGrayScale
  | TextGreens
  | TextReds

export type TextDecorationOption =
  | "underline"
  | "overline" 
  | "line-through"
  | "no-underline"

export type FontStyleOption =
  | "italic"
  | "not-italic"
