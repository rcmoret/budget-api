import { BudgetItem } from "@/types/budget";
import { AmountSpan } from "@/components/amount-span";
import { getBudgetMonth } from "@/pages/budget/month-store";
import { perDiemAmounts } from "./per-diem";

const PerDiemRow = (props: {
  label: string;
  budgeted: number;
  remaining: number;
}) => {
  return (
    <div className="grid grid-cols-subgrid col-span-full">
      <div>{props.label}</div>
      <div className="text-right">
        <AmountSpan amount={props.budgeted} absolute={true} />
      </div>
      <div className="text-right">
        <AmountSpan amount={props.remaining} absolute={true} />
      </div>
    </div>
  );
};

// Budgeted and remaining amounts per day (and per week while at least a
// week remains) for per diem enabled items. Renders nothing once no days
// remain in the month.
const PerDiemDetails = (props: { item: BudgetItem }) => {
  const { item } = props;
  const { totalDays, daysRemaining } = getBudgetMonth();

  if (!item.isPerDiemEnabled) return null;

  const amounts = perDiemAmounts({
    amount: item.amount.cents,
    remaining: item.remaining.cents,
    totalDays,
    daysRemaining,
  });

  if (!amounts) return null;

  return (
    <div className="flex flex-col gap-1 pt-2 border-t border-primary/40">
      <div className="font-medium">Prorated Amounts</div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-1 text-sm">
        <div className="grid grid-cols-subgrid col-span-full text-base-content/70">
          <div></div>
          <div className="text-right">Budgeted</div>
          <div className="text-right">Remaining</div>
        </div>
        <PerDiemRow
          label="Per Day"
          budgeted={amounts.budgetedPerDay}
          remaining={amounts.remainingPerDay}
        />
        {amounts.perWeek && (
          <PerDiemRow
            label="Per Week"
            budgeted={amounts.perWeek.budgeted}
            remaining={amounts.perWeek.remaining}
          />
        )}
      </div>
    </div>
  );
};

export { PerDiemDetails };
