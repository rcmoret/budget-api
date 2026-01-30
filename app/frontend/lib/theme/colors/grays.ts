const colorMap = {
  "100": "gray-100",
  "200": "gray-200",
  "300": "gray-300",
  "600": "gray-600",
  "700": "gray-700",
} as const;

type GrayColorOption = (typeof colorMap)[keyof typeof colorMap];

const grayBackgrounds = {
  disabled: `bg-${colorMap["600"]}`,
} as const;

type GrayBackgroundOption =
  (typeof grayBackgrounds)[keyof typeof grayBackgrounds];

type TextGray = `text-${GrayColorOption}`;

export type { GrayBackgroundOption, TextGray };

export { colorMap, grayBackgrounds };
