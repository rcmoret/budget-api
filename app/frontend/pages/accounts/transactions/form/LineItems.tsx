import { useContext } from "react";
import { AppConfigContext } from "@/components/layout/Provider";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Label } from "@/pages/accounts/transactions/form/Shared";
import { TFormDetail } from "@/pages/accounts/transactions/form";
import { Icon } from "@/components/common/Icon";
import Select, { SingleValue, createFilter } from "react-select";
import {
  accrualFilter,
  sortByName,
} from "@/lib/models/budget-items"
import { AmountInput, inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { Button } from "@/components/common/Button";
import { moneyFormatter } from "@/lib/MoneyFormatter";

type RemoveButtonProps = {
  detailKey: string,
  removeDetail: (key: string) => void,
}

const RemoveButton = (props: RemoveButtonProps) => {
  return (
    <Button type="button" onClick={() => props.removeDetail(props.detailKey)}>
      <span className="text-gray-600">
        <Icon name="times-circle" />
      </span>
    </Button>
  )
}
const AddButton = (props: { addDetail: () => void }) => {
  return (
    <Button type="button" onClick={props.addDetail}>
      <span className="text-gray-600">
        <Icon name="plus-circle" />
      </span>
    </Button>
  )
}

const LineItemComponent = (props: {
  index: number,
  detailCount: number,
  detail: { key: string, budgetItemKey: string | null, amount: TInputAmount },
  addDetail: () => void,
  isBudgetExclusion: boolean,
  removeDetail: (key: string) => void,
  updateDetailItem: (props: { index: number, value: string, amount?: TInputAmount }) => void,
  updateDetailAmount: (props: { index: number, value: TInputAmount }) => void,
}) => {
  const { appConfig } = useContext(AppConfigContext)
  const { items, month, year } = appConfig.budget.data
  const { showAccruals } = appConfig.budget
  const { detail, index, addDetail, removeDetail } = props
  const { key, amount, budgetItemKey  } = detail

  const availableItems = [...items].filter((item) => {
    if (item.key === budgetItemKey) {
      return true
    } else if (item.isDeleted) {
      return false 
    } else if (item.month !== month || item.year !== year) {
      return false
    } else if (item.isMonthly && item.transactionDetails.length) {
      return false
    } else {
      return accrualFilter({ item, showAccruals, month, year })
    }
  })

  const options = availableItems.sort(sortByName).map((item) => {
    return {
      label: `${item.name} (${moneyFormatter(item.remaining, { decorate: true })})`,
      value: item.key
    }
  })

  const handleSelectChange = (ev: SingleValue<{ value: string | null; label: string }>) => {
    const item = items.find((item) => item.key === ev?.value) || null

   if (!!item && amount.cents === 0 && item.isMonthly) {
     props.updateDetailItem({ index, value: String(ev?.value), amount: inputAmount({ cents: item.remaining }) })
   } else {
     props.updateDetailItem({ index, value: String(ev?.value) })
   }
  }

  const handleAmountChange = (amt: string) => {
    props.updateDetailAmount({ index, value: inputAmount({ display: amt }) })
  }

  const value = options.find((item) => item.value === budgetItemKey) || ""

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="hidden">{key}</div>
      <div className="w-6/12 min-h-12 pr-2">
        <AmountInput
          name="detailAmountDecimal"
          style={{ width: "100%" }}
          classes={["border border-gray-300 h-input-lg px-1"]}
          onChange={handleAmountChange}
          amount={amount}
        />
      </div>
      <div className="w-5/12 min-h-12 pl-2">
        <div className="hidden">{budgetItemKey}</div>
        <Select
          options={options}
          // @ts-ignore
          onChange={handleSelectChange}
          value={value}
          isDisabled={props.isBudgetExclusion}
          filterOption={createFilter({ matchFrom: "start" })}
        />
      </div>
      <div className="w-1/12 text-right">
        {props.detailCount > 1 ?
          <RemoveButton detailKey={detail.key} removeDetail={removeDetail} /> :
          <AddButton addDetail={addDetail} />
        }
      </div>
    </div>
  )
}

const Total = ({ details, addDetail }: { details: Array<TFormDetail>, addDetail: () => void }) => {
  if (details.length === 1) { return }

  const total = details.reduce((sum, detail) => {
    return Number(detail.amount.cents) + sum
  }, 0)

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row justify-between w-5/12 text-sm py-1">
        <Label label="Total" classes={["w-1/2 pl-2"]} />
        <AmountSpan amount={total} />
      </div>
      <div className="w-1/12 text-right">
        <AddButton addDetail={addDetail} />
      </div>
    </div>
  )
}

const BudgetItemsComponent = (props: {
  addDetail: () => void,
  updateDetailItem: (props: { index: number, value: string, amount?: TInputAmount }) => void,
  updateDetailAmount: (props: { index: number, value:  TInputAmount }) => void,
  removeDetail: (key: string) => void,
  isBudgetExclusion: boolean,
  details: Array<{
    key: string;
    budgetItemKey: string | null;
    amount: TInputAmount;
    _destroy: boolean;
  }>
}) => {
  const { details, addDetail, removeDetail, updateDetailItem, updateDetailAmount } = props

  return (
    <div className="flex flex-col w-full md:w-[450px] md:mr-8">
      <div className="flex flex-row w-full justify-between">
        <Label label="Line Items Amount" classes={["w-6/12"]} />
        <Label label="Budget Category" classes={["w-5/12 pl-2"]} />
      </div>
      <Total details={details} addDetail={addDetail} />
      <div className="w-full">
        {details.map((detail, index) => {
          return (
            <LineItemComponent
              key={detail.key}
              index={index}
              addDetail={addDetail}
              detail={detail}
              detailCount={details.length}
              isBudgetExclusion={props.isBudgetExclusion}
              removeDetail={removeDetail}
              updateDetailAmount={updateDetailAmount}
              updateDetailItem={updateDetailItem}
            />
          )
        })}
      </div>
    </div>
  )
}

export { BudgetItemsComponent }
