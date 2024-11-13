import { useContext } from "react";
import { AppConfigContext } from "@/components/layout/Provider";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Label } from "@/pages/accounts/transactions/form/Shared";
import { TFormDetail } from "@/pages/accounts/transactions/form";
import { Icon } from "@/components/common/Icon";
import Select from "react-select";
import {
  accrualFilter,
  sortByName,
} from "@/lib/models/budget-items"
import { ActionAnchorTag } from "@/components/common/Link";
import { AmountInput, inputAmount, TInputAmount } from "@/components/common/AmountInput";

type RemoveButtonProps = {
  detailKey: string,
  removeDetail: (key: string) => void,
}

const RemoveButton = (props: RemoveButtonProps) => {
  return (
    <ActionAnchorTag onClick={() => props.removeDetail(props.detailKey)}>
      <Icon name="times-circle" />
    </ActionAnchorTag>
  )
}
const AddButton = (props: { addDetail: () => void }) => {
  return (
    <ActionAnchorTag onClick={props.addDetail}>
      <Icon name="plus-circle" />
    </ActionAnchorTag>
  )
}

const LineItemComponent = (props: {
  index: number,
  detailCount: number,
  detail: { key: string, budgetItemKey: string | null, amount: TInputAmount },
  addDetail: () => void,
  removeDetail: (key: string) => void,
  updateDetailItem: (props: { index: number, value: string }) => void,
  updateDetailAmount: (props: { index: number, value: TInputAmount }) => void,
}) => {
  const { appConfig } = useContext(AppConfigContext)
  const { items, month, year } = appConfig.budget.data
  const { showAccruals } = appConfig.budget
  const { detail, index, addDetail, removeDetail } = props
  const { key, amount, budgetItemKey  } = detail

  const availableItems = items.filter((item) => {
    if (item.key === budgetItemKey) {
      return true
    } else if (item.isDeleted) {
      return false 
    } else if (item.isMonthly && item.transactionDetails.length) {
      return false
    } else {
      return accrualFilter({ item, showAccruals, month, year })
    }
  })

  const options = availableItems.sort(sortByName).map((item) => {
    return { label: item.name, value: item.key }
  })

  const handleSelectChange = ({ value }: { value: string | null, label: string }) => {
    props.updateDetailItem({ index, value: value })
  }

  const handleAmountChange = (amt: string) => {
    props.updateDetailAmount({ index, value: inputAmount({ display: amt }) })
  }

  const value = options.find((item) => item.value === budgetItemKey) || ""

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-6/12 min-h-12 pr-2">
        <div className="hidden">{key}</div>
        <Select
          options={options}
          onChange={handleSelectChange}
          value={value}
        />
      </div>
    <div className="w-5/12 min-h-12 pl-2">
      <AmountInput
        name="detailAmountDecimal"
        style={{ width: "100%" }}
        onChange={handleAmountChange}
        amount={amount}
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
    <div className="flex flex-row justify-end">
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
  updateDetailItem: (props: { index: number, value: string }) => void,
  updateDetailAmount: (props: { index: number, value:  TInputAmount }) => void,
  removeDetail: (key: string) => void,
  details: Array<{
    key: string;
    budgetItemKey: string | null;
    amount: TInputAmount;
    _destroy: boolean;
  }>
}) => {
  const { details, addDetail, removeDetail, updateDetailItem, updateDetailAmount } = props

  return (
    <div className="flex flex-col w-[450px]">
      <div className="flex flex-row w-full justify-between">
        <Label label="Budget Category" classes={["w-6/12"]} />
        <Label label="Line Items Amount" classes={["w-5/12 pl-2"]} />
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
