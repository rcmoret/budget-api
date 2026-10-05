import { Link, useForm } from "@inertiajs/react";
import { BudgetMonthSummary } from "@/components/budget-month";
import { BudgetSummaryComponent } from "@/components/budget-summary";
import { ToggleSlider } from "@/components/slider";
import { inputAmount } from "@/lib/adjustment-amount-store";
import { getBudgetMonth } from "@/pages/budget/month-store";
import {
  orderedGroups,
  useRolloverGroups,
  useRolloverStore,
  useShowReviewedCategories,
} from "../store";
import { UnappliedTarget } from "./unapplied-target";

const RolloverSummary = () => {
  const groups = orderedGroups(useRolloverGroups());
  const total = groups.reduce(
    (sum, group) => sum + group.metadata.sum.cents,
    0,
  );

  const values = [
    ...groups.map((group) => ({
      key: group.key,
      label: group.label,
      amount: group.metadata.sum,
    })),
    { key: "total", label: "Total", amount: inputAmount({ cents: total }) },
  ];

  return <BudgetSummaryComponent label="Not Rolled Over" values={values} />;
};

// Creates the rollover events in the upcoming month and closes out this one.
// The server re-checks that everything is reviewed.
const SubmitButton = () => {
  const isSubmittable = useRolloverStore((s) => s.isSubmittable);
  const { month, year } = getBudgetMonth();
  const { post, processing } = useForm();
  const isDisabled = !isSubmittable || processing;

  const onClick = () => post(["/budget", month, year, "roll-over"].join("/"));

  const className = [
    "btn",
    "btn-sm",
    ...(isDisabled ? [] : ["btn-success", "text-success-content"]),
    "w-full",
  ].join(" ");

  return (
    <div className="w-full flex">
      <button
        type="button"
        className={className}
        disabled={isDisabled}
        onClick={onClick}
      >
        Roll Over
      </button>
    </div>
  );
};

// Rebuilds the review data from the current budget items, dropping any
// adjustments and targets picked so far.
const ResetButton = () => {
  const { month, year } = getBudgetMonth();
  const href = ["/budget", month, year, "roll-over"].join("/");

  const className = [
    "btn",
    "btn-sm",
    "btn-primary",
    "text-primary-content",
    "w-full",
  ].join(" ");

  return (
    <div className="w-full">
      <Link
        href={href}
        method="delete"
        as="button"
        className={className}
        preserveState={false}
      >
        Reset Categories
      </Link>
    </div>
  );
};

const RolloverRightColumn = () => {
  const { toggleValue, toggle } = useShowReviewedCategories();
  const label = "Toggle Reviewed Category Visibility";

  return (
    <BudgetMonthSummary>
      <RolloverSummary />
      <div className="flex flex-row justify-between items-center text-sm">
        <label htmlFor="toggle-reviewed-categories" className="text-sm">
          {label}
        </label>
        <div className="tooltip tooltip-left" data-tip={label}>
          <ToggleSlider
            toggleValue={toggleValue}
            onClick={toggle}
            id="toggle-reviewed-categories"
          />
        </div>
      </div>
      <UnappliedTarget />
      <ResetButton />
      <SubmitButton />
    </BudgetMonthSummary>
  );
};

export { RolloverRightColumn };
