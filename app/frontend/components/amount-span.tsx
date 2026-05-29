import { moneyFormatter } from "@/lib/money-formatter";
import { color } from "d3";

const BaseColor = "text-content";
const NegativeColor = "text-error";
const PositiveColor = "text-success";

type ColorizeOption = "none" | "normal" | "reverse";

interface ComponentProps {
  absolute?: boolean;
  amount: number;
  classes?: string[];
  colorize?: ColorizeOption;
  decorate?: boolean;
  showCents?: boolean;
  prefix?: string;
}

const AmountSpan = (suppliedProps: ComponentProps) => {
  const defaultProps = {
    absolute: false,
    amount: 0,
    classes: [],
    color: "text-content",
    decorate: true,
    prefix: "",
  };

  const props = {
    ...defaultProps,
    ...suppliedProps,
  };
  const { absolute, amount, classes, decorate, prefix } = props;

  const colorize: ColorizeOption = props.colorize || "none";

  let textColor = "";
  console.log({ colorize });
  if (amount === 0 || colorize === "none") {
    textColor = BaseColor;
  } else if (amount > 0) {
    textColor = colorize === "normal" ? PositiveColor : NegativeColor;
  } else {
    textColor = colorize === "normal" ? NegativeColor : PositiveColor;
  }
  const className = [textColor, "text-right", ...classes].join(" ");

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
