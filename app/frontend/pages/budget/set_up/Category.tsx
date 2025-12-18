import { Row, StripedRow } from "@/components/common/Row"
import { Button } from "@/components/common/Button";
import { SetUpCategory, SetUpEvent } from "@/lib/hooks/useSetUpEventsForm";
import { AmountInput, inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { AmountSpan } from "@/components/common/AmountSpan";
import { emptyError, isAdjust, isCreate, isDelete } from "@/lib/hooks/useEventsForm";
import { GreenCheck, Icon } from "@/components/common/Icon";
import { useContext, useState } from "react";
import axios from "axios";
import { AppConfigContext } from "@/components/layout/Provider";
import { DateFormatter } from "@/lib/DateFormatter";
import { useForm } from '@inertiajs/react'
import { SubmitButton } from "@/components/common/Button";
import { buildQueryParams } from "@/lib/redirect_params"
import { UrlBuilder } from "@/lib/UrlBuilder";
import { useToggle } from "@/lib/hooks/useToogle";
import { Point } from "@/components/common/Symbol";

const AccrualFormComponent = (props: {
  category: SetUpCategory,
  updateCategory: (category: SetUpCategory) => void,
}) => {
  const { category, updateCategory } = props
  const { appConfig } = useContext(AppConfigContext)
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
      key: category.key,
      queryParams: buildQueryParams(["budget", month, year, "set-up"])
    })
    const onSuccess = (page: any) => {
      const categories = page.props.categories as Array<SetUpCategory>
      const updatedCategory = categories.find((cat) => cat.key === category.key)
      if (!!updatedCategory) {
        updateCategory(updatedCategory)
      }
    }
    put(formUrl, { onSuccess })
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

const AccrualComponent = (props: {
  category: SetUpCategory,
  updateCategory: (category: SetUpCategory) => void
}) => {
  const { appConfig } = useContext(AppConfigContext)
  const { category } = props

  const { month, year } = appConfig.budget.data
  const intervals = category.upcomingMaturityIntervals || []

  const isMaturing = intervals[0]?.month === month && (intervals)[0]?.year === year

  let accrualInfoMessage = ""
  if (!intervals.length) {
    accrualInfoMessage = "No Upcoming Maturity Intervals"
  } else if (isMaturing) {
    accrualInfoMessage = `Mature in ${DateFormatter({ month, year, format: "monthYear" })}`
  } else {
    accrualInfoMessage = `Maturing next in ${DateFormatter({
      month: intervals[0].month,
      year: intervals[0].year,
      format: "monthYear"
    })}`
  }

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="text-sm italic">
        Accrual
      </div>
      <div className="w-4/12 flex flex-col text-sm italic text-right px-2">
        <div>
          {accrualInfoMessage}
          {!isMaturing && <AccrualFormComponent
            category={category}
            updateCategory={props.updateCategory}
          />}
        </div>
      </div>
    </div>
  )
}

type TSuggestionName = "budgeted" | "spent" | "default" | null

const Suggestions = (props: {
  category: SetUpCategory;
  event: SetUpEvent;
  updateCategory: (category: SetUpCategory) => void;
  updateEvent: (amount: string) => void;
}) => {
  const { category, event, updateCategory, updateEvent } = props
  const [selectedSuggestion, setSelectedSuggestion] = useState<TSuggestionName>(null)
  const isChecked = (name: TSuggestionName) => {
    if (name !== selectedSuggestion) { return false }
    if (name === "spent" && event.spent === event.amount.cents) {
      return true
    }
    if (name === "budgeted" && event.budgeted === event.amount.cents) {
      return true
    }
    if (name === "default" && category.defaultAmount === event.amount.cents) {
      return true
    }
    return false
  }

  const onChange = (name: string) => {
    if (name === "spent") {
      setSelectedSuggestion("spent")
      updateEvent(inputAmount({ cents: event.spent }).display)
    } else if (name === "budgeted") {
      setSelectedSuggestion("budgeted")
      updateEvent(inputAmount({ cents: event.budgeted }).display)
    } else if (name === "default") {
      setSelectedSuggestion("default")
      updateEvent(inputAmount({ cents: Number(category.defaultAmount) }).display)
    } else {
      setSelectedSuggestion(null)
    }
  }

  return (
    <>
      <Suggestion
        label={category.isExpense ? "Spent" : "Deposited"}
        amount={event.spent}
        isChecked={isChecked("spent")}
        onChange={() => onChange("spent")}
      />
      <Suggestion
        label="Budgeted"
        amount={event.budgeted}
        isChecked={isChecked("budgeted")}
        onChange={() => onChange("budgeted")}
      />
      {!!category.defaultAmount &&
        <EditableSuggestion
          category={category}
          isChecked={isChecked("default")}
          onChange={() => onChange("default")}
          updateCategory={updateCategory}
        />
      }
    </>
  )
}

type TBudgetCategorySummary = {
  id: number;
  budgetedAverage: number;
  transactionsTotalAverage: number;
  limit: number;
}

const SummaryComponent = (props: { summaryData: TBudgetCategorySummary | null }) => {
  const { summaryData } = props

  if (!summaryData) { return null }

  return (
    <div>
      <div>
        Average Budgeted: <AmountSpan amount={summaryData.budgetedAverage} />
      </div>
      <div>
        Average Total: <AmountSpan amount={summaryData.transactionsTotalAverage} />
      </div>
      <div>
        For past {summaryData.limit} months
      </div>
    </div>
  )
}

const SummaryUpdateButton = (props: {
  summaryDataFetched: boolean;
  onClick: ()  => void;
}) => {
  if (props.summaryDataFetched) { return null }

  return (
    <div>
      <button
        type="button"
        onClick={props.onClick}
      >
        Show Averages
      </button>
    </div>
  )
}

type SuggestionProps = {
  isChecked: boolean;
  label: string;
  amount: number;
  onChange: (event: React.ChangeEvent & { target: HTMLInputElement }) => void;
  children?: React.ReactNode;
}

const Suggestion = (props: SuggestionProps) => {
  const { amount, label, onChange, isChecked } = props

  return (
    <div className="w-full flex flex-row justify-between">
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
        />
        {" "}
        {label}:
      </div>
      <div className="flex flex-row w-28 gap-4">
        <div className="w-20 text-right">
          <AmountSpan amount={amount} />
        </div>
        <div className="w-2/12">
          {!!props.children && props.children}
        </div>
      </div>
    </div>
  )
}

const EditForm = (props: {
  category: SetUpCategory,
  isChecked: boolean,
  toggleForm: () => void,
  updateCategory: (category: SetUpCategory) => void;
}) => {
  const { data, setData, transform, processing, put } = useForm({
    defaultAmount: inputAmount({ cents: (props.category.defaultAmount || 0) })
  })
  const { category, isChecked, toggleForm, updateCategory } = props

  const { appConfig } = useContext(AppConfigContext)
  const { month, year } = appConfig.budget.data

  // @ts-ignore
  transform(() => ({ category: { defaultAmount: data.defaultAmount.cents } }))

  const formUrl = UrlBuilder({
    name: "CategoryShow",
    key: category.key,
    queryParams: buildQueryParams(["budget", month, year, "set-up"])
  })

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault()
    const onSuccess = (page: any) => {
      const categories = page.props.categories as Array<SetUpCategory>
      const updatedCategory = categories.find((cat) => cat.key === category.key)
      if (!!updatedCategory) {
        updateCategory(updatedCategory)
      }
      toggleForm()
    }
    put(formUrl, { onSuccess })
  }

  const onAmountChange = (amt: string) =>
    setData({ defaultAmount: inputAmount({ display: amt }) })

  return (
    <div className="w-full flex flex-row justify-between">
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          disabled={true}
        />
        {" "}
        Default:
      </div>
      <div className="flex flex-row w-28 gap-4">
        <div className="w-20 text-right">
          <AmountInput
            name="category-default-amount"
            amount={data.defaultAmount}
            onChange={onAmountChange}
            classes={["w-20"]}
          />
        </div>
        <div className="w-2/12">
          <SubmitButton
            onSubmit={onSubmit}
            styling={{}}
            isEnabled={!processing}
          >
            <GreenCheck />
          </SubmitButton>
        </div>
      </div>
    </div>
  )
}

type EditableSuggestionProps = {
  category: SetUpCategory;
  isChecked: boolean;
  onChange: () => void;
  updateCategory: (category: SetUpCategory) => void;
}

const EditableSuggestion = (props: EditableSuggestionProps) => {
  const {
    category,
    isChecked,
    onChange,
    updateCategory
  } = props

  const [showForm, toggleForm] = useToggle()

  if (!showForm) {
    return (
      <Suggestion
        label="Default"
        amount={category.defaultAmount || 0}
        isChecked={isChecked}
        onChange={onChange}
      >
        <Button
          type="button"
          onClick={toggleForm}
        >
          <span className="text-blue-300">
            <Icon name="edit" />
          </span>
        </Button>
      </Suggestion>
    )
  } else {
    return (
      <EditForm
        category={category}
        isChecked={isChecked}
        updateCategory={updateCategory}
        toggleForm={toggleForm}
      />
    )

  }
}

const ErrorComponent = ({ messages }: { messages: string[] }) => {
  if (!messages.length) { return null }

  return (
    <Row styling={{ color: "text-red-400", fontSize: "text-sm" }}>
      {messages.map((message) => {
        return (
          <Point>
            <span className="italic">
              {message}
            </span>
          </Point>
        )
      })}
    </Row>
  )
}

type EventComponentProps = {
  category: SetUpCategory;
  event: SetUpEvent;
  removeEvent: (key: string) => void;
  removeItem: (key: string) => void;
  updateCategory: (category: SetUpCategory) => void;
  updateEvent: (key: string, amount: TInputAmount) => void;
  eventCount: number;
  index: number;
}

const EventComponent = (props: EventComponentProps) => {
  const { category, event, updateCategory, eventCount, index } = props
  const { key } = event
  const errors = { ...emptyError, ...(event.errors || {}) }
  const label = isCreate(event) ? "New Item" : "Adjust Item"
  const updateEvent = (amount: string) => props.updateEvent(key, inputAmount({ display: amount }))
  const removeEvent = () => {
    if (isAdjust(event)) {
      props.removeItem(key)
    } else {
      props.removeEvent(key)
    }
  }

  const border = event.amount.display === "" ? "border-l-4 border-purple-100" : "border-none"

  return (
    <>
      {eventCount > 1 && index > 0 && <div className="h-0.5 bg-gray-400 w-full mb-4"></div>}
      <Row styling={{
        flexDirection: "flex-row",
        flexWrap: "flex-wrap",
        flexAlign: "justify-between",
        border,
        margin: "mb-4",
        padding: "p-4"
      }}>
        <div className="hidden">{key}</div>
        <div className="w-3/12">
          <div>{label}</div>
          <ErrorComponent messages={errors.budgetItem} />
        </div>
        <div className="w-4/12 flex flex-row flex-wrap">
          <Suggestions
            category={category}
            event={event}
            updateEvent={updateEvent}
            updateCategory={updateCategory}
          />
        </div>
        <div className="w-4/12">
          <div className="w-full flex flex-row justify-end pr-1 gap-2">
            <div className="flex-col gap-2 flex w-[165px]">
              <div className="text-right">
                <AmountInput
                  name={`event-${key}`}
                  amount={event.amount}
                  onChange={updateEvent}
                />
              </div>
              <ErrorComponent messages={errors.amount} />
            </div>
            <Button styling={{ color: "text-gray-500" }} type="button" onClick={removeEvent}>
              <Icon name="times-circle" />
            </Button>
          </div>
        </div>
      </Row>
    </>
  )
}

type ComponentProps = {
  category: SetUpCategory;
  removeItem: (_: { categoryKey: string, eventKey: string }) => void;
  removeEvent: (_: { categoryKey: string, eventKey: string }) => void;
  updateCategory: (props: { key: string, category: SetUpCategory }) => void;
  updateEvent: (props: { categoryKey: string, eventKey: string, amount: TInputAmount }) => void;
}

const CategoryComponent = (props: ComponentProps) => {
  const { category } = props
  const updateCategory = (category: SetUpCategory) => props.updateCategory({ key: category.key, category })
  const removeEvent = (key: string) => props.removeEvent({ categoryKey: category.key, eventKey: key })
  const removeItem = (key: string) => props.removeItem({ categoryKey: category.key, eventKey: key })
  const updateEvent = (eventKey: string, amount: TInputAmount) => props.updateEvent({
    categoryKey: category.key,
    amount,
    eventKey
  })
  
  const [summaryData, setSummaryData] = useState<null | TBudgetCategorySummary>(null);
  
  const getSummaryData = async () => {
    const summaryUrl = UrlBuilder({ name: "CategorySummary", key: category.key })

    axios.get(summaryUrl)
    .then(response => {
      const { category } = response.data
      setSummaryData(category)
    })
    .catch(error => {
      console.error('Error fetching summary data:', error)
    })
  }

  const events = category.events.filter((event) => !isDelete(event))

  return (
    <StripedRow
      oddColor="odd:bg-sky-50"
      evenColor="even:bg-gray-50"
      styling={{
        rounded: "rounded",
        flexDirection: "flex-col",
        padding: "p-2",
      }}
    >
      <div className="text-lg">
        {category.name}
        {category.isAccrual && <AccrualComponent category={category} updateCategory={updateCategory} />}
      </div>
      {events.map((event, index) => {
        return (
          <EventComponent
            key={event.key}
            category={category}
            event={event}
            updateCategory={updateCategory}
            updateEvent={updateEvent}
            removeEvent={removeEvent}
            removeItem={removeItem}
            eventCount={events.length}
            index={index}
          />
        )
      })}
      <SummaryUpdateButton
        summaryDataFetched={!!summaryData}
        onClick={getSummaryData}
      />
      <SummaryComponent summaryData={summaryData} />
    </StripedRow>
  )
}

export { CategoryComponent }
