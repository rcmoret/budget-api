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
    primary: primaryColors.green,
    hover: "green-700",
  },
};

type BorderColorKey = "gray";

type BorderColorVariant = "medium";

const borderColors: Record<
  BorderColorKey,
  Record<BorderColorVariant, string>
> = {
  gray: { medium: neutralColors.medium },
};

const outlineColor = (key: BorderColorKey, variant?: BorderColorVariant) => {
  return ["outline", borderColors[key][variant ?? "medium"]].join("-");
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

export {
  themeColors,
  accentColors,
  backgroundColors,
  mutedColors,
  neutralColors,
  outlineColor,
  pairedColors,
  primaryColors,
};
