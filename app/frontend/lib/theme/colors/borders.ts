import { neutralColors, primaryColors } from "@/lib/theme/colors";

type BorderColorKey = "charteuese" | "gray";

type BorderColorVariant = "medium";

const borderColors: Record<
  BorderColorKey,
  Record<BorderColorVariant, string>
> = {
  charteuese: { medium: primaryColors.charteuese },
  gray: { medium: neutralColors.medium },
};

type BorderClassOptions = {
  variant?: BorderColorVariant;
  side?: "t" | "b" | "l" | "r" | "x" | "y";
  width?: 1 | 2;
};

const outlineColor = (key: BorderColorKey, variant?: BorderColorVariant) => {
  return ["outline", borderColors[key][variant ?? "medium"]].join("-");
};

const outlineClasses = (key: BorderColorKey, options?: BorderClassOptions) => {
  const variant = options?.variant ?? "medium";
  const colorValue = outlineColor(key, variant);
  const side = options?.side ?? null;
  const width = options?.width ?? null;

  const outlineElements: Array<string | null | 1 | 2> = [side, width];

  const outlineClass: string = outlineElements.reduce<string>(
    (accumulator, element): string => {
      if (element === null) {
        return accumulator;
      }

      return `${accumulator}-${element}`;
    },
    "outline",
  );

  return ["outline", colorValue, outlineClass].join(" ");
};

const borderColor = (key: BorderColorKey, variant?: BorderColorVariant) => {
  return ["border", borderColors[key][variant ?? "medium"]].join("-");
};

const borderClasses = (key: BorderColorKey, options?: BorderClassOptions) => {
  const variant = options?.variant ?? "medium";
  const colorValue = borderColor(key, variant);
  const side = options?.side ?? null;
  const width = options?.width ?? null;

  const borderElements: Array<string | null | 1 | 2> = [side, width];

  const borderClass: string = borderElements.reduce<string>(
    (accumulator, element): string => {
      if (element === null) {
        return accumulator;
      }

      return `${accumulator}-${element}`;
    },
    "border",
  );

  return [colorValue, borderClass].join(" ");
};

export { borderClasses, outlineClasses };
