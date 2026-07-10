import { useEffect } from "react";
import { create } from "zustand";

type FilterStoreState = {
  filterTerm: string | null;
  setFilterTerm: (term: string | null) => void;
};

const useFilterTermStore = create<FilterStoreState>((set) => ({
  filterTerm: null,
  setFilterTerm: (filterTerm) => set({ filterTerm }),
}));

// --- Hooks: call only at the top level of a component or custom hook ---

const useFilterTerm = () => useFilterTermStore((s) => s.filterTerm ?? "");

const useSetFilterTerm = () => useFilterTermStore((s) => s.setFilterTerm);

const useIsFilterTermActive = () => isFilterTermActive(useFilterTerm());

const useInitFilterTermStore = (filterTerm: string | null) => {
  const setFilterTerm = useSetFilterTerm();

  useEffect(() => {
    setFilterTerm(filterTerm);
  }, [filterTerm, setFilterTerm]);
};

// --- Pure helpers: take the filter term as an argument, so they are safe to
//     call inside callbacks, loops, and useMemo ---

const isFilterTermActive = (filterTerm: string) => filterTerm.length > 2;

const matchesFilterTerm = <K extends string = "name", T extends Record<K, string> = Record<K, string>>(
  filterTerm: string,
  item: T,
  key: K = "name" as K,
) => {
  if (!isFilterTermActive(filterTerm)) return true;
  const expression = new RegExp(filterTerm, "i");
  return !!item[key].match(expression);
};

export {
  useFilterTerm,
  useSetFilterTerm,
  useIsFilterTermActive,
  useInitFilterTermStore,
  isFilterTermActive,
  matchesFilterTerm,
};
