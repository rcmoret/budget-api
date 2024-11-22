import { DiscretionaryData } from "@/types/budget";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Row } from "@/components/common/Row";

const Discretionary = (props: { data: DiscretionaryData }) => {
  const { amount, overUnderBudget, transactionsTotal } = props.data;

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
        <div className="w-4/12 text-right">
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
        <div className="w-4/12 text-right">
          <AmountSpan
            amount={transactionsTotal}
            color="text-green-800"
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
        <div className="w-4/12 text-right">
          <AmountSpan
            amount={overUnderBudget}
            color="text-green-800"
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
        <div className="w-4/12 text-right">
          <AmountSpan
            amount={amount}
            color="text-green-800"
            negativeColor="text-red-400"
            zeroColor="text-black"
          />
        </div>
      </Row>
    </>
  );
};

export { Discretionary };
