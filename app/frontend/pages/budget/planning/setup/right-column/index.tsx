import { Link } from "@inertiajs/react";
import { getBudgetMonth } from "@/pages/budget/month-store";
import {
  getCurrentGroup,
  useToggleReviewedCategoryVisibility,
} from "@/pages/budget/planning/setup/store";
import { ToggleSlider } from "@/components/slider";
import { BudgetMonthSummary } from "@/components/budget-month";
import { SetupBudgetSummary } from "./summary";
import { SubmitButton } from "./submit-button";
import { CreateEventSelect } from "./add-category";

const RightColumn = () => {
  const { month, year } = getBudgetMonth();
  const {
    toggleValue: showReviewedCategories,
    setShowReviewedCategories: toggleReviewedCatgoryVisibility,
  } = useToggleReviewedCategoryVisibility();
  const { scopes } = getCurrentGroup();
  const buttonTitle = "Toggle Reviewed Category Visiblity";
  const label = buttonTitle;

  const href = ["/budget", month, year, "set-up"].join("/");

  const className = [
    "btn",
    "btn-sm",
    "btn-primary",
    "text-primary-content",
    "w-full",
  ].join(" ");

  return (
    <BudgetMonthSummary>
      <SetupBudgetSummary />
      <div className="flex flex-row justify-between items-center text-sm">
        <label htmlFor="toggle-cleared-items" className="text-sm">
          {label}
        </label>
        <div className="tooltip tooltip-left" data-tip={buttonTitle}>
          <ToggleSlider
            toggleValue={showReviewedCategories}
            onClick={toggleReviewedCatgoryVisibility}
            id="toggle-cleared-items"
          />
        </div>
      </div>
      <div className="w-full flex justify-between text-lg">
        <CreateEventSelect
          month={month}
          year={year}
          eventContext="setup"
          scopes={scopes}
        />
      </div>
      <div className="w-full">
        <Link
          href={href}
          method="delete"
          className={className}
          preserveState={false}
        >
          Reset Categories
        </Link>
      </div>
      <SubmitButton />
    </BudgetMonthSummary>
  );
};

export { RightColumn as SetupRightColumn };
