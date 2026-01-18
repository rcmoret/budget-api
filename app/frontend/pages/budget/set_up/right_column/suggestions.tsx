import { AmountSpan } from "@/components/common/AmountSpan";
import { useForm } from '@inertiajs/react'
import { useToggle } from "@/lib/hooks/useToogle";
import { Button, SubmitButton } from "@/components/common/Button";
import { useSetUpCategoryShowContext } from "@/pages/budget/set_up/categories";
import { Icon } from "@/components/common/Icon";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params"
import { useSetUpEventsFormContext } from "@/lib/hooks/useSetUpEventsForm";
import { useSetupEventContext } from "@/pages/budget/set_up/events";
import { AmountInput, inputAmount } from "@/components/common/AmountInput";

const Suggestion = (props: {
  isSelected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {

  const sharedClasses = [
    "rounded",
    "w-full",
    "flex",
    "flex-row",
    "justify-between",
    "items-center",
    "outline",
    "px-4",
    "h-12",
  ]

  const selectedClasses = [
    "bg-chartreuse-100",
    "font-semibold",
    "text-gray-700",
    "py-1",
    "outline-2",
    "outline-chartreuse-300"
  ]

  const unselectedClasses = [
    "bg-white",
    "text-gray-600",
    "py-2",
    "outline-1",
    "outline-gray-200",
    "hover:outline-chartreuse-300",
    "hover:bg-chartreuse-50",
    "hover:text-chartreuse-600",
    "hover:outline-2"
  ]

  const buttonClasses = [
    ...sharedClasses,
    ...(props.isSelected ? selectedClasses : unselectedClasses),
  ].join(" ")

  const onClick = () => {
    props.onClick()
    // focusInput()
  }

  return (
    <div className="w-full">
      <button type="button" onClick={onClick} className={buttonClasses}>
        <div className="flex flex-row justify-between w-full">
          {props.children}
        </div>
      </button>
    </div>
  )
}

const NoAdjustmentSuggestion = (props: { isSelected: boolean }) => {
  const { setters } = useSetupEventContext()

  return (
    <Suggestion onClick={setters.setNoAjustment} isSelected={props.isSelected}>
      <div>No Change</div>
    </Suggestion>
  )
}

const DeleteSuggestion = (props: { isSelected: boolean }) => {
  const { setters } = useSetupEventContext()

  return (
    <Suggestion onClick={setters.setDeleteIntent} isSelected={props.isSelected}>
      <div>Remove Item</div>
    </Suggestion>
  )
}

const BudgetedSuggestion = () => {
  const { event, setters, selectedSuggestion } = useSetupEventContext()
  const { previouslyBudgeted } = event
  const { flags } = event
  const isSelected = "default" !== selectedSuggestion &&
    event.flags.eqPrevBudgeted

  const label = flags.eqPrevSpent ?
    "Budgeted / Spent" :
    "Budgeted"

  return (
    <Suggestion onClick={setters.setBudgeted} isSelected={isSelected}>
      <div>{label}:</div>
      <div>
        <AmountSpan amount={previouslyBudgeted} />
      </div>
    </Suggestion>
  )
}

const SpentSuggestion = () => {
  const { event, setters, selectedSuggestion } = useSetupEventContext()
  const { category } = useSetUpCategoryShowContext()
  const isSelected = selectedSuggestion === "spent" &&
    event.amount === event.updatedAmount

  const label = category.isExpense ? "Spent" : "Deposited"

  if (event.amount === event.spent) { return null }

  return (
    <Suggestion onClick={setters.setSpent} isSelected={isSelected}>
      <div>{label}:</div>
      <div>
        <AmountSpan amount={event.spent} />
      </div>
    </Suggestion>
  )
}

const DefaultSuggestion = () => {
  const { category } = useSetUpCategoryShowContext()
  const { event, selectedSuggestion } = useSetupEventContext()
  const { setters } = useSetupEventContext()
  const amount = category.defaultAmount ?? 0
  const isSelected = selectedSuggestion === "default" &&
    event.updatedAmount === category.defaultAmount
  const defaultAmount = category.defaultAmount ?? 0

  const [showEditForm, toggleEditForm] = useToggle(false)

  if (defaultAmount === 0 && !showEditForm) {
    return (
      <div className="w-full flex flex-row justify-between">
        <button type="button" onClick={toggleEditForm}>
          <Icon name="plus" />{" "}Add default amount?
        </button>
      </div>
    )
  } else if (!showEditForm) {
    return (
      <div className="w-full flex flex-row justify-between gap-4">
        <Suggestion onClick={setters.setDefault} isSelected={isSelected}>
          <div>Default:</div>
          <div>
            <AmountSpan amount={amount} />
          </div>
        </Suggestion>
        <button type="button" onClick={toggleEditForm} className="text-blue-300 hover:text-blue-400">
          <Icon name="edit" />
        </button>
      </div>
    )
  } else {
    return (
      <DefaultAmountForm toggleEditForm={toggleEditForm} />
    )
  }
}

const DefaultAmountForm = (props: { toggleEditForm: () => void; }) => {
  const { category } = useSetUpCategoryShowContext()
  const { event, flags } = useSetupEventContext()
  const { metadata } = useSetUpEventsFormContext()

  const { month, year } = metadata

  const defaultAmount = flags.eqPrevSpent ?
    event.previouslyBudgeted :
    (category.defaultAmount || event.previouslyBudgeted)

  const initialFormAmount = defaultAmount === 0 ? { display: "" } : { cents: defaultAmount }

  const { data, setData, transform, processing, put, reset } = useForm({
    defaultAmount: inputAmount(initialFormAmount)
  })

  const onAmountChange = (amt: string) =>
    setData({ defaultAmount: inputAmount({ display: amt }) })

  transform(() => ({ category: { defaultAmount: data.defaultAmount.cents } }))

  const formUrl = UrlBuilder({
    name: "CategoryShow",
    key: category.key,
    queryParams: buildQueryParams(["budget", month, year, "set-up", category.slug])
  })

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault()
    const onSuccess = () => {
      props.toggleEditForm()
    }
    put(formUrl, { onSuccess })
  }
  return (
    <div className="w-full flex flex-row justify-end gap-4 items-center">
      Default Amount
      <div className="w-20 text-right">
        <AmountInput
          name="category-default-amount"
          amount={data.defaultAmount}
          onChange={onAmountChange}
          classes={["w-20"]}
        />
      </div>
      <div className="h-full flex flex-row gap-2 items-center">
        <div>
          <SubmitButton
            onSubmit={onSubmit}
            styling={{}}
            isEnabled={!processing}
          >
          <div className="p-1 text-lg text-green-400 rounded">
            <Icon name="check-circle" />
          </div>
          </SubmitButton>
        </div>
        <div>
          <Button type="button" onClick={props.toggleEditForm} styling={{ color: "text-red-700" }}>
            <span className="text-lg">
              <Icon name="times-circle" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

const Suggestions = () => {
  const { event, selectedSuggestion } = useSetupEventContext()
  const { flags, eventType } = event

  if (eventType === "setup_item_create") {
    return (
      <div className="flex flex-col gap-2 w-72">
        <BudgetedSuggestion />
        {!flags.eqPrevSpent && <SpentSuggestion />}
        {flags.showDefaultSuggestion && <DefaultSuggestion />}
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-2 w-72">
        <NoAdjustmentSuggestion isSelected={selectedSuggestion === "unchanged" && !event.adjustment.cents && !!event.adjustment.display} />
        <DeleteSuggestion isSelected={!!event.adjustment.display && event.updatedAmount === 0} />
      </div>
    )
  }
}

export { Suggestions }
