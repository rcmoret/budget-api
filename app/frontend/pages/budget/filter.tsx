// import { useBudgetDashboardContext } from "@/pages/budget/dashboard";
type FilterComponentProps = {
  id: string;
  filterTerm: string;
  setFilterTerm: (s: string) => void;
};

const FilterComponent = (props: FilterComponentProps) => {
  const { id, filterTerm, setFilterTerm } = props;

  const onChange = (ev) => {
    setFilterTerm(ev.target.value);
  };

  return (
    <div className="flex flex-col w-full py-4 px-2 gap-2">
      <label htmlFor={id}>Filter items</label>
      <div>
        <input
          id={id}
          type="text"
          className="border border-gray-300 rounded h-input-lg px-1"
          onChange={onChange}
          value={filterTerm}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Filter budget items by name"
          placeholder="Type to filter..."
        />
      </div>
    </div>
  );
};

export { FilterComponent };
