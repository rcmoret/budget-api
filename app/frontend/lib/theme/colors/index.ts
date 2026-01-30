const primaryColors = {
  blue: "blue-300",
  charteuese: "chartreuse-300",
  green: "green-600",
  purple: "purple-200",
  red: "red-400",
  sky: "sky-200",
} as const;

const accentColors = {
  green: primaryColors.charteuese,
  red: "red-500",
  blue: primaryColors.sky,
} as const;

const mutedColors = {
  blue: "blue-muted",
  charteuese: "chartreuse-50",
  green: "green-muted",
  purple: "purple-muted",
  red: "red-muted",
  sky: "sky-50",
} as const;

const neutralColors = {
  black: "black",
  white: "white",
  lightest: "gray-50",
  light: "gray-100",
  soft: "gray-200",
  muted: "gray-300",
  medium: "gray-400",
  dark: "gray-600",
  darker: "gray-800",
} as const;

const pairedColors = {
  gray: [neutralColors.light, neutralColors.soft],
  sky: [mutedColors.sky, "sky-100"],
} as const;

const themeColors = {
  accentColors,
  mutedColors,
  neutralColors,
  pairedColors,
  primaryColors,
} as const;

export {
  themeColors,
  accentColors,
  mutedColors,
  neutralColors,
  pairedColors,
  primaryColors,
};
