import { BudgetMonthSummary } from "@/components/budget-month";
import { getBudgetMonth } from "@/pages/budget/month-store";
import {
  CategoryTypeFilters,
  ExpenseFilters,
} from "./filter-buttons";
import { Discretionary } from "./discretionary"
import { AccrualToggle } from "./accrual-toggle";
import { ClearedItemsToggle } from "./cleared-items-toggle";
import { Link } from "@inertiajs/react";
import { RightColumnWrapper } from "@/components/right-column-bordered";

const SetUpLink = () => {
  const { month, year, monthName } = getBudgetMonth()

  const className = [
    "text-primary",
    "underline"
  ].join(" ")

  return (
    <div>
      <span className="text-primary">
        &bull;{" "}
      </span>
      <Link href={`/budget/${month}/${year}/set-up`} className={className}>
        Set up {monthName} {year}
      </Link>
    </div>
  )
}

const RightColumn = () => {
  const { isSetUp } = getBudgetMonth()

  return (
    <RightColumnWrapper>
      <div className="grid gap-8">
        <BudgetMonthSummary>
          {!isSetUp && <SetUpLink />}
        </BudgetMonthSummary >
        <div className="pt-4 border-t border-neutral">
          <Discretionary />
        </div>
        <div className="pt-4 border-t border-neutral">
          <ExpenseFilters />
          <CategoryTypeFilters />
        </div>
        <div className="grid gap-0 px-4 pt-4 border-t border-neutral">
          <AccrualToggle />
          <ClearedItemsToggle />
        </div>
      </div>
    </RightColumnWrapper>
  )
}

export { RightColumn };
