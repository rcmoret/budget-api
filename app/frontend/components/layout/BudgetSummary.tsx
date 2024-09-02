import React from "react";

import { MonthYearNav } from "@/components/layout/MonthYearNav";
import { ButtonStyleLink } from "@/components/common/Link";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { DateFormatter, dateParse } from "@/lib/DateFormatter";
import { AccountBudgetSummary, SelectedAccount } from "@/types/budget";

interface ComponentProps {
  budget: AccountBudgetSummary;
  baseUrl: string;
  children: React.ReactNode;
  titleComponent: React.ReactNode;
}

const BudgetSummary = (props: ComponentProps) => {
  const { budget, baseUrl } = props;
  const {
    daysRemaining,
    firstDate,
    isCurrent,
    lastDate,
    month,
    totalDays,
    year,
  } = budget;

  const prevMonth =
    month === 1
      ? {
        month: 12,
        year: year - 1,
      }
      : {
        month: month - 1,
        year,
      };
  const nextMonth =
    month === 12
      ? {
        month: 1,
        year: year + 1,
      }
      : {
        month: month + 1,
        year,
      };
  const visitNextUrl = `${baseUrl}/${nextMonth.month}/${nextMonth.year}`;
  const visitPrevUrl = `${baseUrl}/${prevMonth.month}/${prevMonth.year}`;

  return (
    <Row
      styling={{
        flexWrap: "flex-wrap",
        padding: "p-1",
      }}
    >
      <Cell
        styling={{
          width: "w-full",
          padding: "p-1",
          rounded: "rounded",
          flexWrap: "flex-wrap",
          margin: "mb-2 mr-2",
        }}
      >
        <div className="text-xl">{props.titleComponent}</div>
        <div className="w-full">
          {dateParse(firstDate, {
            format: "monthDay",
          })}{" "}
          to{" "}
          {dateParse(lastDate, {
            format: "monthDay",
          })}
        </div>
        {isCurrent && (
          <div className="w-full">
            <Point>Days Remaining: {daysRemaining}</Point>
          </div>
        )}
        <div className="w-full">
          <Point>Total Days: {totalDays}</Point>
        </div>
        <Row
          styling={{
            flexAlign: "justify-between",
          }}
        >
          <ButtonStyleLink href={visitPrevUrl}>
            <Icon name="angle-double-left" />{" "}
            {DateFormatter({
              month: prevMonth.month,
              year: prevMonth.year,
              format: "shortMonthYear",
            })}
          </ButtonStyleLink>
          <ButtonStyleLink href={visitNextUrl}>
            {DateFormatter({
              month: nextMonth.month,
              year: nextMonth.year,
              format: "shortMonthYear",
            })}{" "}
            <Icon name="angle-double-right" />
          </ButtonStyleLink>
        </Row>
        {props.children}
      </Cell>
    </Row>
  );
};

const BudgetSummaryTitleComponent = (props: {
  month: number;
  year: number;
}) => (
  <div className="w-full flex justify-between text-2xl underline">
    Budget -{" "}
    {DateFormatter({
      ...props,
      format: "monthYear",
    })}
  </div>
);

interface TitleProps {
  accountName: string;
  month: number;
  year: number;
}

const AccountTransactionsSummaryTitleComponent = (props: TitleProps) => (
  <div>
    <div className="underline">{props.accountName}</div>
    <span>
      Transactions -{" "}
      {DateFormatter({
        month: props.month,
        year: props.year,
        format: "monthYear",
      })}
    </span>
  </div>
);

type SummaryProps = {
  data: AccountBudgetSummary | undefined;
  selectedAccount: SelectedAccount | undefined;
}

const Summary = (props: SummaryProps) => {
  if (!!props.data && !!props.selectedAccount?.metadata) {
    return null
  } else if (props.data) {
    const baseUrl = "/budget"
    const { month, year } = props.data

    return (
      <BudgetSummary
        budget={props.data}
        baseUrl={baseUrl}
        titleComponent={<BudgetSummaryTitleComponent month={month} year={year} />}
      >
        <MonthYearNav
          baseUrl={baseUrl}
          month={month}
          year={year}
        />
      </BudgetSummary>
    )
  } else if (props.selectedAccount) {
    const { metadata, slug, name } = props.selectedAccount
    const { month, year } = metadata
    const baseUrl = `/accounts/${slug}/transactions`

    return (
      <BudgetSummary
        budget={metadata}
        baseUrl={baseUrl}
        titleComponent={<AccountTransactionsSummaryTitleComponent accountName={name} month={month} year={year} />}
      >
        <MonthYearNav
          baseUrl={baseUrl}
          month={month}
          year={year}
        />
      </BudgetSummary>
    )
  } else {
    return null
  }
}

export { Summary };
