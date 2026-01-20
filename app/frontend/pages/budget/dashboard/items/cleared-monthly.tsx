import {  ItemContainer } from ".";
import { useBudgetDashboardItemContext } from "@/pages/budget/dashboard/items/context_provider";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { AmountSpan } from "@/components/common/AmountSpan";
import { dateParse } from "@/lib/DateFormatter";

const ClearedMonthItem = () => {
  const { item } = useBudgetDashboardItemContext()
  const transactionDetail = item.transactionDetails[0]

  if (!transactionDetail) { return }

  const dateString = transactionDetail.clearanceDate ? 
    dateParse(transactionDetail.clearanceDate) :
    "pending"

  const difference = transactionDetail.amount - item.amount

  return (
    <ItemContainer>
      <Row styling={{
        flexAlign: "justify-between",
        fontSize: "text-sm",
        padding: "px-8 pb-2",
        border: "border-b gray-800 border-solid"
      }}>
        <Cell styling={{ width: "w-6/12" }}>
          <div>{dateString}</div>
          <div>{transactionDetail.accountName}</div>
        </Cell>
        <div className="font-bold">
          <AmountSpan color="text-gray-800" amount={transactionDetail.amount} />
        </div>
      </Row>
      <Row styling={{
        flexAlign: "justify-between",
        fontSize: "text-sm",
        padding: "px-8 pt-2",
      }}>
        <Cell styling={{ width: "w-6/12" }}>
          Difference
        </Cell>
        <Cell styling={{ fontWeight: "font-bold", width: "w-6/12", textAlign: "text-right" }}>
          <AmountSpan
            amount={difference}
            absolute={true}
            color="text-gray-800"
            negativeColor="text-red-400"
            zeroColor="text-black"
          />
        </Cell>
      </Row>
    </ItemContainer>
  )
}

export { ClearedMonthItem }
