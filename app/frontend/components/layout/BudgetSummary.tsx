import React, { ChangeEvent, useState } from "react";
import { PageData } from "@/components/layout/Header";
import { useForm } from "@inertiajs/inertia-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO as parseIsoDate } from "date-fns";

import { AccountBudgetSummary, SelectedAccount } from "@/types/budget";
import { ActionAnchorTag } from "@/components/common/Link";
import { ButtonStyleLink } from "@/components/common/Link";
import { Cell } from "@/components/common/Cell";
import { DateFormatter, dateParse } from "@/lib/DateFormatter";
import { Icon } from "@/components/common/Icon";
import { MonthYearNav } from "@/components/layout/MonthYearNav";
import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { buildQueryParams } from "@/lib/redirect_params";
import { UrlBuilder } from "@/lib/UrlBuilder";

const DateDiv = ({ date }: { date: string }) => {
  return (
    <div>
      {dateParse(date, { format: "monthDay" })}
    </div>
  )
}

type DateFormProps = {
  firstDate: string;
  lastDate: string;
  month: number;
  redirectSegments: string[];
  toggleForm: () => void;
  year: number;
}

const DateForm = (props: DateFormProps) => {
  const { month, year } = props

  const { processing, transform, data, setData, put } = useForm({
    startDate: props.firstDate,
    endDate: props.lastDate
  })

  // @ts-ignore
  transform((data) => {
    return { interval: data }
  })

  const queryParams = buildQueryParams(props.redirectSegments)

  const handleStartDateChange = (input: Date | null) => {
    setData("startDate", (input?.toISOString() || ""))
  }
  const handleEndDateChange = (input: Date | null) => {
    setData("endDate", (input?.toISOString() || ""))
  }

  const formUrl = UrlBuilder({
    name: "BudgetShow",
    month,
    year,
    queryParams
  })

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    put(formUrl, { onSuccess: () => props.toggleForm() })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="w-full flex flex-wrap gap-2 items-center py-2">
        <div className="w-full">
          <DatePicker
            selected={parseIsoDate(data.startDate)}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="w-full">to</div>
        <div className="w-full">
          <DatePicker
            selected={parseIsoDate(data.endDate)}
            onChange={handleEndDateChange}
          />
        </div>
        <div className="flex justify-between flex-row md:w-4/12 w-6/12">
          <div>
            <button type="submit" >
              <span className="text-green-700">
                <Icon name="check-circle" />
              </span>
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={props.toggleForm}
              disabled={processing}
            >
              <span className="text-red-600">
                <Icon name="times-circle" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

const DateComponent = ({ firstDate, lastDate, redirectSegments, month, year }:
  { firstDate: string, lastDate: string, redirectSegments: string[], month: number, year: number }) => {
  const [showDateForm, setShowDateForm] = useState(false)
  const toggleForm = () => setShowDateForm(!showDateForm)

  if (!showDateForm) {
    return (
      <div className="w-full flex gap-2 items-center">
        <DateDiv date={firstDate} />
        <div>to</div>
        <DateDiv date={lastDate} />
        <ActionAnchorTag onClick={toggleForm}>
          <span className="text-blue-600 text-xs">
            <Icon name="edit" />
          </span>
        </ActionAnchorTag>
      </div>
    )
  } else {
    return (
      <DateForm
        firstDate={firstDate}
        lastDate={lastDate}
        month={month}
        redirectSegments={redirectSegments}
        toggleForm={toggleForm}
        year={year}
      />
    )
  }
}

interface ComponentProps {
  budget: AccountBudgetSummary;
  baseUrl: string;
  children: React.ReactNode;
  redirectSegments: string[];
  titleComponent: React.ReactNode;
}

const BudgetSummary = (props: ComponentProps) => {
  const { budget, baseUrl, redirectSegments } = props;
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
        <DateComponent
          firstDate={firstDate}
          lastDate={lastDate}
          redirectSegments={redirectSegments}
          month={month}
          year={year}
        />
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

const BudgetSetUpTitleComponent = (props: {
  month: number;
  year: number;
}) => {
  return (
    <div className="w-full flex justify-between text-2xl underline">
      Planning: {" "}
      {DateFormatter({
        ...props,
        format: "monthYear",
      })}
    </div>
  )
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
  metadata: {
    namespace: string;
    prevSelectedAccountPath: string | undefined;
    page?: PageData;
  };
}

const Summary = (props: SummaryProps) => {
  if (!!props.data && !!props.selectedAccount?.metadata && !!props.metadata.page) {
    return null
  } else if (props.metadata.page?.name === "budget/set-up" && props.data) {
    const baseUrl = "/budget"
    const { month, year } = props.metadata.page
    return (
      <BudgetSummary
        budget={props.data}
        baseUrl={baseUrl}
        redirectSegments={["budget", String(month), String(year), "set-up"]}
        titleComponent={<BudgetSetUpTitleComponent month={Number(month)} year={Number(year)} />}
      >
        <MonthYearNav
          baseUrl={baseUrl}
          month={month}
          year={year}
        />
      </BudgetSummary>
    )

  } else if (props.data) {
    const baseUrl = "/budget"
    const { month, year } = props.data

    return (
      <BudgetSummary
        budget={props.data}
        redirectSegments={["budget", String(month), String(year)]}
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
    const baseUrl = `/account/${slug}/transactions`

    return (
      <BudgetSummary
        budget={metadata}
        baseUrl={baseUrl}
        redirectSegments={["budget", String(month), String(year)]}
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
