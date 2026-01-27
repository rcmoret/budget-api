// import { useBudgetDashboardContext } from "@/pages/budget/dashboard";
type FilterComponentProps = {
  filterTerm: string;
  setFilterTerm: (s: string) => void;
};

const FilterComponent = (props: FilterComponentProps) => {
  const { filterTerm, setFilterTerm } = props;

  const onChange = (ev) => {
    setFilterTerm(ev.target.value);
  };

  return (
    <div className="flex flex-col w-full py-4 px-2 gap-2">
      <div>Filter items</div>
      <div>
        <input
          type="text"
          className="border border-gray-300 rounded h-input-lg px-1"
          onChange={onChange}
          value={filterTerm}
        />
      </div>
    </div>
  );
};

export { FilterComponent };
