import {
  useBudgetCategoriesStore,
  useIsFilterTermActive,
} from "@/pages/budget/categories/store";

const FilterTermTextField = () => {
  const filterTerm = useBudgetCategoriesStore((s) => s.filterTerm);
  const setFilterTerm = useBudgetCategoriesStore((s) => s.setFilterTerm);
  const isFilterTermActive = useIsFilterTermActive();

  const inputValue = filterTerm ?? "";
  const className = [
    "input",
    "input-sm",
    isFilterTermActive ? "input-secondary" : "input-info",
  ].join(" ");

  return (
    <search className="grid gap-2">
      <label htmlFor="category-filter" className="label">
        Filter Categories
      </label>
      <input
        id="category-filter"
        type="search"
        className={className}
        value={inputValue}
        onChange={(e) => setFilterTerm(e.target.value)}
        placeholder=""
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-controls="category-list"
      />
    </search>
  );
};

export { FilterTermTextField };
