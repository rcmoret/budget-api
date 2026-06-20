import { BudgetMonthSummary } from "@/components/budget-month"

const RightColumn = () => {
  return (
    <>
      <div className="border rounded border-neutral p-4">
        <BudgetMonthSummary />
      </div>
    </>
  )
}

export { RightColumn }
