import { BudgetMonthSummary } from "@/components/budget-month";
import { getFeaturedAccount } from "../store";
import { Link } from "@inertiajs/react";
import { TransferForm } from "./transfer-form";

const RightColumn = () => {
  const featuredAccount = getFeaturedAccount();

  return (
    <BudgetMonthSummary>
      <div className="py-4 border-y border-neutral text-right font-semibold text-lg">
        <Link
          href={featuredAccount.editRoute}
          className="border-2 border-primary/40 rounded-full px-4 py-1 shadow-sm"
        >
          Edit {featuredAccount.name}
        </Link>
      </div>
      <div className="pt-4 border-t border-neutral">
        <TransferForm />
      </div>
    </BudgetMonthSummary>
  );
};

export { RightColumn };
