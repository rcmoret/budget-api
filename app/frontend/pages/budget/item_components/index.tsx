import React, { useContext, useState } from "react";

import { BudgetItem, BudgetItemEvent, BudgetItemTransaction } from "@/types/budget";
import { Row, StripedRow } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { ActionAnchorTag } from "@/components/common/Link";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Point } from "@/components/common/Symbol";
import { AppConfigContext } from "@/components/layout/Provider";

import { clearedItems, sortDetails } from "@/lib/models/budget-items"
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
    return <TransactionDetailLineItem lineItemProps={lineItemProps} />
  }
}
const TransactionDetailLineItem = (props: { lineItemProps: LineItemProps }) => {
  const { detail } = props.lineItemProps
  const transactionDetail = detail as BudgetItemTransaction

  const dateString = transactionDetail.clearanceDate ? 
    dateParse(transactionDetail.clearanceDate) :
    "pending"

  return (
    <Row styling={{
      flexWrap: "flex-wrap",
      flexAlign: "justify-between",
      padding: "px-8",
      fontSize: "text-xs",
      border: "border-t border-gray-500 border-solid"
    }}>
      <Row>
        <Cell styling={{ width: "w-6/12" }}>
          <div>{dateString}</div>
          <div>{transactionDetail.accountName}</div>
        </Cell>
        <Cell styling={{ width: "w-6/12", textAlign: "text-right" }}>
          <AmountSpan amount={transactionDetail.amount} />
        </Cell>
      </Row>
      <Row>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12" }}>
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
            <Cell styling={{ width: "w-6/12", textAlign: "text-right" }}>
              <AmountSpan amount={props.lineItemProps.remaining} />
            </Cell>
          </Row>
        </Cell>
      </Row>
    </Row>
  )
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
  let details: Array<BudgetItemEvent | BudgetItemTransaction> = []
  if (clearedItems(item)) {
    details = events.sort(sortDetails)
  } else {
    details = [...events, ...transactionDetails].sort(sortDetails)
  }

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

const ItemContainer = (props: { children?: React.ReactNode, item: BudgetItem }) => {
  const { children, item } = props
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
      <ItemDetails item={item} showDetails={showDetails} />
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

const ClearedMonthItem = ({ item }: { item: BudgetItem }) => {
  const transactionDetail = item.transactionDetails[0]

  if (!transactionDetail) { return }

  const dateString = transactionDetail.clearanceDate ? 
    dateParse(transactionDetail.clearanceDate) :
    "pending"

  const difference = transactionDetail.amount - item.amount

  return (
    <ItemContainer item={item}>
      <Row styling={{
        flexAlign: "justify-between",
        fontSize: "text-sm",
        padding: "px-8 pb-2",
        border: "border-b gray-600 border-solid"
      }}>
        <Cell styling={{ width: "w-6/12" }}>
          <div>{dateString}</div>
          <div>{transactionDetail.accountName}</div>
        </Cell>
        <div>
          <AmountSpan amount={transactionDetail.amount} />
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
        <Cell styling={{ width: "w-6/12", textAlign: "text-right" }}>
          <AmountSpan
            amount={difference}
            absolute={true}
            color="text-green-800"
            negativeColor="text-red-700"
            zeroColor="text-black"
          />
        </Cell>
      </Row>
    </ItemContainer>
  )
}

const PendingMonthItem = (props: { item: BudgetItem }) => {
  return (
    <ItemContainer item={props.item} />
  )
}

const DayToDayItem = ({ item }: { item: BudgetItem }) => {
  return (
    <ItemContainer item={item}>
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
