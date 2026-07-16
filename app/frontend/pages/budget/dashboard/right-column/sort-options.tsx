import { Icon } from "@/components/icon";
import { SortField, useBudgetDashboardStore } from "../store";

const FIELD_LABELS: Record<SortField, string> = {
  name: "Name",
  amount: "Amount",
  remaining: "Remaining",
  difference: "Difference",
  spent: "Spent",
};

const SortOptions = () => {
  const sortField = useBudgetDashboardStore((s) => s.sortField);
  const sortDirection = useBudgetDashboardStore((s) => s.sortDirection);
  const sortItems = useBudgetDashboardStore((s) => s.sortItems);

  const toggleDirection = () =>
    sortItems(sortField, sortDirection === "asc" ? "desc" : "asc");

  const directionLabel =
    sortDirection === "asc" ? "Sort ascending" : "Sort descending";

  return (
    <div className="grid gap-2">
      <label htmlFor="budget-item-sort" className="text-sm">
        Sort By
      </label>
      <div className="flex gap-2">
        <select
          id="budget-item-sort"
          className="select select-sm select-info flex-1"
          value={sortField}
          onChange={(e) =>
            sortItems(e.target.value as SortField, sortDirection)
          }
        >
          {(Object.keys(FIELD_LABELS) as Array<SortField>).map((field) => (
            <option key={field} value={field}>
              {FIELD_LABELS[field]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-sm btn-info"
          onClick={toggleDirection}
          aria-label={directionLabel}
          title={directionLabel}
        >
          <Icon name={sortDirection === "asc" ? "arrow-up" : "arrow-down"} />
        </button>
      </div>
    </div>
  );
};

export { SortOptions };
