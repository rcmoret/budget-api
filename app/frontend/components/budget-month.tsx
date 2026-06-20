import { getBudgetMonth } from "@/pages/budget/month-store"

const DaysRemaining = (props: { daysRemaining: number }) => {
  return (
    <div>
      Days Remaining: {props.daysRemaining}
    </div>
  )
}

const ProgressBar = () => {
  const budgetMonth = getBudgetMonth()
  const daysElapsed = budgetMonth.totalDays - budgetMonth.daysRemaining
  const percentCompleted = (100.0 * daysElapsed / budgetMonth.totalDays)
  return (
    <progress className="progress w-full progress-secondary" value={percentCompleted} max="100" />
  )
}

const BudgetMonthSummary = () => {
  const budgetMonth = getBudgetMonth()
  return (
    <div className="grid gap-2">
      <div className="text-lg">
        {budgetMonth.firstDate} to {budgetMonth.lastDate}
      </div>
      {budgetMonth.isCurrent && <DaysRemaining daysRemaining={budgetMonth.daysRemaining} />}
      <div>
        Total Days: {budgetMonth.totalDays}
      </div>
      {budgetMonth.isCurrent && <ProgressBar />}
    </div>
  )
}

export { BudgetMonthSummary }
