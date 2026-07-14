import { useBudgetItemContext } from "./context-provider";
import { AmountSpan } from "@/components/amount-span";

const GenericDetail = (props: {
  bgColor: "bg-prev-budgeted" | "bg-secondary";
  cents: number;
  label: string;
  percent: number;
}) => {
  const dotClassName = [props.bgColor, "w-1.5", "h-1.5", "rounded-full"].join(
    " ",
  );

  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-2 items-center">
        <div className={dotClassName}></div>
        <div>{props.label}</div>
      </div>
      <div className="flex flex-end text-right gap-1">
        <AmountSpan amount={props.cents} absolute={true} />
        <div className="text-right">({props.percent}%)</div>
      </div>
    </div>
  );
};

const PreviouslyBudgetedDetails = () => {
  const { item } = useBudgetItemContext();
  const { previouslyBudgeted, previouslyBudgetedPercentage } = item;

  return (
    <GenericDetail
      label="Previously Budgeted"
      bgColor="bg-prev-budgeted"
      cents={previouslyBudgeted.cents}
      percent={previouslyBudgetedPercentage}
    />
  );
};

const CurrentlyBudgetedDetails = () => {
  const { item } = useBudgetItemContext();
  const { currentlyBudgeted, currentlyBudgetedPercentage } = item;

  return (
    <GenericDetail
      label="Currently Budgeted"
      bgColor="bg-secondary"
      cents={currentlyBudgeted.cents}
      percent={currentlyBudgetedPercentage}
    />
  );
};

const ItemCompositionDetails = () => {
  const { item } = useBudgetItemContext();
  const previouslyBudgetedPercentage = `${item.previouslyBudgetedPercentage}%`;
  const currentlyBudgetedPercentage = `${item.currentlyBudgetedPercentage}%`;

  if (item.currentlyBudgetedPercentage === 100) {
    return null;
  }

  const className = [
    "grid",
    "grid-cols-[1fr_1fr]",
    "gap-8",
    "text-xs",
    "px-1",
    "items-center",
    "pb-2",
    ...(item.isVariable ? ["border-t", "border-primary/20", "pt-2"] : []),
  ].join(" ");

  return (
    <>
      <div className={className}>
        <PreviouslyBudgetedDetails />
        <CurrentlyBudgetedDetails />
      </div>
      <div className="w-full px-1">
        <div className="h-1.5 w-full overflow-hidden rounded-lg flex flex-row">
          <div
            className="h-1.5 bg-prev-budgeted"
            style={{ width: previouslyBudgetedPercentage }}
            title={previouslyBudgetedPercentage}
          ></div>
          <div
            className="h-1.5 bg-secondary"
            style={{ width: currentlyBudgetedPercentage }}
            title={currentlyBudgetedPercentage}
          ></div>
        </div>
      </div>
    </>
  );
};

export { ItemCompositionDetails };
