import { pageHeadingClassName } from "@/layout";
import { NeighborLinks } from "@/components/neighbor-links"
import { getBudgetMonth } from "@/pages/budget/month-store";
import { getNeighborLinks } from "@/pages/budget/neighbor-links-store";
import { getFeaturedAccount } from "../store";

const Symbol = () => {
  return <div className="inline-block -translate-y-1 text-base">&#9900;</div>
}

const TransactionIndexHeader = () => {
  const budgetMonth = getBudgetMonth()
  const featuredAccount = getFeaturedAccount()
  const { previous, next } = getNeighborLinks()

  return (
    <>
      <h1 className={pageHeadingClassName}>
        {featuredAccount.name} <Symbol /> {budgetMonth.monthName} {budgetMonth.year}
      </h1>
      <NeighborLinks
        previousMonth={previous}
        nextMonth={next}
      />
    </>
  );
};

export { TransactionIndexHeader }
