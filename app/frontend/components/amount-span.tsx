import { moneyFormatter } from "@/lib/money-formatter";

const AmountSpanColors = ["text-content", "text-error", "text-success"] as const

const BaseColor: typeof AmountSpanColors[number] = "text-content";
const NegativeColor: typeof AmountSpanColors[number] = "text-error";
const PositiveColor: typeof AmountSpanColors[number] = "text-success";


type ColorizeOption = "none" | "normal" | "reverse" // | "positive-only" | "negative-only";

type AmountSpanColorSchemeProps = {
  option: ColorizeOption;
  only: null | "positive" | "negative"
}

type ColorSchemeReturnType = {
  zeroColor: "text-content";
  negativeColor: typeof AmountSpanColors[number];
  positiveColor: typeof AmountSpanColors[number];
}

const getColorScheme = (props: AmountSpanColorSchemeProps): ColorSchemeReturnType => {
  const zeroColor = BaseColor

  const { only, option } = props;

  if (option === "none") {
    return { zeroColor, positiveColor: BaseColor, negativeColor: BaseColor }
  }

  const colorMap = props.option === "reverse" ?
    { zeroColor, negativeColor: PositiveColor, positiveColor: NegativeColor } :
    { zeroColor, positiveColor: PositiveColor, negativeColor: NegativeColor }

  if (only === "positive") {
    return { ...colorMap, negativeColor: BaseColor }
  }
  if (only === "negative") {
    return { ...colorMap, positiveColor: BaseColor }
  }

  // only is null
  return colorMap
}

type ComponentProps = {
  absolute?: boolean;
  amount: number;
  classes?: string[];
  colorize?: ColorizeOption;
  decorate?: boolean;
  showCents?: boolean;
  prefix?: string;
  only?: "positive" | "negative"
}

const AmountSpan = (suppliedProps: ComponentProps) => {
  const defaultProps = {
    absolute: false,
    amount: 0,
    classes: [],
    color: "text-content",
    colorize: !!suppliedProps.only ? "normal" : "none" as ColorizeOption,
    decorate: true,
    prefix: "",
    only: null
  };

  const props = {
    ...defaultProps,
    ...suppliedProps,
  };

  const { absolute, amount, classes, colorize, decorate, prefix } = props;

  const { zeroColor, positiveColor, negativeColor } = getColorScheme({ option: colorize, only: props.only })

  const className = [
    ...(amount === 0 ?
      [zeroColor] :
      (amount > 0 ? [positiveColor] : [negativeColor])
    ),
    "text-right",
    ...classes
  ].join(" ");

  return (
    <span className={className}>
      {prefix && `${prefix} `}
      {moneyFormatter(amount, {
        absolute,
        decorate,
        showCents: props.showCents ?? true,
      })}
    </span>
  );
};

// const PercentSpan = (suppliedProps: ComponentProps) => {
//   const defaultProps = {
//     absolute: false,
//     amount: 0,
//     decorate: true,
//     color: "text-black",
//     classes: [],
//     prefix: "",
//   };

//   const props = {
//     ...defaultProps,
//     ...suppliedProps,
//   };

//   const { absolute, amount, classes, color, decorate, prefix } = props;
//   const zeroColor = props.zeroColor || color;
//   const negativeColor = props.negativeColor || color;

//   let textColor = "";
//   if (amount === 0) {
//     textColor = zeroColor;
//   } else if (amount > 0) {
//     textColor = color;
//   } else {
//     textColor = negativeColor;
//   }
//   const className = [textColor, ...classes].join(" ");
//   const percent = absolute ? Math.abs(amount).toFixed(1) : amount.toFixed(1);
//   const copy = decorate ? `${percent}%` : percent;

//   return (
//     <span className={className}>
//       {prefix && `${prefix} `}
//       {copy}
//     </span>
//   );
// };

export { AmountSpan };
