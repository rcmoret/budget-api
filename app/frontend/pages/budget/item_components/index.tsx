import React, { useContext } from "react";

import { BudgetItem, TBudgetItem, BudgetItemEvent, BudgetItemTransaction } from "@/types/budget";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { Button, SubmitButton } from "@/components/common/Button";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Point } from "@/components/common/Symbol";
import { AppConfigContext } from "@/components/layout/Provider";

import { clearedItems, sortDetails } from "@/lib/models/budget-items"
import { dateParse } from "@/lib/DateFormatter";
import { useEventForm } from "@/lib/hooks/useEventsForm";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { inputAmount, AmountInput } from "@/components/common/AmountInput";
import { TChangeForm, DraftChange } from "@/lib/hooks/useDraftEvents";
import { useToggle } from "@/lib/hooks/useToogle";

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
        <Cell styling={{ fontWeight: "font-bold", width: "w-6/12", textAlign: "text-right" }}>
          <AmountSpan amount={transactionDetail.amount} />
        </Cell>
      </Row>
      <Row>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12" }}>
              Budgeted
            </Cell>
            <Cell styling={{ fontWeight: "font-bold", width: "w-6/12", textAlign: "text-right", padding: "pr-8" }}>
              <AmountSpan amount={props.lineItemProps.budgeted} />
            </Cell>
          </Row>
        </Cell>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12", padding: "pl-8" }}>
              Remaining
            </Cell>
            <Cell styling={{ fontWeight: "font-bold", width: "w-6/12", textAlign: "text-right" }}>
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
        <Cell styling={{ fontWeight: "font-bold", width: "w-4/12", textAlign: "text-right" }}>
          <AmountSpan amount={event.amount} />
        </Cell>
      </Row>
      <Row styling={{ fontSize: "text-xs" }}>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12", padding: "pl-8" }}>
              Budgeted
            </Cell>
            <Cell styling={{ fontWeight: "font-bold", width: "w-6/12", textAlign: "text-right", padding: "pr-8" }}>
              <AmountSpan amount={props.lineItemProps.budgeted} />
            </Cell>
          </Row>
        </Cell>
        <Cell styling={{ width: "w-6/12" }}>
          <Row styling={{ flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
            <Cell styling={{ width: "w-6/12", padding: "pl-8" }}>
              Remaining
            </Cell>
            <Cell styling={{ fontWeight: "font-bold", width: "w-6/12", textAlign: "text-right", padding: "pr-8" }}>
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

const ItemContainer = (props: {
  children?: React.ReactNode;
  item: TBudgetItem;
  form: TChangeForm;
  index: number;
}) => {
  const { children, item, form, index } = props
  const [showDetails, toggleDetails] = useToggle(false)

  const openForm = () => form.addChange({
    budgetItemKey: item.key,
    budgetCategoryKey: item.budgetCategoryKey,
    amount: inputAmount({ display: "" })
  })

  const closeForm = () => form.removeChange(item.key)

  return (
    <Row
      styling={{
        flexWrap: "flex-wrap",
        backgroundColor: (index % 2 === 0 ? "bg-sky-50" : "bg-white"),
        color: "text-gray-800",
        gap: "gap-px",
        rounded: "rounded"
      }}
    >
      <NameRow
        item={item}
        showDetails={showDetails}
        toggleDetails={toggleDetails}
      />
      {children}
      {item.isAccrual && <AccrualRow item={item} />}
      <ActionableIcons
        item={item}
        openForm={openForm}
        closeForm={closeForm}
        postEvents={form.post}
        changes={form.changes}
        processing={form.processing}
      />
      <ItemDetails item={item} showDetails={showDetails} />
    </Row>
  )
}

const DeleteButton = ({ item }: { item: BudgetItem }) => {
  const { appConfig } = useContext(AppConfigContext)
  const { month, year } = appConfig.budget.data

  const { post, processing } = useEventForm({
    events: [
      {
        key: generateKeyIdentifier(),
        eventType: "item_delete",
        budgetItemKey: item.key,
        amount: { cents: 0, display: "" },
      }
    ],
    month,
    year
  })

  const onSubmit = () => {
    const formUrl = UrlBuilder({
      name: "BudgetItemEvents",
      month,
      year,
      queryParams: buildQueryParams(["budget", month, year])
    })
    post(formUrl)
  }

  if (!item.isDeletable) {
    return null
  }

  return (
    <form onSubmit={onSubmit}>
      <SubmitButton
        isEnabled={!processing}
        onSubmit={onSubmit}
        styling={{ color: "text-blue-300" }}
      >
        <Icon name="trash" />
      </SubmitButton>
    </form>
  )
}

const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      styling={{ color: "text-blue-300" }}
    >
      <Icon name="edit" />
    </Button>
  )
}

const CloseFormButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      styling={{ color: "text-blue-300" }}
    >
      <Icon name="times-circle" />
    </Button>
  )
}

const EditSubmitButton = (props: {
  postEvents: () => void;
  processing: boolean;
}) => {
  return (
    <SubmitButton isEnabled={!props.processing}  onSubmit={props.postEvents} styling={{ color: "text-blue-300" }}>
      <Icon name="check-circle" />
    </SubmitButton>
  )
}

type ActionableIconsProps = {
  item: TBudgetItem;
  openForm: () => void;
  closeForm: () => void;
  postEvents: () => void;
  processing: boolean;
  changes: DraftChange[];
}

const ActionableIcons = (props: ActionableIconsProps) => {
  const { item, openForm, closeForm, postEvents, processing } = props

  // Lets come back and work on the delete button

  const isSubmittable = !!item.draftItem && props.changes.length === 1

  return (
    <Row styling={{
      padding: "p-2",
      flexAlign: "justify-end",
      alignItems: "items-center",
      gap: "gap-2"
    }}>
      {!!item.draftItem ? <CloseFormButton onClick={closeForm} /> : <EditButton onClick={openForm} />}
      {isSubmittable && <EditSubmitButton postEvents={postEvents} processing={processing} />}

      <DeleteButton item={item} />
    </Row>
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
  item: TBudgetItem;
  showDetails: boolean;
  toggleDetails: () => void;
}

const NameRow = (props: NameRowProps) => {
  const { item, showDetails, toggleDetails } = props
  const { name, iconClassName, amount } = item
  const caretIcon = showDetails ? "caret-down" : "caret-right"
  const absolute = !item.draftItem

  return (
    <>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          <Button 
            type="button"
            onClick={toggleDetails}
            styling={{
              fontWeight: "font-semibold",
              color: "text-gray-800"
            }}
          >
            <span className="text-blue-300 text-sm">
              <Icon name={caretIcon} />
            </span>
            {" "}
            {name}
          </Button>
          {" "}
          <Icon name={iconClassName} />
        </Cell>
        <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-4/12" }}>
          <AmountSpan color="text-gray-800" amount={amount} absolute={absolute} />
        </Cell>
      </Row>
    </>
  )
}

const ClearedMonthItem = ({ item, form, index }: {
  item: BudgetItem,
  form: TChangeForm,
  index: number
}) => {
  const transactionDetail = item.transactionDetails[0]

  if (!transactionDetail) { return }

  const dateString = transactionDetail.clearanceDate ? 
    dateParse(transactionDetail.clearanceDate) :
    "pending"

  const difference = transactionDetail.amount - item.amount

  return (
    <ItemContainer item={item} form={form} index={index}>
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

const PendingMonthItem = (props: {
  item: TBudgetItem,
  form: TChangeForm,
  index: number
}) => {
  const { item, form, index } = props

  if (!item.draftItem || !item.change) {
    return (
      <ItemContainer item={item} form={form} index={index} />
    )
  } else {
    const { change, draftItem } = item
    const onChange = (amount: string) => {
      form.updateChange(item.key, amount)
    }

    return (
      <ItemContainer
        item={item}
        form={form}
        index={index}
      >
        <Row styling={{ padding: "p-2", flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
          <Cell styling={{ width: "w-6/12" }}>
            Adjustment
          </Cell>
          <Cell styling={{ width: "w-6/12", textAlign: "text-right"  }}>
            <AmountInput
              name={`item-form-${item.key}`}
              amount={change.amount}
              onChange={onChange}
              classes={["border", "border-gray-500"]}
            />
          </Cell>
          <Cell styling={{ width: "w-6/12" }}>
            Updated Amount
          </Cell>
          <Cell styling={{ fontWeight: "font-bold", width: "w-3/12", textAlign: "text-right"  }}>
            <AmountSpan color="text-gray-500" amount={draftItem.amount} />
          </Cell>
        </Row>
      </ItemContainer>
    )
  }
}

const DayToDayItemForm = ({ item, form }: { form: TChangeForm; item: TBudgetItem }) => {
  if (!item.draftItem || !item.change) { return null }

  const { change, draftItem } = item

  const onChange = (amount: string) => {
    form.updateChange(item.key, amount)
  }

  return (
    <Row styling={{ padding: "p-2", flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
      <Cell styling={{ width: "w-6/12" }}>
        Adjustment
      </Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right"  }}>
        <AmountInput
          name={`item-form-${item.key}`}
          amount={change.amount}
          onChange={onChange}
          classes={["border", "border-gray-500"]}
        />
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        Previous/Updated Amount
      </Cell>
      <Cell styling={{ fontWeight: "font-bold", width: "w-3/12", textAlign: "text-right"  }}>
        <AmountSpan color="text-gray-800" amount={item.amount} />
      </Cell>
      <Cell styling={{ fontWeight: "font-bold", width: "w-3/12", textAlign: "text-right"  }}>
        <AmountSpan color="text-gray-800" amount={draftItem.amount} />
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        Spent/Deposited
      </Cell>
      <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan color="text-gray-800" amount={item.spent} absolute={true} />
      </Cell>
      <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan color="text-gray-800" amount={item.spent} absolute={true} />
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        Remaining/Difference
      </Cell>
      <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan color="text-gray-800" amount={item.remaining} absolute={true} />
      </Cell>
      <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan color="text-gray-800" amount={draftItem.remaining} absolute={true} />
      </Cell>
    </Row>
  )
}

const DayToDayItem = (props: {
  form: TChangeForm;
  item: TBudgetItem,
  index: number
}) => {
  const { item, form, index } = props

  if (!!item.draftItem) {
    return (
      <ItemContainer item={item} form={form} index={index}>
        <DayToDayItemForm {...props} />
      </ItemContainer>
    )
  }

  return (
    <ItemContainer item={item} form={form} index={index}>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          Spent/Deposited
        </Cell>
        <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-4/12" }}>
          <AmountSpan amount={item.spent} absolute={true} />
        </Cell>
      </Row>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          Remaining/Difference
        </Cell>
        <Cell styling={{ fontWeight: "font-bold", textAlign: "text-right", width: "w-4/12" }}>
          <AmountSpan amount={item.remaining} absolute={true} />
        </Cell>
      </Row>
    </ItemContainer>
  )
}

export { ClearedMonthItem, DayToDayItem, PendingMonthItem, TransactionDetailLineItem }
