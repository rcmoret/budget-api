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
  data: Array<{
    month: number;
    year: number;
    budgeted: number;
    transactionsTotal: number;
  }>
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

  const addSummaryData = (props: { key: string, data: TBudgetCategorySummary }) => {
    setSummaryData({
      ...summaryData,
      [props.key]: props.data
    })
  }

  const getSummaryData = async (props?: { limit: number }) => {
    const summaryUrl = UrlBuilder({
      name: "CategorySummary",
      key: category.key,
      limit: props?.limit,
      queryParams: `before[month]=${month}&before[year]=${year}`
    })

    axios.get(summaryUrl)
      .then(response => {
        const { category: categoryData } = response.data
        addSummaryData({ key: category.key, data: categoryData })
      })
      .catch(error => {
        console.error('Error fetching summary data:', error)
      })
  }

  const spentOrDeposited = category.isExpense ? "Spent" : "Deposited"
  const currentSummary = summaryData?.[category.key];

  if (currentSummary) {
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      getSummaryData({ limit: Number(ev.target.value) })
    }

    return (
      <div className="w-72 py-4 px-2 bg-blue-60 rounded-lg flex flex-col gap-1">
        <SummaryLine label="Average Budgeted">
          <AmountSpan amount={currentSummary.budgetedAverage} />
        </SummaryLine>
        <SummaryLine label={`Average ${spentOrDeposited}`}>
          <AmountSpan amount={currentSummary.transactionsTotalAverage} />
        </SummaryLine>
        <SummaryLine label="(months)">
          <input
            className="text-right"
            type="number"
            value={currentSummary.limit}
            onChange={onChange}
          />
        </SummaryLine>
        <MonthlyDataChart data={currentSummary.data} />
      </div>
    )
  } else {
    return <SummaryUpdateButton onClick={getSummaryData} />
  }
}

const SummaryUpdateButton = (props: {
  onClick: () => void;
}) => {
  const className = [
    "bg-blue-300",
    "hover:bg-blue-400",
    "text-white",
    "py-2",
    "px-4",
    "font-semibold",
    "shadow-sm",
    "rounded"
  ].join(" ")

  return (
    <div>
      <button
        type="button"
        onClick={props.onClick}
        className={className}
      >
        Show Averages
      </button>
    </div>
  )
}

export { CategoryAverages }
