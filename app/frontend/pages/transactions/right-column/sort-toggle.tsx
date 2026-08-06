import { Icon } from "@/components/icon";
import { useTransactionSort } from "../store";

const SortToggle = () => {
  const { sortDirection, toggleSortDirection } = useTransactionSort();

  const label =
    sortDirection === "asc"
      ? "Sort by clearance date ascending"
      : "Sort by clearance date descending";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">Sort by Clearance Date</span>
      <button
        type="button"
        className="btn btn-sm btn-info"
        onClick={toggleSortDirection}
        aria-label={label}
        title={label}
      >
        <Icon name={sortDirection === "asc" ? "arrow-up" : "arrow-down"} />
      </button>
    </div>
  );
};

export { SortToggle };
