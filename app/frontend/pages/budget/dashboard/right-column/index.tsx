import { BudgetMonthSummary } from "@/components/budget-month";
import { getBudgetMonth } from "@/pages/budget/month-store";
import { CategoryTypeFilters, ExpenseFilters } from "./filter-buttons";
import { Discretionary } from "./discretionary";
import { AccrualToggle } from "./accrual-toggle";
import { ClearedItemsToggle } from "./cleared-items-toggle";
import { Link } from "@inertiajs/react";
import { CreateEventForm } from "./create-event-form";
import { NameFilter } from "./name-filter";
import { SortOptions } from "./sort-options";

const SetUpLink = () => {
  const { year, monthName, setupRoute } = getBudgetMonth();

  const className = ["text-primary", "underline"].join(" ");

  return (
    <div>
      <span className="text-primary">&bull; </span>
      <Link href={setupRoute} className={className}>
        Set up {monthName} {year}
      </Link>
    </div>
  );
};

const RightColumn = () => {
  const { setupRoute } = getBudgetMonth();

  return (
    <div className="grid gap-4">
      <BudgetMonthSummary>{!!setupRoute && <SetUpLink />}</BudgetMonthSummary>
      <div className="pt-4 border-t border-neutral">
        <Discretionary />
      </div>
      <div className="pt-4 border-t border-neutral">
        <ExpenseFilters />
        <CategoryTypeFilters />
      </div>
      <div className="pt-4 border-t border-neutral">
        <NameFilter />
      </div>
      <div className="pt-4 border-t border-neutral">
        <SortOptions />
      </div>
      <div className="pt-4 border-t border-neutral">
        <AccrualToggle />
        <ClearedItemsToggle />
      </div>
      <div className="grid gap-0 pt-4 border-t border-neutral">
        <CreateEventForm />
      </div>
    </div>
  );
};

export { RightColumn };
