import { AmountSpan } from "@/components/common/AmountSpan";

type MonthlyData = {
  month: number;
  year: number;
  budgeted: number;
  transactionsTotal: number;
};

const Bar = (props: MonthlyData & { maxAmount: number }) => {
  const budgetedWidth = (100 * Math.abs(props.budgeted)) / props.maxAmount;
  const spentWidth =
    (100 * Math.abs(props.transactionsTotal)) / props.maxAmount;

  return (
    <div className="w-full text-xs flex flex-row items-center justify-between border-b border-blue-200">
      <div className="w-2/12">
        {props.month}/{props.year}
      </div>
      <div className="w-7/12 flex flex-col gap-0.5">
        <div
          className="h-2 bg-red-300 rounded-lg"
          style={{ width: spentWidth.toFixed(2) + "%" }}
        ></div>
        <div
          className="h-2 bg-green-300 rounded-lg"
          style={{ width: budgetedWidth.toFixed(2) + "%" }}
        ></div>
      </div>
      <div className="w-2/12 flex flex-col gap-0.5 items-end">
        <div className="text-xs">
          <AmountSpan
            amount={props.transactionsTotal}
            absolute={true}
            showCents={false}
          />
        </div>
        <div className="text-xs">
          <AmountSpan
            amount={props.budgeted}
            absolute={true}
            showCents={false}
          />
        </div>
      </div>
    </div>
  );
};

const MonthlyDataChart = (props: { data: Array<MonthlyData> }) => {
  if (!props.data || props.data.length === 0) return;

  const maxAmount = Math.max(
    ...props.data.flatMap(({ budgeted, transactionsTotal }) => {
      return [Math.abs(transactionsTotal), Math.abs(budgeted)];
    }),
  );

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="w-full flex flex-row justify-between">
        <div className="w-2/12"></div>
        <div className="w-7/12 text-xs flex flex-row justify-between border-b border-blue-200">
          <div>
            <AmountSpan amount={0} absolute={true} showCents={false} />
          </div>
          <div>
            <AmountSpan
              amount={maxAmount / 2}
              absolute={true}
              showCents={false}
            />
          </div>
          <div>
            <AmountSpan amount={maxAmount} absolute={true} showCents={false} />
          </div>
        </div>
        <div className="w-2/12"></div>
      </div>
      {props.data.map((monthlyData) => (
        <Bar
          key={`${monthlyData.year}.${monthlyData.month}`}
          maxAmount={maxAmount}
          {...monthlyData}
        />
      ))}
    </div>
  );
};

export { MonthlyDataChart };
