import { pageHeadingClassName } from "@/layout";
import { getBudgetMonth } from "@/pages/budget/month-store"
import { getNeighborLinks } from "@/pages/budget/neighbor-links-store"
import { NeighborLinks } from "@/components/neighbor-links"

const BudgetDashboardNeighborLinks = () => {
  const { previous, next } = getNeighborLinks()

  return (
    <NeighborLinks
      nextMonth={next}
      previousMonth={previous}
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
