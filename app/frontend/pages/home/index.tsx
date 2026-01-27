import { AmountSpan } from "@/components/common/AmountSpan";
import { Row, StripedRow } from "@/components/common/Row";
import { Link } from "@inertiajs/react";
import { TSimpleAccount } from "@/lib/models/account";
import { byPriority as sortByPriority } from "@/lib/sort_functions";

const AccountLink = ({
  account,
}: {
  account: { name: string; slug: string; balance: number };
}) => {
  return (
    <StripedRow
      oddColor="odd:bg-blue-100"
      evenColor="even:bg-sky-50"
      styling={{ flexAlign: "justify-between", padding: "px-4 py-2" }}
    >
      <div>
        <Link href={`/account/${account.slug}/transactions`}>
          {account.name}
        </Link>
      </div>
      <div>
        <AmountSpan amount={account.balance} />
      </div>
    </StripedRow>
  );
};

type DashboardProps = {
  availableCash: number;
  totalBudgeted: {
    monthlyExpenses: number;
    dayToDayExpenses: number;
    revenues: number;
  };
  totalRemaining: {
    monthlyExpenses: number;
    dayToDayExpenses: number;
    revenues: number;
  };
  spent: {
    monthlyExpenses: number;
    dayToDayExpenses: number;
    revenues: number;
  };
  accounts: Array<TSimpleAccount>;
};

const Home = (props: { dashboard: DashboardProps }) => {
  const { accounts, totalBudgeted, totalRemaining, spent } = props.dashboard;

  return (
    <div className="w-full flex flex-col gap-4 px-4 py-2">
      <div className="text-2xl">Dashboard</div>
      <div className="text-lg">Snapshot</div>
      <div className="md:w-6/12 flex flex-row flex-wrap justify-between text-sm">
        <div className="w-3/12"></div>
        <div className="w-3/12 text-right">budgeted</div>
        <div className="w-3/12 text-right">spent / deposited</div>
        <div className="w-3/12 text-right">remaining</div>
      </div>
      <div className="md:w-6/12 flex flex-row flex-wrap justify-between text-sm">
        <StripedRow
          oddColor="odd:bg-cyan-50"
          evenColor="even:bg-cyan-100"
          styling={{ padding: "p-2", flexAlign: "justify-between" }}
        >
          <div className="w-3/12 font-semibold">Revenues</div>
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
        <StripedRow
          oddColor="odd:bg-cyan-50"
          evenColor="even:bg-cyan-100"
          styling={{ padding: "p-2", flexAlign: "justify-between" }}
        >
          <div className="w-3/12 font-semibold">Monthly Expenses</div>
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
        <StripedRow
          oddColor="odd:bg-cyan-50"
          evenColor="even:bg-cyan-100"
          styling={{ padding: "p-2", flexAlign: "justify-between" }}
        >
          <div className="w-3/12 font-semibold">Day-to-Day Expenses</div>
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
      <Row styling={{ flexDirection: "flex-col" }}>
        <div className="text-lg">Accounts</div>
        <div className="text-sm md:w-4/12">
          {accounts.sort(sortByPriority).map((account) => {
            return <AccountLink key={account.key} account={account} />;
          })}
        </div>
      </Row>
    </div>
  );
};

export default Home;
