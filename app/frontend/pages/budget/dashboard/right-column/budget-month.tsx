import { ToggleSlider } from "@/components/slider";
import { useShowAccruals, useToggleShowAccruals } from "@/layout/app-config-store";
import { getBudgetMonth } from "@/pages/budget/month-store"
import { useClearedItemsVisibilityToggle } from "../store";
import {
  CategoryTypeFilters,
  ExpenseFilters,
} from "./filter-buttons";
import { Discretionary } from "./discretionary"
import { BudgetMonthSummary } from "@/components/budget-month";

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

const AccrualToggle = () => {
  const showAccruals = useShowAccruals()
  const toggleAccruals = useToggleShowAccruals()
  const label = "Toggle Accruals"
  const buttonTitle = label

  return (
    <div className="flex flex-row justify-between">
      <label htmlFor="toggle-accrual-items" className="text-sm">
        {label}
      </label>
      <div className="tooltip tooltip-left" data-tip={buttonTitle}>
        <ToggleSlider
          toggleValue={showAccruals}
          onClick={toggleAccruals}
          id="toggle-accrual-items"
        />
      </div>
    </div>
  );
}

const ClearedItemsToggle = () => {
  const [showClearedItems, toggleClearedItems] = useClearedItemsVisibilityToggle()
  const label = "Toggle Cleared Item Visibility"
  const buttonTitle = label

  return (
    <div className="flex flex-row justify-between">
      <label htmlFor="toggle-cleared-items" className="text-sm">
        {label}
      </label>
      <div className="tooltip tooltip-left" data-tip={buttonTitle}>
        <ToggleSlider
          toggleValue={showClearedItems}
          onClick={toggleClearedItems}
          id="toggle-cleared-items"
        />
      </div>
    </div>
  );
}

const BudgetMonth = () => {
  return (
    <div className="grid gap-8">
      <BudgetMonthSummary />
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
  )
}

export { BudgetMonth }
