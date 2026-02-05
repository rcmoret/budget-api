import { BudgetItemEvent, BudgetItemTransaction } from "@/types/budget";
import { Row, RowStylingProps } from "@/components/common/Row";
import { dateParse } from "@/lib/DateFormatter";
import { Cell } from "@/components/common/Cell";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Link } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { useAppConfigContext } from "@/components/layout/Provider";
import { useBudgetDashboardItemContext } from "./context_provider";

const isEvent = (detail: BudgetItemEvent | BudgetItemTransaction) => {
  return !Object.keys(detail).includes("accountName");
};

type LineItemProps = {
  detail: BudgetItemEvent | BudgetItemTransaction;
  budgeted: number;
  remaining: number;
};

const EventLineItem = (props: { lineItemProps: LineItemProps }) => {
  const event = props.lineItemProps.detail as BudgetItemEvent;

  return (
    <>
      <Row styling={{ flexAlign: "justify-between" }}>
        <div className="text-base">{event.typeName}</div>
        <div className="text-base w-6/12 text-right">
          <AmountSpan amount={event.amount} />
        </div>
      </Row>
      <Row styling={{ flexAlign: "justify-end" }}>
        <div className="text-right">{dateParse(event.createdAt)}</div>
      </Row>
      <Row
        styling={{ flexDirection: "flex-col", margin: "mt-2", padding: "py-2" }}
      >
        <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
          <Cell styling={{ width: "w-6/12" }}>Budgeted</Cell>
          <Cell
            styling={{
              fontWeight: "font-bold",
              width: "w-6/12",
              textAlign: "text-right",
            }}
          >
            <AmountSpan amount={props.lineItemProps.budgeted} />
          </Cell>
        </Row>
        <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
          <Cell styling={{ width: "w-6/12" }}>Remaining</Cell>
          <Cell
            styling={{
              fontWeight: "font-bold",
              width: "w-6/12",
              textAlign: "text-right",
            }}
          >
            <AmountSpan amount={props.lineItemProps.remaining} />
          </Cell>
        </Row>
      </Row>
    </>
  );
};

const DetailLineItem = ({
  lineItemProps,
}: {
  lineItemProps: LineItemProps;
}) => {
  const wrapperProps: RowStylingProps = {
    flexWrap: "flex-wrap",
    flexAlign: "justify-between",
    padding: "px-2 md:px-8 pt-4",
    fontSize: "text-xs",
  };

  if (isEvent(lineItemProps.detail)) {
    return (
      <Row styling={wrapperProps}>
        <div className="w-full border-t border-blue-200 mb-2"></div>
        <EventLineItem lineItemProps={lineItemProps} />
      </Row>
    );
  } else {
    return (
      <Row styling={wrapperProps}>
        <div className="w-full border-t border-blue-200 mb-2"></div>
        <TransactionDetailLineItem lineItemProps={lineItemProps} />
      </Row>
    );
  }
};

const TransactionDetailLineItem = (props: { lineItemProps: LineItemProps }) => {
  const { detail } = props.lineItemProps;
  const transactionDetail = detail as BudgetItemTransaction;

  const dateString = transactionDetail.clearanceDate
    ? dateParse(transactionDetail.clearanceDate)
    : "pending";

  const { appConfig } = useAppConfigContext();
  const { month, year } = appConfig.budget.data;
  const accounts = appConfig.accounts;
  const href = (name: string) => {
    const acct = accounts.find((a) => a.name === name);
    if (!!acct) {
      return UrlBuilder({
        name: "AccountTransactions",
        accountSlug: acct.slug,
        month,
        year,
        anchor: transactionDetail.key,
      });
    } else {
      return "";
    }
  };

  return (
    <>
      <Row styling={{ flexAlign: "justify-between" }}>
        <div className="text-base">
          <Link href={href(transactionDetail.accountName)}>
            {transactionDetail.description}
          </Link>
        </div>
        <div className="text-base w-6/12 text-right">
          <AmountSpan amount={transactionDetail.amount} />
        </div>
      </Row>
      <Row styling={{ flexAlign: "justify-between" }}>
        <div>{transactionDetail.accountName}</div>
        <div>{dateString}</div>
      </Row>
      <Row
        styling={{ flexDirection: "flex-col", margin: "mt-2", padding: "py-2" }}
      >
        <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
          <Cell styling={{ width: "w-6/12" }}>Budgeted</Cell>
          <Cell
            styling={{
              fontWeight: "font-bold",
              width: "w-6/12",
              textAlign: "text-right",
            }}
          >
            <AmountSpan amount={props.lineItemProps.budgeted} />
          </Cell>
        </Row>
        <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
          <Cell styling={{ width: "w-6/12" }}>Remaining</Cell>
          <Cell
            styling={{
              fontWeight: "font-bold",
              width: "w-6/12",
              textAlign: "text-right",
            }}
          >
            <AmountSpan amount={props.lineItemProps.remaining} />
          </Cell>
        </Row>
      </Row>
    </>
  );
};

const ItemDetailHistory = ({
  details,
}: {
  details: Array<BudgetItemEvent | BudgetItemTransaction>;
}) => {
  const { item } = useBudgetDashboardItemContext();
  let budgeted = 0;
  let difference = 0;
  const decoratedDetails: Array<LineItemProps> = details.map((detail) => {
    if (isEvent(detail)) {
      budgeted -= detail.amount;
      difference = -detail.amount + difference;
    } else {
      difference += detail.amount;
    }
    const remaining = item.isExpense
      ? Math.max(0, difference)
      : Math.min(0, difference);

    return {
      detail,
      budgeted,
      difference,
      remaining,
    };
  });

  return (
    <Row styling={{ flexWrap: "flex-wrap" }}>
      {decoratedDetails.map((lineItemProps) => (
        <DetailLineItem
          key={lineItemProps.detail.key}
          lineItemProps={lineItemProps}
        />
      ))}
    </Row>
  );
};

export { ItemDetailHistory };
