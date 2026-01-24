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
import { AmountInput, TInputAmount } from "@/components/common/AmountInput";
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

export { AccrualFormComponent  }
