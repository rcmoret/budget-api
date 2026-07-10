import {
  useFilterTerm,
  useIsFilterTermActive,
  useSetFilterTerm,
} from "@/utils/hooks/use-filter-term";

const NameFilter = () => {
  const filterTerm = useFilterTerm();
  const setFilterTerm = useSetFilterTerm();
  const isFilterTermActive = useIsFilterTermActive();

  const className = [
    "input",
    "input-sm",
    isFilterTermActive ? "input-secondary" : "input-info",
  ].join(" ");

  return (
    <search className="grid gap-2 pt-4 border-t border-neutral">
      <label htmlFor="budget-item-filter" className="label">
        Filter Items
      </label>
      <input
        id="budget-item-filter"
        type="search"
        className={className}
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
        placeholder=""
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-controls="budget-dashboard"
      />
    </search>
  );
};

export { NameFilter };
