import { createFilterGroup } from "@/components/filter-button";
import { ExpenseFilterItem, FixedOrVariableFilterItem, useBudgetDashboardStore } from "../store";

const Row = (props: { children: React.ReactNode }) => {
  const className = ["w-full", "flex", "justify-between"].join(" ");

  return <div className={className}>{props.children}</div>;
};

const Cell = (props: { children: React.ReactNode }) => {
  const className = [
    "w-1/2",
    "px-2",
    "py-1",
    "rounded",
    "text-sm",
    "text-left",
  ].join(" ");
  return <div className={className}>{props.children}</div>;
};

const ExpenseFilters = () => {
  const { FilterButtonGroup, FilterButton } =
    createFilterGroup<ExpenseFilterItem>();
  const expenseOrRevenueFilter = useBudgetDashboardStore(
    (s) => s.expenseOrRevenueFilter,
  );
  const setExpenseOrRevenueFilter = useBudgetDashboardStore(
    (s) => s.setExpenseOrRevenueFilter,
  );

  return (
    <FilterButtonGroup
      setFilterItem={setExpenseOrRevenueFilter}
      currentItem={expenseOrRevenueFilter}
      label="Expense or Revenue"
    >
      <Row>
        <Cell>
          <FilterButton filterItem="expense">Expense</FilterButton>
        </Cell>
        <Cell>
          <FilterButton filterItem="revenue">Revenue</FilterButton>
        </Cell>
      </Row>
    </FilterButtonGroup>
  );
};

const CategoryTypeFilters = () => {
  const { FilterButtonGroup, FilterButton } =
    createFilterGroup<FixedOrVariableFilterItem>();
  const fixedOrVariableFilter = useBudgetDashboardStore(
    (s) => s.fixedOrVariableFilter,
  );
  const setFixedOrVariableFilter = useBudgetDashboardStore(
    (s) => s.setFixedOrVariableFilter,
  );

  return (
    <FilterButtonGroup
      setFilterItem={setFixedOrVariableFilter}
      currentItem={fixedOrVariableFilter}
      label="Fixed or Variable"
    >
      <Row>
        <Cell>
          <FilterButton filterItem="fixed">Fixed</FilterButton>
        </Cell>
        <Cell>
          <FilterButton filterItem="variable">Variable</FilterButton>
        </Cell>
      </Row>
    </FilterButtonGroup>
  );
};

export { CategoryTypeFilters, ExpenseFilters };
