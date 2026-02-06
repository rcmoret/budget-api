const contextColors = {};

const primaryColors = {
  blue: "blue-300", // hsl(213, 97%, 87%)
  charteuese: "chartreuse-300", // hsl(82, 100%, 50%)
  green: "green-600", // hsl(142, 71%, 45%)
  purple: "purple-200", // hsl(276, 100%, 87%)
  red: "red-400", // hsl(0, 91%, 71%)
  sky: "sky-200", // hsl(204, 94%, 94%)
  yellow: "yellow-100", //hsl(52, 40%, 87%)
} as const;

const accentColors = {
  green: primaryColors.charteuese, // hsl(82, 100%, 50%)
  red: "red-500", // hsl(0, 84%, 60%)
  blue: primaryColors.sky, // hsl(204, 94%, 94%)
} as const;

const mutedColors = {
  blue: "blue-muted", // hsl(213, 50%, 95%)
  charteuese: "chartreuse-100", // hsl(112, 28%, 88%)
  green: "green-muted", // hsl(142, 50%, 95%)
  purple: "purple-muted", // hsl(276, 50%, 95%)
  red: "red-muted", // hsl(0, 50%, 95%)
  sky: "sky-50", // hsl(204, 100%, 97%)
  yellow: "yellow-50", //hsl(52, 18%, 93%)
} as const;

const neutralColors = {
  black: "black", // hsl(0, 0%, 0%)
  white: "white", // hsl(0, 0%, 100%)
  lightest: "gray-50", // hsl(0, 0%, 98%)
  light: "gray-100", // hsl(0, 0%, 96%)
  soft: "gray-200", // hsl(0, 0%, 90%)
  muted: "gray-300", // hsl(0, 0%, 83%)
  medium: "gray-400", // hsl(0, 0%, 74%)
  dark: "gray-600", // hsl(0, 0%, 52%)
  darker: "gray-800", // hsl(0, 0%, 32%)
} as const;

const pairedColors = {
  gray: [neutralColors.light, neutralColors.soft], // hsl(0, 0%, 96%) & hsl(0, 0%, 90%)
  sky: [mutedColors.sky, "sky-100"], // hsl(204, 100%, 97%) & hsl(204, 94%, 94%)
} as const;

type BackgroundColorOptions = "green";

type BackgroundColorMapEntry = Record<
  BackgroundColorOptions,
  {
    primary: string;
    hover: string;
  }
>;

const backgroundColors: BackgroundColorMapEntry = {
  green: {
    primary: primaryColors.green, // hsl(142, 71%, 45%)
    hover: "green-700", // hsl(142, 72%, 29%)
  },
};

const themeColors = {
  accentColors,
  mutedColors,
  neutralColors,
  pairedColors,
  primaryColors,
} as const;

// uncomment and add to export when needed
// borderColors,
// borderColors as ringColors,

const gradients = {
  charteuese: {
    full: primaryColors.charteuese,
    muted: mutedColors.charteuese,
  },
};

const positiveGreen = primaryColors.green;
const negativeRed = primaryColors.red;
const previouslyBudgeted = primaryColors.sky;
const currentlyBudgeted = primaryColors.purple;

export {
  themeColors,
  accentColors,
  backgroundColors,
  currentlyBudgeted,
  gradients,
  mutedColors,
  negativeRed,
  neutralColors,
  pairedColors,
  positiveGreen,
  previouslyBudgeted,
  primaryColors,
};
