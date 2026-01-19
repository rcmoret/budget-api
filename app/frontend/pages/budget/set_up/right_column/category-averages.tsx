import { useRef } from "react";
import axios from "axios";
import { useState } from "react";
import { AmountSpan } from "@/components/common/AmountSpan";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { useSetUpCategoryShowContext } from "@/pages/budget/set_up/categories";
import { useSetupEventsFormContext } from "@/lib/hooks/useSetUpEventsForm";
import { MonthlyDataChart } from "./category-chart";

type TBudgetCategorySummary = {
  id: number;
  budgetedAverage: number;
  transactionsTotalAverage: number;
  limit: number;
  data: Array<TMonthData>;
}

type TMonthData = {
  month: number;
  year: number;
  budgeted: number;
  transactionsTotal: number;
}

const getSummaryData = async (props: {
  limit?: number;
  categoryKey: string;
  month: number;
  year: number;
  setIsLoading: (b: boolean) => void;
  setNumberOfMonths: (n: number) => void;
  addSummaryData: (p: { key: string; data: TBudgetCategorySummary }) => void;
}) => {
  const { month, year, categoryKey, addSummaryData, setNumberOfMonths, setIsLoading } = props

  setIsLoading(true);
  const summaryUrl = UrlBuilder({
    name: "CategorySummary",
    key: categoryKey,
    limit: props?.limit,
    queryParams: `before[month]=${month}&before[year]=${year}`
  })

  axios.get(summaryUrl)
    .then(response => {
      const { category: categoryData } = response.data
      setNumberOfMonths(Number(categoryData.limit))
      addSummaryData({ key: categoryKey, data: categoryData })
    })
    .catch(error => {
      console.error('Error fetching summary data:', error)
    })
    .finally(() => {
      setIsLoading(false);
    })
}


const MonthsInput = (props: {
  limit: number;
  isLoading: boolean;
  fetchSummaries: (l: number) => void;
  setNumberOfMonths: (n: number) => void;
}) => {

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      props.fetchSummaries(props.limit)
    }
  }

  const onWheel = (ev: React.WheelEvent<HTMLInputElement>) => {
    ev.currentTarget.blur();
  }

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    props.setNumberOfMonths(Number(ev.target.value))
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      props.fetchSummaries(props.limit)
    }, 400)
  }

  return (
    <input
      className="text-right"
      value={props.limit}
      onChange={onChange}
      onKeyUp={onKeyUp}
      disabled={props.isLoading}
      onWheel={onWheel}
    />
  )
}

const SummaryLine = (props: { label: string; children: React.ReactNode }) => {
  const className = [
    "bg-blue-20",
    "w-full",
    "flex",
    "flex-row",
    "justify-between",
    "text-sm",
    "py-1",
    "px-2",
    "rounded-sm"
  ].join(" ")

  return (
    <div className={className} style={{ boxShadow: "inset 2px 2px 1px 0 rgba(66, 91, 255, 0.22)" }}>
      <div>
        {props.label}
      </div>
      <div>
        {props.children}
      </div>
    </div>
  )
}

const CategoryAverages = () => {
  const { metadata: { previousYear: year, previousMonth: month } } = useSetupEventsFormContext()
  const { category } = useSetUpCategoryShowContext()

  const [summaryData, setSummaryData] = useState<Record<string, TBudgetCategorySummary> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSummaryData = (props: { key: string, data: TBudgetCategorySummary }) => {
    setSummaryData({
      ...summaryData,
      [props.key]: props.data
    })
  }

  const spentOrDeposited = category.isExpense ? "Spent" : "Deposited"
  const currentSummary = summaryData?.[category.key];

  const limit = currentSummary?.limit ?? 3

  const [numberOfMonths, setNumberOfMonths] = useState<number>(limit)

  const fetchSummaries = () => getSummaryData({
    limit: numberOfMonths,
    setIsLoading,
    addSummaryData,
    setNumberOfMonths,
    categoryKey: category.key,
    month,
    year
  })

  if (currentSummary) {
    return (
      <div className="w-72 py-4 px-2 bg-blue-60 rounded-lg flex flex-col gap-1">
        <SummaryLine label="Average Budgeted">
          <AmountSpan amount={currentSummary.budgetedAverage} />
        </SummaryLine>
        <SummaryLine label={`Average ${spentOrDeposited}`}>
          <AmountSpan amount={currentSummary.transactionsTotalAverage} />
        </SummaryLine>
        <SummaryLine label="(months)">
          <MonthsInput
            isLoading={isLoading}
            fetchSummaries={fetchSummaries}
            limit={numberOfMonths}
            setNumberOfMonths={setNumberOfMonths}
          />
        </SummaryLine>
        {isLoading && <div className="text-xl">LOADING!</div>}
        <div className="text-xl">limit: {limit}</div>
        <MonthlyDataChart data={currentSummary.data} />
      </div>
    )
  } else {
    return <SummaryUpdateButton onClick={fetchSummaries} disabled={isLoading} />
  }
}

const SummaryUpdateButton = (props: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  const className = [
    "bg-blue-300",
    "hover:bg-blue-400",
    "text-white",
    "py-2",
    "px-4",
    "font-semibold",
    "shadow-sm",
    "rounded",
    props.disabled ? "opacity-50 cursor-not-allowed" : ""
  ].join(" ")

  return (
    <div>
      <button
        type="button"
        onClick={props.onClick}
        className={className}
        disabled={props.disabled}
      >
        Show Averages
      </button>
    </div>
  )
}

export { CategoryAverages }
