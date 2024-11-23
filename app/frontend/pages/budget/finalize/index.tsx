import { BudgetCategory, TEvent } from "@/types/budget";
import { TInputAmount } from "@/components/common/AmountInput";
import { BudgetFinalizePageData } from "@/components/layout/Header";
import { DateFormatter } from "@/lib/DateFormatter";

interface FinalizeCategory extends BudgetCategory {
  events: Array<FinalizeEvent>
  upcomingMaturityIntervals?: Array<{
    month: number;
    year: number;
  }>
}

interface FinalizeEvent extends TEvent {
  amount: TInputAmount;
}

type IndexComponentProps = {
  categories: Array<FinalizeCategory>
  target: BudgetFinalizePageData;
  data: BudgetFinalizePageData;
}

const BudgetFinalizeIndex = (props: IndexComponentProps) => {
  const { categories, data: base, target } = props

  return (
    <div className="w-full flex flex-row flex-wrap">
      <div className="flex flex-row flex-wrap gap-2 w-full mb-6">
        Final Review {DateFormatter({ month: base.month, year: base.year, format: "monthYear" })}
      </div>
    </div>
  )
}

export default BudgetFinalizeIndex;
