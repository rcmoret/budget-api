import { getBudgetMonth } from "../../month-store"
import { pageHeadingClassName } from "@/layout";

const SetupHeader = () => {
  const budgetMonth = getBudgetMonth()
  return (
    <h1 className={pageHeadingClassName}>
      Planning: Setup {budgetMonth.monthName} {budgetMonth.year}
    </h1>
  )
}

export { SetupHeader }
