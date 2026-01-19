import { moneyFormatter } from "@/lib/MoneyFormatter";
import { TextColor } from "@/types/components/text-classes";

interface ComponentProps {
  absolute?: boolean;
  amount: number;
  classes?: string[];
  color?: TextColor;
  decorate?: boolean;
  negativeColor?: TextColor;
  showCents?: boolean;
  prefix?: string;
  zeroColor?: TextColor;
}

const AmountSpan = (suppliedProps: ComponentProps) => {
  const defaultProps = {
    absolute: false,
    amount: 0,
    decorate: true,
    color: "text-black",
    classes: [],
    prefix: "",
  };

  const props = {
    ...defaultProps,
    ...suppliedProps,
  };
  const { absolute, amount, classes, color, decorate, prefix } = props;
  const zeroColor = props.zeroColor || color;
  const negativeColor = props.negativeColor || color;

  let textColor = "";
  if (amount === 0) {
    textColor = zeroColor;
  } else if (amount > 0) {
    textColor = color;
  } else {
    textColor = negativeColor;
  }
  const className = [textColor, ...classes].join(" ");

  return (
    <span className={className}>
      {prefix && `${prefix} `}
      {moneyFormatter(amount, {
        absolute,
        decorate,
        showCents: props.showCents ?? true
      })}
    </span>
  );
};

const PercentSpan = (suppliedProps: ComponentProps) => {
  const defaultProps = {
    absolute: false,
    amount: 0,
    decorate: true,
    color: "text-black",
    classes: [],
    prefix: "",
  };

  const props = {
    ...defaultProps,
    ...suppliedProps,
  };

  const { absolute, amount, classes, color, decorate, prefix } = props;
  const zeroColor = props.zeroColor || color;
  const negativeColor = props.negativeColor || color;

  let textColor = "";
  if (amount === 0) {
    textColor = zeroColor;
  } else if (amount > 0) {
    textColor = color;
  } else {
    textColor = negativeColor;
  }
  const className = [textColor, ...classes].join(" ");
  const percent = absolute ? Math.abs(amount).toFixed(1) : amount.toFixed(1)
  const copy = decorate ? `${percent}%` : percent

  return (
    <span className={className}>
      {prefix && `${prefix} `}
      {copy}
    </span>
  );
}

export { AmountSpan, PercentSpan };
