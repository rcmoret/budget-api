import React, { useContext, useState } from "react";

import { BudgetItem, BudgetItemDetail, BudgetItemEvent, BudgetItemTransaction } from "@/types/budget";
import { Row, StripedRow } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { ActionAnchorTag } from "@/components/common/Link";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Point } from "@/components/common/Symbol";
import { AppConfigContext } from "@/components/layout/Provider";

import { sortDetails } from "@/lib/models/budget-items"
import { dateParse } from "@/lib/DateFormatter";

type DetailProps = {
  item: BudgetItem;
  showDetails: boolean
}

const isEvent = (detail: BudgetItemEvent | BudgetItemTransaction) => {
  return !Object.keys(detail).includes("accountName")
}

type LineItemProps = {
  detail: BudgetItemEvent | BudgetItemTransaction;
  budgeted: number;
  remaining: number;
}

const ItemDetailHistory = ({ details, isExpense }: { details: Array<BudgetItemEvent | BudgetItemTransaction>, isExpense: boolean }) => {
  let budgeted = 0
  let difference = 0
  const decoratedDetails: Array<LineItemProps> = details.map((detail) => {
    if (isEvent(detail)) {
      budgeted += detail.amount
      difference -= detail.amount
    } else {
      difference += detail.amount
    }
    const remaining = isExpense ? Math.max(0, difference)  : Math.min(0, difference)

    return {
      detail,
      budgeted,
      difference,
      remaining
    }
  })

  return (
    <Row styling={{ flexWrap: "flex-wrap", border: "border-t border-gray-500 border-solid"}}>
      {decoratedDetails.map((lineItemProps) => (
        <DetailLineItem lineItemProps={lineItemProps} />
      ))}
    </Row>
  )
}
const DetailLineItem = ({ lineItemProps }: { lineItemProps: LineItemProps }) => {
  if (isEvent(lineItemProps.detail)) {
    return <EventLineItem lineItemProps={lineItemProps} />
  } else {
    return null
  }
}

const EventLineItem = (props: { lineItemProps: LineItemProps }) => {
  const event = props.lineItemProps.detail as BudgetItemEvent

  return (
    <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between", border: "border-t border-gray-500 border-solid"}}>
      <Row styling={{ margin: "mb-2", padding: "px-8", border: "border-b border-gray-500 border-solid" }}>
        <Cell styling={{ width: "w-4/12" }}>
          {dateParse(event.createdAt)}
        </Cell>
        <Cell styling={{ width: "w-4/12", textAlign: "text-center" }}>
          {event.typeName}
        </Cell>
        <Cell styling={{ width: "w-4/12", textAlign: "text-right" }}>
          <AmountSpan amount={event.amount} />
        </Cell>
      </Row>
      <Row styling={{ fontSize: "text-xs" }}>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12", padding: "pl-8" }}>
              Budgeted
            </Cell>
            <Cell styling={{ width: "w-6/12", textAlign: "text-right", padding: "pr-8" }}>
              <AmountSpan amount={props.lineItemProps.budgeted} />
            </Cell>
          </Row>
        </Cell>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12", padding: "pl-8" }}>
              Remaining
            </Cell>
            <Cell styling={{ width: "w-6/12", textAlign: "text-right", padding: "pr-8" }}>
              <AmountSpan amount={props.lineItemProps.remaining} />
            </Cell>
          </Row>
        </Cell>
      </Row>
    </Row>
  )
}

const ItemDetails = ({ item, showDetails }: DetailProps) => {
  const { key, events, isExpense, transactionDetails } = item
  const details: Array<BudgetItemEvent | BudgetItemTransaction> = [...events, ...transactionDetails].sort(sortDetails)

  if (!showDetails) { return null }

  return (
    <>
      <Row styling={{ flexWrap: "flex-wrap", border: "border-t border-b border-gray-500 border-solid"}}>
        <div className="w-8/12">
          <strong>Budget Item Details</strong>
        </div>
        <div className="w-4/12 text-right">
          <strong>Key: {key}</strong>
        </div>
      </Row>
      <ItemDetailHistory details={details} isExpense={isExpense} />
    </>
  )
}

const MonthlyDetail = ({ item, showDetails }: DetailProps) => {
  const { key } = item
  if (!showDetails) { return null }

  return (
    <>
      <Row styling={{ flexWrap: "flex-wrap", border: "border-t border-b border-gray-500 border-solid"}}>
        <div className="w-8/12">
          <strong>Budget Item Details</strong>
        </div>
        <div className="w-4/12 text-right">
          <strong>Key: {key}</strong>
        </div>
      </Row>
      <ItemDetails item={item} showDetails={showDetails} />
    </>
  )
}

const ItemContainer = (props: { detailComponent: DetailComponent, children?: React.ReactNode, item: BudgetItem }) => {
  const { children, detailComponent, item } = props
  const [showDetails, updateShowDetails] = useState<boolean>(false)

  const toggleDetails = () => updateShowDetails(!showDetails)

  return (
    <StripedRow styling={{ flexWrap: "flex-wrap"}}>
      <NameRow
        item={item}
        showDetails={showDetails}
        toggleDetails={toggleDetails}
      />
      {children}
      {!!detailComponent && detailComponent({ item, showDetails })}
    </StripedRow>
  )
}

const AccrualRow = ({ item }: { item: BudgetItem }) => {
  const { maturityMonth, maturityYear } = item
  const { appConfig } = useContext(AppConfigContext)
  const { month, year } = appConfig.budget.data

  let upcomingMaturityCopy = ""
  if (month === maturityMonth && year === maturityYear) {
    upcomingMaturityCopy = "Currently Mature"
  } else if (!!maturityYear && !!maturityMonth) {
    upcomingMaturityCopy = `Maturing: ${maturityMonth}/${maturityYear}`
  } else {
    upcomingMaturityCopy = "No upcoming maturity date"
  }

  return (
    <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
      <Cell styling={{ width: "w-6/12" }}>
        <span className="italic text-sm">
          <Point>
            Accruing
          </Point>
        </span>
      </Cell>
      <Cell styling={{ textAlign: "text-right", width: "w-6/12" }}>
        {upcomingMaturityCopy}
      </Cell>
    </Row>
  )
}

type NameRowProps = {
  item: BudgetItem;
  showDetails: boolean;
  toggleDetails: () => void;
}

const NameRow = (props: NameRowProps) => {
  const { item, showDetails, toggleDetails } = props
  const { name, iconClassName, amount, isAccrual } = item
  const caretIcon = showDetails ? "caret-down" : "caret-right"

  return (
    <>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          <ActionAnchorTag onClick={toggleDetails} className="text-blue-800">
            <span className="text-sm">
              <Icon name={caretIcon} />
            </span>
            {" "}
            {name}
          </ActionAnchorTag>
          {" "}
          <Icon name={iconClassName} />
        </Cell>
        <Cell styling={{ textAlign: "text-right", width: "w-4/12" }}>
          <AmountSpan amount={amount} absolute={true} />
        </Cell>
      </Row>
      {isAccrual && <AccrualRow item={item} />}
    </>
  )
}

const ClearedMonthItem = (props: { item: BudgetItem }) => {
  return (
    <ItemContainer item={props.item} detailComponent={MonthlyDetail} />
  )
}

const PendingMonthItem = (props: { item: BudgetItem }) => {
  return (
    <ItemContainer item={props.item} detailComponent={ItemDetails} />
  )
}

const DayToDayItem = ({ item }: { item: BudgetItem }) => {
  return (
    <ItemContainer item={item} detailComponent={ItemDetails}>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          Spent/Deposited
        </Cell>
        <Cell styling={{ textAlign: "text-right", width: "w-4/12" }}>
          <AmountSpan amount={item.spent} absolute={true} />
        </Cell>
      </Row>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          Remaining/Difference
        </Cell>
        <Cell styling={{ textAlign: "text-right", width: "w-4/12" }}>
          <AmountSpan amount={item.remaining} absolute={true} />
        </Cell>
      </Row>
    </ItemContainer>
  )
}

export { ClearedMonthItem, DayToDayItem, PendingMonthItem }
