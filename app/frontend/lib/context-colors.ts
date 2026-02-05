import { BgColorOption } from "@/types/component_classes";

const greenShades = {
  "100": "green-100",
  "200": "green-200",
  "300": "green-300",
  "600": "green-600",
  "700": "green-700",
} as const;

type BackgroundFillKey = "blue" | "green";

type TextChartreuses = "text-chartreuse-200" | "text-chartreuse-300";

type TextGrays =
  | "text-black"
  | "text-gray-500"
  | "text-gray-600"
  | "text-gray-800"
  | "text-white";

type TextReds = "text-red-400" | "text-red-700";

type TextSkys = "text-sky-200";

type BackgroundFillTuple = {
  "extra-light": string;
  default: string;
  light: string;
  medium: string;
};

const backgroundFills: Record<BackgroundFillKey, BackgroundFillTuple> = {
  blue: {
    "extra-light": "blue-60",
    light: "blue-80",
    default: "blue-100",
    medium: "blue-200",
  },
  green: {
    "extra-light": greenShades["100"],
    light: greenShades["200"],
    default: greenShades["600"],
    medium: greenShades["700"],
  },
};

const backgroundFill = (
  color: BackgroundFillKey,
  variant?: keyof BackgroundFillTuple,
): BgColorOption => {
  return `bg-${backgroundFills[color][variant ?? "default"]}` as BgColorOption;
};

type BorderColorKey = "blue" | "green";

type BorderColorTuple = {
  default: string;
  light: string;
};

const borderColors: Record<BorderColorKey, BorderColorTuple> = {
  blue: {
    default: "blue-300",
    light: "blue-200",
  },
  green: {
    default: greenShades["300"],
    light: greenShades["200"],
  },
};

type BorderColors = keyof typeof borderColors;

const contextColors = {
  actionItem: "blue-300",
  "actionItem:hover": "blue-400",
  currentlyBudgeted: "chartreuse-200",
  previouslyBudgeted: "sky-200",
  negativeAmount: "red-400",
  positiveGreen: greenShades["600"],
} as const;

type ColorContext = keyof typeof contextColors;

const borderColor = (color: BorderColors, variant?: keyof BorderColorTuple) => {
  return `border-${borderColors[color][variant ?? "default"]}`;
};

type BgColorOptionForOptionalProps = {
  withHover: boolean;
};

const bgColorFor = (context: ColorContext) => {
  return `bg-${contextColors[context]}`;
};

export type { ColorContext, TextChartreuses, TextGrays, TextReds, TextSkys };

export { backgroundFill, bgColorFor, borderColor };
