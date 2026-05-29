import { createContext, useContext } from "react";
import { selectableItemBaseClasses } from "./selectable";

const filterButtonClassName = [
  ...selectableItemBaseClasses,
  "outline-secondary/70",
  "hover:outline-secondary",
  // pressed classes
  "aria-pressed:outline-2",
  "aria-pressed:outline-secondary",
  "aria-pressed:bg-secondary/5",
  // disabled classes
  "disabled:opacity-60",
  "disabled:cursor-not-allowed",
  "disabled:hover:outline-secondary/70",
].join(" ");

const createFilterGroup = <T,>() => {
  type FilterGroupContextValue = {
    currentItem: T | null;
    setFilterItem: (item: T | null) => void;
  };

  const FilterGroupContext = createContext<FilterGroupContextValue | null>(
    null,
  );

  const useFilterGroupContext = () => {
    const context = useContext(FilterGroupContext);

    if (!context) {
      throw new Error("FilterButton must be used within a FilterButtonGroup");
    }

    return context;
  };

  type FilterButtonGroupProps = {
    children: React.ReactNode;
    label: string;
    currentItem: T | null;
    setFilterItem: (item: T | null) => void;
  };

  const FilterButtonGroup = (props: FilterButtonGroupProps) => {
    const value: FilterGroupContextValue = {
      currentItem: props.currentItem,
      setFilterItem: props.setFilterItem,
    };

    return (
      <FilterGroupContext.Provider value={value}>
        <div
          role="group"
          aria-label={props.label}
          className="w-full p-1 grid gap-2"
        >
          <span className="text-sm">{props.label}</span>
          {props.children}
        </div>
      </FilterGroupContext.Provider>
    );
  };

  type FilterButtonProps = {
    children: React.ReactNode;
    filterItem: T;
    disabled?: boolean;
  };

  const FilterButton = (props: FilterButtonProps) => {
    const { children, filterItem, disabled = false } = props;
    const { currentItem, setFilterItem } = useFilterGroupContext();
    const pressed = currentItem === filterItem;

    return (
      <button
        type="button"
        aria-pressed={pressed}
        disabled={disabled}
        onClick={() => setFilterItem(pressed ? null : filterItem)}
        className={filterButtonClassName}
      >
        {children}
        <input
          type="radio"
          readOnly
          checked={pressed}
          aria-hidden={true}
          className="radio radio-sm radio-secondary"
        />
      </button>
    );
  };

  return { FilterButtonGroup, FilterButton };
};

export { createFilterGroup };
