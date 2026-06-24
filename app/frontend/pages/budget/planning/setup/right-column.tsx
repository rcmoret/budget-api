import { BudgetMonthSummary } from "@/components/budget-month"
import { Link } from "@inertiajs/react"
import { getBudgetMonth } from "../../month-store"
import { RightColumnWrapper } from "@/components/right-column-bordered"

const RightColumn = () => {
  const { month, year } = getBudgetMonth()

  const href = [
    "/budget",
    month,
    year,
    "set-up"
  ].join("/")

  const className = [
    "btn",
    "btn-sm",
    "btn-primary",
    "text-primary-content",
    "w-2/3"
  ].join(" ")

  return (
    <>
      <RightColumnWrapper>
        <BudgetMonthSummary>
          <div className="w-full flex">
            <Link href={href} method="delete" className={className}>
              Reset Categories
            </Link>
          </div>
        </BudgetMonthSummary>
      </RightColumnWrapper>
    </>
  )
}

export { RightColumn as SetupRightColumn }

