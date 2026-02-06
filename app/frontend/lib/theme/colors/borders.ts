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
  prefix?: "hover";
  side?: "t" | "b" | "l" | "r" | "x" | "y";
  variant?: BorderColorVariant;
  width?: 1 | 2;
};

const ringColor = (key: BorderColorKey, variant?: BorderColorVariant) => {
  return ["ring", borderColors[key][variant ?? "medium"]].join("-");
};

const ringClasses = (key: BorderColorKey, options?: BorderClassOptions) => {
  const variant = options?.variant ?? "medium";
  const colorValue = ringColor(key, variant);
  const side = options?.side ?? null;
  const width = options?.width ?? null;
  const prefix = options?.prefix ?? null;

  const ringElements: Array<string | null | 1 | 2> = [side, width];

  const initialString = !!prefix ? `${prefix}:ring` : "ring";

  const ringClass: string = ringElements.reduce<string>(
    (accumulator, element): string => {
      if (element === null) {
        return accumulator;
      }

      return `${accumulator}-${element}`;
    },
    initialString,
  );

  return ["ring", colorValue, ringClass].join(" ");
};

const outlineColor = (key: BorderColorKey, variant?: BorderColorVariant) => {
  return ["outline", borderColors[key][variant ?? "medium"]].join("-");
};

const outlineClasses = (key: BorderColorKey, options?: BorderClassOptions) => {
  const variant = options?.variant ?? "medium";
  const colorValue = outlineColor(key, variant);
  const side = options?.side ?? null;
  const width = options?.width ?? null;
  const prefix = options?.prefix ?? null;

  const outlineElements: Array<string | null | 1 | 2> = [side, width];

  const initialString = !!prefix ? `${prefix}:outline` : "outline";

  const outlineClass: string = outlineElements.reduce<string>(
    (accumulator, element): string => {
      if (element === null) {
        return accumulator;
      }

      return `${accumulator}-${element}`;
    },
    initialString,
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
  const prefix = options?.prefix ?? null;

  const borderElements: Array<string | null | 1 | 2> = [side, width];
  const initialString = !!prefix ? `${prefix}:border` : "border";

  const borderClass: string = borderElements.reduce<string>(
    (accumulator, element): string => {
      if (element === null) {
        return accumulator;
      }

      return `${accumulator}-${element}`;
    },
    initialString,
  );

  return [colorValue, borderClass].join(" ");
};

export { borderClasses, outlineClasses, ringClasses };
