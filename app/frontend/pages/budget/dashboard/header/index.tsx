import { pageHeadingClassName } from "@/layout";
import { getBudgetMonth } from "@/pages/budget/month-store"
import { NeighborLinks } from "@/components/neighbor-links"

const BudgetDashboardNeighborLinks = () => {
  const budgetMonth = getBudgetMonth()

  const nextMonth = {
    href: budgetMonth.nextMonth.href,
    label: budgetMonth.nextMonth.monthName
  }
  const previousMonth = {
    href: budgetMonth.previousMonth.href,
    label: budgetMonth.previousMonth.monthName
  }

  return (
    <NeighborLinks
      nextMonth={nextMonth}
      previousMonth={previousMonth}
    />
  )
}

const Header = () => {
  const budgetMonth = getBudgetMonth()

  return (
    <>
      <h1 className={pageHeadingClassName}>
        {budgetMonth.monthName} {budgetMonth.year} Budget
      </h1>
      <BudgetDashboardNeighborLinks />
    </>
  );
};

export { Header }
