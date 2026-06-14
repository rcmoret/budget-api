import { ToggleSlider } from "@/components/slider";
import { useShowAccruals, useToggleShowAccruals } from "@/layout/app-config-store";
import { useBudgetDashboardStore, useClearedItemsVisibilityToggle } from "../store";
import {
  CategoryTypeFilters,
  ExpenseFilters,
} from "./filter-buttons";
import { Link } from "@inertiajs/react";

const DaysRemaining = (props: { daysRemaining: number }) => {
  return (
    <div>
      Days Remaining: {props.daysRemaining}
    </div>
  )
}

const ProgressBar = () => {
  const budgetMonth = useBudgetDashboardStore(({ budgetMonth }) => budgetMonth)
  const daysElapsed = budgetMonth.totalDays - budgetMonth.daysRemaining
  const percentCompleted = (100.0 * daysElapsed / budgetMonth.totalDays)
  return (
    <progress className="progress w-full progress-secondary" value={percentCompleted} max="100" />
  )
}

const NeighborLink = (props: { children: React.ReactNode; href: string }) => {
  const { children, href } = props
  return (
    <div className="bg-primary py-2 rounded shadow-md">
      <Link href={href} className="bg-primary text-primary-content w-full">
        <div className="h-full flex justify-center gap-2 w-full items-center">
          {children}
        </div>
      </Link>
    </div>
  )
}

const NeighborLinks = () => {
  const budgetMonth = useBudgetDashboardStore(({ budgetMonth }) => budgetMonth)
  console.log({ budgetMonth })
  const { previousMonth, nextMonth } = budgetMonth

  return (
    <div className="grid grid-cols-[5fr_3fr_5fr] w-full">
      <NeighborLink href={previousMonth.href}>
        <div className="text-info text-lg">
          &#x2190;
        </div>
        <div>
          {previousMonth.monthName}
        </div>
      </NeighborLink>
      <div></div>
      <NeighborLink href={nextMonth.href}>
        <div>
          {nextMonth.monthName}
        </div>
        <div className="text-info text-lg">
          &#x2192;
        </div>
      </NeighborLink>
    </div>
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
  const budgetMonth = useBudgetDashboardStore(({ budgetMonth }) => budgetMonth)

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
      <ExpenseFilters />
      <CategoryTypeFilters />
      <div className="grid gap-0 px-4 pt-2 border-t border-neutral">
        <AccrualToggle />
        <ClearedItemsToggle />
      </div>
    </div>
  )
}

export { BudgetMonth, NeighborLinks }
