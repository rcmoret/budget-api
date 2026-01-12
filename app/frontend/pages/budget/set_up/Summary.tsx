import { SetUpCategory } from "@/lib/hooks/useSetUpEventsForm";
import { AmountSpan } from "@/components/common/AmountSpan";

type SummaryProps = {
  revenueCategories: Array<SetUpCategory>;
  monthlyCategories: Array<SetUpCategory>;
  dayToDayCategories: Array<SetUpCategory>;
  totalBudgeted: number;
}

const AmountComponent = (props: { amount: number }) => {
  return (
    <div>
      <AmountSpan
        amount={props.amount}
        zeroColor="text-black"
        color="text-green-600"
        negativeColor="text-red-400"
      />
    </div>
  )
}

const SummaryComponent = (props: SummaryProps) => {
  const {
    revenueCategories,
    monthlyCategories,
    dayToDayCategories,
    totalBudgeted
  } = props

  const getTotal = (categories: Array<SetUpCategory>) => {
    return categories.reduce((sum, category) => {
      return sum + category.events.reduce((acc, event) => acc + Number(event.amount.cents), 0)
    }, 0)
  }

  const revenueTotal = getTotal(revenueCategories)
  const monthlyTotal = getTotal(monthlyCategories)
  const dayToDayTotal = getTotal(dayToDayCategories)

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-row justify-between">
        <div>
          Revenue Total:
        </div>
        <AmountComponent amount={revenueTotal} />
      </div>
      <div className="w-full flex flex-row justify-between">
        <div>
          Monthly Expenses Total:
        </div>
        <AmountComponent amount={monthlyTotal} />
      </div>
      <div className="w-full flex flex-row justify-between">
        <div>
          Day to Day Expenses Total:
        </div>
        <AmountComponent amount={dayToDayTotal} />
      </div>
      <div className="w-full flex flex-row justify-between font-semibold border-t border-gray-500">
        <div>
          Total Budgeted
        </div>
        <AmountComponent amount={totalBudgeted} />
      </div>
    </div>
  )
}

export { SummaryComponent }
