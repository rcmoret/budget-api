const colorMap = {
  "100": "green-100",
  "200": "green-200",
  "300": "green-300",
  "600": "green-600",
  "700": "green-700",
} as const;

type GreenColorOption = (typeof colorMap)[keyof typeof colorMap];

const greenBackgrounds = {
  default: `bg-${colorMap["600"]}`,
  withHover: `bg-${colorMap["600"]} hover:bg-${colorMap["700"]}`,
} as const;

type GreenBackgrounOption =
  (typeof greenBackgrounds)[keyof typeof greenBackgrounds];

type TextGreen = `text-${GreenColorOption}`;

export type { GreenBackgrounOption, TextGreen };

export { colorMap, greenBackgrounds };
