const colorMap = {
  "100": "gray-100",
  "200": "gray-200",
  "300": "gray-300",
  "600": "gray-600",
  "700": "gray-700",
} as const;

const grayBackgrounds = {
  disabled: `bg-${colorMap["600"]}`,
} as const;

export { grayBackgrounds };
