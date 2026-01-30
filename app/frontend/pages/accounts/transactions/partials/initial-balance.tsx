import { AmountSpan } from "@/components/common/AmountSpan";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { dateParse } from "@/lib/DateFormatter";
import { ClearanceDateDisplay } from "@/pages/accounts/transactions/partials/clearance-date";

const InitialBalance = (props: {
  index: number;
  balance: number;
  initialDate: string;
}) => {
  const clearanceDate = dateParse(props.initialDate);
  const shortClearanceDate = dateParse(props.initialDate, {
    format: "m/d/yy",
  });

  const isOdd = props.index % 2 === 1;
  const bgColor = isOdd ? "bg-sky-100" : "bg-sky-50";

  return (
    <Row
      styling={{
        backgroundColor: bgColor,
        flexAlign: "justify-start",
        flexWrap: "flex-wrap",
        padding: "px-4 py-2",
      }}
    >
      <div className="flex w-full md:w-6/12">
        <Cell
          styling={{
            width: "w-full",
            flexAlign: "justify-between",
            display: "flex",
            gap: "gap-2",
            flexWrap: "flex-wrap md:flex-nowrap",
          }}
        >
          <ClearanceDateDisplay
            clearanceDate={clearanceDate}
            shortClearanceDate={shortClearanceDate}
          />
          <div className="w-4/12">Balance</div>
          <div className="w-4/12 flex flex-row justify-end gap-12 text-right" />
          <div className="w-full md:w-4/12 flex flex-row justify-between mt-4 md:mt-0">
            <div className="text-sm text-gray-700 md:hidden">Balance</div>
            <div className="w-4/12 md:w-full border-t border-gray-400 text-right text-bold md:border-none">
              <AmountSpan amount={props.balance} negativeColor="red" />
            </div>
          </div>
        </Cell>
      </div>
    </Row>
  );
};

export { InitialBalance };
