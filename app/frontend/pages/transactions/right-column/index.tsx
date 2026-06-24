import { BudgetMonthSummary } from "@/components/budget-month"
import { RightColumnWrapper } from "@/components/right-column-bordered"

const RightColumn = () => {
  return (
    <RightColumnWrapper>
      <BudgetMonthSummary />
    </RightColumnWrapper>
  )
}

export { RightColumn }
