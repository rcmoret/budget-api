import { BudgetItemTransaction } from "@/types/budget";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Row } from "@/components/common/Row";
import { useToggle } from "@/lib/hooks/useToogle";
import { Button } from "@/components/common/Button";
import { dateParse } from "@/lib/DateFormatter";
import { useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";

const TransactionButton = (props: {
  toggleTransactions: () => void;
}) => {
  return (
    <Row styling={{ flexWrap: "flex-wrap", padding: "px-2" }}>
      <Button
        type="button"
        onClick={props.toggleTransactions}
        styling={{ color: "text-blue-400" }}
      >
        Show Transactions
      </Button>
    </Row>
  )
}

const TransactionDetails = (props: {
  toggleTransactions: () => void;
  transactions: BudgetItemTransaction[];
}) => {
  return (
    <Row styling={{ flexWrap: "flex-wrap" }}>
      <Row styling={{ padding: "px-2" }}>
        <Button
          type="button"
          onClick={props.toggleTransactions}
          styling={{ color: "text-blue-400" }}
        >
          Hide Transactions
        </Button>
      </Row>
      {props.transactions.map((transaction) => {
        return (
          <Row>
            <TransactionDetailLineItem
              key={transaction.key}
              transaction={transaction}
            />
          </Row>
        )
      })}
    </Row>
  )
}

const TransactionDetailLineItem = (props: { transaction: BudgetItemTransaction }) => {
  const { transaction } = props

  const dateString = transaction.clearanceDate ? 
    dateParse(transaction.clearanceDate) :
    "pending"

  return (
    <Row styling={{
      flexAlign: "justify-between",
      border: "border-t border-gray-400",
      alignItems: "items-end",
      padding: "px-2 py-1"
    }}>
      <div>
        <div className="hidden">{transaction.key}</div>
        <div className="text-xs">
          Account
        </div>
        <div>
          {transaction.accountName}
        </div>
      </div>
      <div>
        <div className="text-xs">
          {dateString}
        </div>
        <div>
          {transaction.description || <span className="text-gray-600">-</span>}
        </div>
      </div>
      <div>
        <div className="font-bold">
          <AmountSpan amount={transaction.amount}
            zeroColor="text-black"
            color="text-green-600"
            negativeColor="text-red-400"
           />
        </div>
      </div>
    </Row>
  )
}

const Discretionary = () => {
  const { discretionary } = useBudgetDashboardContext()
  const { amount, overUnderBudget, transactionsTotal, transactionDetails: transactions } = discretionary;

  const [transactionsShown, toggleTransactions] = useToggle(false)

  const total = amount - transactionsTotal - overUnderBudget;

  return (
    <>
      <Row
        styling={{
          flexAlign: "justify-between",
          padding: "pl-1 pr-1",
        }}
      >
        <div className="w-6/12 italic">Total</div>
        <div className="w-4/12 text-right font-bold">
          <AmountSpan amount={total} />
        </div>
      </Row>
      <Row
        styling={{
          flexAlign: "justify-between",
          padding: "pl-1 pr-1",
        }}
      >
        <div className="w-6/12 italic">Deposited/Spent</div>
        <div className="w-4/12 text-right font-bold">
          <AmountSpan
            amount={transactionsTotal}
            color="text-green-600"
            negativeColor="text-red-400"
            zeroColor="text-black"
          />
        </div>
      </Row>
      <Row
        styling={{
          flexAlign: "justify-between",
          padding: "pl-1 pr-1",
        }}
      >
        <div className="w-6/12 italic">Over/Under Budget</div>
        <div className="w-4/12 text-right font-bold">
          <AmountSpan
            amount={overUnderBudget}
            color="text-green-600"
            negativeColor="text-red-400"
            zeroColor="text-black"
          />
        </div>
      </Row>
      <Row
        styling={{
          flexAlign: "justify-between",
          padding: "pl-1 pr-1",
        }}
      >
        <div className="w-6/12 italic">Remaining</div>
        <div className="w-4/12 text-right font-bold">
          <AmountSpan
            amount={amount}
            color="text-green-600"
            negativeColor="text-red-400"
            zeroColor="text-black"
          />
        </div>
      </Row>
      {!transactionsShown ?
        <TransactionButton toggleTransactions={toggleTransactions} /> :
        <TransactionDetails
          toggleTransactions={toggleTransactions}
          transactions={transactions}
        />}
    </>
  );
};

export { Discretionary };
