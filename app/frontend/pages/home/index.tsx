import { AmountSpan } from "@/components/common/AmountSpan";
import { StripedRow } from "@/components/common/Row";

type DashboardProps = {
  availableCash: number;
  totalBudgeted: {
    monthlyExpenses: number;
    dayToDayExpenses: number;
    revenues: number;
  }
  totalRemaining: {
    monthlyExpenses: number;
    dayToDayExpenses: number;
    revenues: number;
  }
  spent: {
    monthlyExpenses: number;
    dayToDayExpenses: number;
    revenues: number;
  }
}

const Home = (props: { dashboard: DashboardProps }) => {
  const {
    totalBudgeted,
    totalRemaining,
    spent,
  } = props.dashboard

  console.log({ spent })

  return (
    <div className="w-full flex flex-col gap-4 px-4 py-2">
      <div className="text-2xl">
        Dashboard
      </div>
      <div className="text-lg">
        Snapshot
      </div>
      <div className="w-6/12 flex flex-row flex-wrap justify-between">
        <div className="w-3/12">
        </div>
        <div className="w-3/12 text-right">
          budgeted
        </div>
        <div className="w-3/12 text-right">
          spent/deposited
        </div>
        <div className="w-3/12 text-right">
          remaining
        </div>
      </div>
      <div className="w-6/12 flex flex-row flex-wrap justify-between">
        <StripedRow oddColor="odd:bg-cyan-50" evenColor="even:bg-cyan-100" styling={{ padding: "p-2", flexAlign: "justify-between" }}>
          <div className="w-3/12 font-semibold">
           Revenues
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={totalBudgeted.revenues} />
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={spent.revenues} />
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={totalRemaining.revenues} />
          </div>
        </StripedRow>
        <StripedRow oddColor="odd:bg-cyan-50" evenColor="even:bg-cyan-100" styling={{ padding: "p-2", flexAlign: "justify-between" }}>
          <div className="w-3/12 font-semibold">
           Monthly Expenses
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={totalBudgeted.monthlyExpenses} />
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={spent.monthlyExpenses} />
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={totalRemaining.monthlyExpenses} />
          </div>
        </StripedRow>
        <StripedRow oddColor="odd:bg-cyan-50" evenColor="even:bg-cyan-100" styling={{ padding: "p-2", flexAlign: "justify-between" }}>
          <div className="w-3/12 font-semibold">
           Day-to-Day Expenses
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={totalBudgeted.dayToDayExpenses} />
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={spent.dayToDayExpenses} />
          </div>
          <div className="w-3/12 text-right">
            <AmountSpan amount={totalRemaining.dayToDayExpenses} />
          </div>
        </StripedRow>
      </div>
    </div>
  )
};

export default Home;
