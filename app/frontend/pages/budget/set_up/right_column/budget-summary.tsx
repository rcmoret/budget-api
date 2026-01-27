import { AmountSpan } from "@/components/common/AmountSpan";
import { useSetupEventsFormContext } from "@/pages/budget/set_up";

type FontSizeType = "sm" | "base" | "xl";

const AmountComponent = (props: { amount: number }) => {
  return (
    <div>
      <AmountSpan
        amount={props.amount}
        zeroColor="text-black"
        color="text-green-600"
        negativeColor="text-red-400"
      />
    </div>
  );
};

const BudgetSummaryLine = (props: {
  label: string;
  fontSize: FontSizeType;
  children: React.ReactNode;
  bgColor: string;
  showBorder?: boolean;
}) => {
  const { metadata } = useSetupEventsFormContext();
  const { isSubmittable } = metadata;
  const showBorder = !!props.showBorder;
  const borderColor = isSubmittable ? "border-blue-200" : "border-gray-300";

  const className = [
    "w-full",
    "flex",
    "flex-row",
    "justify-between",
    "px-2",
    props.bgColor,
    ...(showBorder ? ["border-t", borderColor, "pt-1"] : []),
    `text-${props.fontSize}`,
  ].join(" ");

  return (
    <div className={className}>
      <div>{props.label}</div>
      {props.children}
    </div>
  );
};

const BudgetSummary = () => {
  const { groups, metadata } = useSetupEventsFormContext();
  const { isSubmittable } = metadata;
  const totalBudgeted = metadata.budgetTotal;
  const {
    revenues: {
      metadata: { isSelected: revenuesSelected },
    },
    monthlyExpenses: {
      metadata: { isSelected: monthlySelected },
    },
    dayToDayExpenses: {
      metadata: { isSelected: dayToDaySelected },
    },
  } = groups;

  const fontSizes: Record<string, FontSizeType> = {
    revenues: revenuesSelected ? "xl" : "base",
    monthly: monthlySelected ? "xl" : "base",
    dayToDay: dayToDaySelected ? "xl" : "base",
  };

  const baseBg = isSubmittable ? "bg-blue-20" : "bg-gray-50";
  const selectedBg = isSubmittable ? "bg-blue-80" : "bg-gray-100";

  const bgs = {
    revenues: revenuesSelected ? selectedBg : baseBg,
    monthly: monthlySelected ? selectedBg : baseBg,
    dayToDay: dayToDaySelected ? selectedBg : baseBg,
  };

  return (
    <div className={`flex w-96 flex-col rounded p-2 gap-1 ${baseBg} shadow-md`}>
      <BudgetSummaryLine
        label="Revenues"
        fontSize={fontSizes.revenues}
        bgColor={bgs.revenues}
      >
        <AmountComponent amount={groups.revenues.metadata.sum} />
      </BudgetSummaryLine>
      <BudgetSummaryLine
        label="Monthly Expenses"
        fontSize={fontSizes.monthly}
        bgColor={bgs.monthly}
      >
        <AmountComponent amount={groups.monthlyExpenses.metadata.sum} />
      </BudgetSummaryLine>
      <BudgetSummaryLine
        label="Day to Day Expenses"
        fontSize={fontSizes.dayToDay}
        bgColor={bgs.dayToDay}
      >
        <AmountComponent amount={groups.dayToDayExpenses.metadata.sum} />
      </BudgetSummaryLine>
      <BudgetSummaryLine
        label={`${metadata.month}/${metadata.year}`}
        fontSize="base"
        showBorder={true}
        bgColor={baseBg}
      >
        <AmountComponent amount={totalBudgeted} />
      </BudgetSummaryLine>
    </div>
  );
};

export { BudgetSummary };
