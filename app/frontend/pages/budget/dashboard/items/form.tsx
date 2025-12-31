import { useForm } from "@inertiajs/react"
import { Button, SubmitButton } from "@/components/common/Button"
import { useAppConfigContext } from "@/components/layout/Provider"
import { UrlBuilder } from "@/lib/UrlBuilder"
import { buildQueryParams } from "@/lib/redirect_params"
import { DateFormatter } from "@/lib/DateFormatter"
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { AmountSpan } from "@/components/common/AmountSpan"
import { useBudgetDashboardItemContext } from "./context_provider"
import { useBudgetDashboardContext } from "../context_provider"
import { AmountInput, inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { useToggle } from "@/lib/hooks/useToogle"

const LocalAmountInput = (props: {
  amount: TInputAmount;
  isInputShown: boolean;
  itemKey: string;
  onChange: (s: string) => void;
  toggleInput: () => void;
  children: React.ReactNode;
}) => {
  if (props.isInputShown) {
    return (
      <AmountInput
        name={`item-form-${props.itemKey}`}
        amount={props.amount}
        onChange={props.onChange}
        classes={["font-normal", "border", "border-gray-500"]}
      />
    )
  } else {
    return (
      <Button type="button" onClick={props.toggleInput}>
        {props.children}
      </Button>
    )
  }
}

const AccrualFormComponent = (props: { budgetCategoryKey: string }) => {
  const { budgetCategoryKey } = props
  const { appConfig } = useAppConfigContext()
  const { month, year } = appConfig.budget.data
  const { put, processing } = useForm({
    category: {
      maturityIntervals: [
        {
          month,
          year
        }
      ]
    }
  })

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault()
    const formUrl = UrlBuilder({
      name: "CategoryShow",
      key: budgetCategoryKey,
      queryParams: buildQueryParams(["budget", month, year, "set-up"])
    })
    put(formUrl)
  }

  return (
    <div>
      <SubmitButton
        isEnabled={!processing}
        onSubmit={onSubmit}
        styling={{
          color: "text-blue-300"
        }}
      >
        Mark as Maturing in {DateFormatter({ month, year, format: "monthYear" })}
      </SubmitButton>
    </div>
  )
}

const DayToDayItemForm = () => {
  const { item } = useBudgetDashboardItemContext()
  const { form } = useBudgetDashboardContext()

  const [showAdjustmentInput, toggleAdjustmentInput] = useToggle(true)

  if (!item.draftItem || !item.change) { return null }

  const { change, draftItem } = item

  const onChange = (amount: string) => {
    form.updateChange(item.key, amount)
  }
  const onChange2 = (amount: string) => {
    form.updateChangeV2({ key: item.key, amount })
  }

  return (
    <Row styling={{ padding: "p-2", flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
      <Cell styling={{ width: "w-6/12" }}>
        Budgeted
      </Cell>
      <Cell styling={{ width: "w-3/12", textAlign: "text-right"  }}>
        <AmountSpan color="text-gray-800" amount={item.amount} />
      </Cell>
      <Cell styling={{ width: "w-3/12", textAlign: "text-right"  }}>
        <AmountSpan color="text-gray-800" amount={item.amount} />
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        Adjustment
      </Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right"  }}>
        <LocalAmountInput
          isInputShown={showAdjustmentInput}
          itemKey={item.key}
          amount={change.amount}
          onChange={onChange}
          toggleInput={toggleAdjustmentInput}
        >
          (<AmountSpan color="text-gray-800" amount={change.amount.cents ?? 0} absolute={true} />)
        </LocalAmountInput>
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        New Amount
      </Cell>
      <Cell styling={{ padding: "py-2", width: "w-6/12", textAlign: "text-right", border: "border-b border-gray-500" }}>
        <LocalAmountInput
          itemKey={item.key}
          isInputShown={!showAdjustmentInput}
          onChange={onChange2}
          amount={change.updatedAmount}
          toggleInput={toggleAdjustmentInput}
        >
          <AmountSpan color="text-gray-800" amount={draftItem.amount} />
        </LocalAmountInput>
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        Spent/Deposited
      </Cell>
      <Cell styling={{ textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan color="text-gray-800" amount={item.spent} absolute={true} prefix="+" />
      </Cell>
      <Cell styling={{ textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan color="text-gray-800" amount={item.spent} absolute={true} prefix="+" />
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

const ToggleInputButton = (props: { onClick: () => void; amount: number }) => {
  return (
    <Button type="button" onClick={props.onClick}>
      <AmountSpan amount={props.amount} />
    </Button>
  )
}

const PendingItemForm = () => {
  const { form } = useBudgetDashboardContext()
  const { item } = useBudgetDashboardItemContext()

  const [showAdjustmentInput, toggleAdjustmentInput] = useToggle(true)

  const { change, draftItem } = item

  if (!draftItem || !change) { return null }
  const onChange = (amount: string) => { form.updateChangeV2({ key: item.key, adjustment: amount }) }

  const onChange2 = (amount: string) => {
    form.updateChangeV2({ key: item.key, amount })
    // setNewAmountValue(amount)
  }
  return (
    <Row styling={{ padding: "p-2", flexWrap: "flex-wrap", flexAlign: "justify-between" }}>
      <Cell styling={{ width: "w-6/12" }}>
        Adjustment
      </Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right", padding: "py-1" }}>
        <LocalAmountInput
          isInputShown={showAdjustmentInput}
          itemKey={item.key}
          amount={change.amount}
          onChange={onChange}
          toggleInput={toggleAdjustmentInput}
        >
          <AmountSpan color="text-gray-800" amount={change.amount.cents ?? 0} />
        </LocalAmountInput>
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>
        New Amount
      </Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right", padding: "py-1" }}>
        <LocalAmountInput
          isInputShown={!showAdjustmentInput}
          itemKey={item.key}
          amount={change.updatedAmount}
          onChange={onChange2}
          toggleInput={toggleAdjustmentInput}
        >
          <AmountSpan color="text-gray-800" amount={draftItem.amount} />
        </LocalAmountInput>
      </Cell>
    </Row>
  )
}

export { AccrualFormComponent, DayToDayItemForm, PendingItemForm }
