import { MonetaryAmount } from "@/types/amount";
import { AmountSpan } from "./amount-span";

const Row = (props: {
  index: number;
  label: string;
  amount: MonetaryAmount;
}) => {
  const { index, label, amount } = props;

  const rowClassName = [
    "flex",
    "justify-between",
    "w-full",
    ...(index === 3 ? ["border-t", "border-secondary", "pt-2"] : []),
  ].join(" ");

  return (
    <div className={rowClassName}>
      <div>{label}</div>
      <div>
        <AmountSpan amount={amount.cents} colorize="normal" />
      </div>
    </div>
  );
};

type ComponentProps = {
  label: string;
  values: Array<{
    key: string;
    label: string;
    amount: MonetaryAmount;
  }>;
};

const BudgetSummaryComponent = (props: ComponentProps) => {
  return (
    <div>
      <div className="text-lg">{props.label}</div>
      <div className="text-sm grid gap-0 py-2 pl-4 pr-2 bg-base-200 rounded shadow-md">
        {props.values.map((tuple, index) => (
          <Row
            key={tuple.key}
            index={index}
            label={tuple.label}
            amount={tuple.amount}
          />
        ))}
      </div>
    </div>
  );
};

export { BudgetSummaryComponent };
