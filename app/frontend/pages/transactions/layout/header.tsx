import { pageHeadingClassName } from "@/layout";
import { NeighborLinks } from "@/components/neighbor-links"
import { getBudgetMonth } from "@/pages/budget/month-store";
import { getFeaturedAccount } from "../store";

const Symbol = () => {
  return <div className="inline-block -translate-y-1 text-base">&#9900;</div>
}

const TransactionIndexHeader = () => {
  const budgetMonth = getBudgetMonth()
  const featuredAccount = getFeaturedAccount()

  const nextMonth = {
    href: budgetMonth.nextMonth.href,
    label: budgetMonth.nextMonth.monthName
  }
  const previousMonth = {
    href: budgetMonth.previousMonth.href,
    label: budgetMonth.previousMonth.monthName
  }

  return (
    <>
      <h1 className={pageHeadingClassName}>
        {featuredAccount.name} <Symbol /> {budgetMonth.monthName} {budgetMonth.year}
      </h1>
      <NeighborLinks
        previousMonth={previousMonth}
        nextMonth={nextMonth}
      />
    </>
  );
};

export { TransactionIndexHeader }
