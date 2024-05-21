import React from "react";

import { ButtonStyleLink, Cell, Icon, Point, Row } from "@/components/common";
import { DateFormatter, dateParse } from "@/lib/DateFormatter";
import { AccountBudgetSummary } from "@/types/budget";

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
        border: "border-b border-gray-800 border-solid",
        padding: "p-1",
      }}
    >
      <Cell
        styling={{
          width: "w-full md:w-3/12",
          flexWrap: "flex-wrap",
          margin: "mb-2",
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

export { BudgetSummary };
