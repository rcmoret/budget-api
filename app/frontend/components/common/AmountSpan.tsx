import { moneyFormatter } from "@/lib/MoneyFormatter";
import { textBlack, textGreen, textRed } from "@/lib/theme/colors/text";

type AmountColorKey = "red" | "green" | "black";

const colorMap: Record<AmountColorKey, string> = {
  red: textRed,
  green: textGreen,
  black: textBlack,
};

interface ComponentProps {
  absolute?: boolean;
  amount: number;
  classes?: string[];
  positiveColor?: AmountColorKey;
  decorate?: boolean;
  negativeColor?: AmountColorKey;
  showCents?: boolean;
  prefix?: string;
  zeroColor?: AmountColorKey;
}

const AmountSpan = (suppliedProps: ComponentProps) => {
  const defaultProps = {
    absolute: false,
    amount: 0,
    decorate: true,
    positiveColor: "black" as AmountColorKey,
    classes: [],
    prefix: "",
  };

  const props = {
    ...defaultProps,
    ...suppliedProps,
  };
  const { absolute, amount, classes, positiveColor, decorate, prefix } = props;
  const zeroColor = props.zeroColor || positiveColor;
  const negativeColor = props.negativeColor || positiveColor;

  let colorKey: AmountColorKey;
  if (amount === 0) {
    colorKey = zeroColor;
  } else if (amount > 0) {
    colorKey = positiveColor;
  } else {
    colorKey = negativeColor;
  }
  const className = [colorMap[colorKey], ...classes].join(" ");

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

const PercentSpan = (suppliedProps: ComponentProps) => {
  const defaultProps = {
    absolute: false,
    amount: 0,
    decorate: true,
    positiveColor: "black" as AmountColorKey,
    classes: [],
    prefix: "",
  };

  const props = {
    ...defaultProps,
    ...suppliedProps,
  };

  const { absolute, amount, classes, positiveColor, decorate, prefix } = props;
  const zeroColor = props.zeroColor || positiveColor;
  const negativeColor = props.negativeColor || positiveColor;

  let colorKey: AmountColorKey;
  if (amount === 0) {
    colorKey = zeroColor;
  } else if (amount > 0) {
    colorKey = positiveColor;
  } else {
    colorKey = negativeColor;
  }
  const className = [colorMap[colorKey], ...classes].join(" ");
  const percent = absolute ? Math.abs(amount).toFixed(1) : amount.toFixed(1);
  const copy = decorate ? `${percent}%` : percent;

  return (
    <span className={className}>
      {prefix && `${prefix} `}
      {copy}
    </span>
  );
};

export { AmountSpan, PercentSpan };
