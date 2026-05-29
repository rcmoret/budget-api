import {
  useArchivedBudgetCategories,
  useBudgetCategoriesStore,
} from "@/pages/budget/categories/store";
import { ToggleSlider } from "@/components/slider";

const ArchivedCategoriesComponent = () => {
  const archivedCategories = useArchivedBudgetCategories({
    applyFilter: false,
  });

  const archivedCount = archivedCategories.length;
  const showArchivedCategories = useBudgetCategoriesStore(
    (s) => s.showArchivedCategories,
  );
  const toggleArchivedCategories = useBudgetCategoriesStore(
    (s) => s.toggleArchivedCategories,
  );
  const label = showArchivedCategories
    ? "Showing all archived categories"
    : `${archivedCount} archived categories not shown`;

  const buttonTitle = showArchivedCategories
    ? "hide archived categories"
    : "show archived categories";

  return (
    <div className="flex flex-row justify-between mt-4">
      <label htmlFor="toggle-archived-categories" className="text-sm">
        {label}
      </label>
      <div className="tooltip tooltip-left" data-tip={buttonTitle}>
        <ToggleSlider
          toggleValue={showArchivedCategories}
          onClick={toggleArchivedCategories}
          id="toggle-archived-categories"
        />
      </div>
    </div>
  );
};

export { ArchivedCategoriesComponent };
