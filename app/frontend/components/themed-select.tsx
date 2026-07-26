import Select, {
  GroupBase,
  mergeStyles,
  Props,
  StylesConfig,
} from "react-select";

type ThemedSelectSize = "xs" | "sm" | "md" | "lg" | "xl";

type ThemedSelectVariant =
  | "default"
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

// daisyUI sizes every field as `--size-field` times a per-size multiplier, and
// pairs each with a font size — see `.input-xs`/`.input-sm`/… in
// daisyui/components/input.css. Mirroring that table is what keeps a
// ThemedSelect the same height as an `input input-<size>` sitting beside it.
const sizeMetrics: Record<
  ThemedSelectSize,
  { multiplier: number; fontSize: string }
> = {
  xs: { multiplier: 6, fontSize: "0.6875rem" },
  sm: { multiplier: 8, fontSize: "0.75rem" },
  md: { multiplier: 10, fontSize: "0.875rem" },
  lg: { multiplier: 12, fontSize: "1.125rem" },
  xl: { multiplier: 14, fontSize: "1.375rem" },
};

const mutedContent = (percent: number) =>
  `color-mix(in oklab, var(--color-base-content) ${percent}%, transparent)`;

// daisyUI's unmodified `.input` fades its border at rest and darkens it on
// focus, while every color modifier (`.input-secondary` &c.) pins one token for
// both states — the modifier sits in a shallower cascade layer than
// `.input:focus-within`, so it wins there too.
const variantColors = (variant: ThemedSelectVariant) =>
  variant === "default"
    ? { rest: mutedContent(20), focus: "var(--color-base-content)" }
    : { rest: `var(--color-${variant})`, focus: `var(--color-${variant})` };

// react-select injects emotion styles into <head> at runtime, which outrank our
// stylesheet — so the theming has to be expressed as a `styles` config rather
// than as CSS classes. Every value here is a daisyUI token; react-select's own
// defaults are light-theme literals (neutral0/neutral80/primary) that would
// ignore the active theme entirely.
const themedStyles = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  size: ThemedSelectSize,
  variant: ThemedSelectVariant,
): StylesConfig<Option, IsMulti, Group> => {
  const { multiplier, fontSize } = sizeMetrics[size];
  const height = `calc(var(--size-field, 0.25rem) * ${multiplier})`;
  const { rest: restColor, focus: focusColor } = variantColors(variant);

  return {
    control: (base, state) => ({
      ...base,
      minHeight: height,
      height,
      fontSize,
      borderRadius: "var(--radius-field)",
      backgroundColor: "var(--color-base-100)",
      borderWidth: "var(--border)",
      borderColor: state.isFocused ? focusColor : restColor,
      // daisyUI draws focus as an offset outline, not react-select's 1px glow.
      boxShadow: "none",
      outline: state.isFocused
        ? `2px solid ${focusColor} !important`
        : "0 !important",
      outlineOffset: "2px",
      "&:hover": { borderColor: state.isFocused ? focusColor : restColor },
    }),
    valueContainer: (base) => ({ ...base, height, padding: "0 0.5rem" }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "var(--color-base-content)",
    }),
    singleValue: (base) => ({ ...base, color: "var(--color-base-content)" }),
    placeholder: (base) => ({ ...base, color: mutedContent(50) }),
    indicatorsContainer: (base) => ({ ...base, height }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base, state) => ({
      ...base,
      padding: "0 0.25rem",
      svg: { height: "0.875rem", width: "0.875rem" },
      color: state.isFocused ? focusColor : mutedContent(50),
      ":hover": { color: focusColor },
    }),
    menu: (base) => ({
      ...base,
      // Floored so the smallest controls still get a readable menu.
      fontSize: `max(${fontSize}, 0.75rem)`,
      backgroundColor: "var(--color-base-100)",
      color: "var(--color-base-content)",
      borderRadius: "var(--radius-box)",
      border: `var(--border) solid ${mutedContent(20)}`,
    }),
    // Selected and hovered rows shift only the background, letting text inherit
    // base-content. Options frequently render their own colored content (an
    // amount in error/success, say), which a filled `--color-primary` row —
    // react-select's default for the selected option — would fight.
    option: (base, state) => ({
      ...base,
      padding: "0.25rem 0.5rem",
      color: state.isDisabled ? mutedContent(40) : "inherit",
      backgroundColor: state.isSelected
        ? "var(--color-base-300)"
        : state.isFocused
          ? "var(--color-base-200)"
          : "transparent",
      ":active": {
        backgroundColor: state.isDisabled ? undefined : "var(--color-base-300)",
      },
    }),
    groupHeading: (base) => ({
      ...base,
      padding: "0 0.5rem",
      color: mutedContent(60),
    }),
    noOptionsMessage: (base) => ({ ...base, color: mutedContent(60) }),
    loadingMessage: (base) => ({ ...base, color: mutedContent(60) }),
  };
};

type ThemedSelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = Props<Option, IsMulti, Group> & {
  size?: ThemedSelectSize;
  variant?: ThemedSelectVariant;
};

const ThemedSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ThemedSelectProps<Option, IsMulti, Group>,
) => {
  const { size = "xs", variant = "secondary", styles, ...selectProps } = props;

  return (
    <Select
      {...selectProps}
      // react-select's own merge chains per slot, so a caller's `menu` receives
      // the themed object as its base rather than replacing it outright.
      styles={mergeStyles(
        themedStyles<Option, IsMulti, Group>(size, variant),
        styles,
      )}
    />
  );
};

export {
  ThemedSelect,
  type ThemedSelectProps,
  type ThemedSelectSize,
  type ThemedSelectVariant,
};
