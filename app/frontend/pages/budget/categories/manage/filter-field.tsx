import {
  useFilterTerm,
  isFilterTermActive,
  useSetFilterTerm,
} from "@/utils/hooks/use-filter-term";

const FilterTermTextField = () => {
  const filterTerm = useFilterTerm();
  const setFilterTerm = useSetFilterTerm();

  const inputValue = filterTerm ?? "";
  const className = [
    "input",
    "input-sm",
    isFilterTermActive(filterTerm) ? "input-secondary" : "input-info",
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
