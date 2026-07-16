import { BudgetCategoryType } from "@/types/budget";
import { BudgetCategoryProvider } from "@/pages/budget/categories/context-provider";
import { BudgetCategoryCard } from "@/pages/budget/categories/card";
import { useArchivedBudgetCategories } from "@/pages/budget/categories/store";
import { NewFormButton } from "@/pages/budget/categories/manage/new-category-form";
import { ArchivedCategoriesComponent } from "./archived-category-container";
import { FilterTermTextField } from "@/pages/budget/categories/manage/filter-field";
import {
  CategoryTypeFilters,
  ExpenseFilters,
} from "@/pages/budget/categories/manage/filter-buttons";
import { HeaderComponent } from "@/layout";

const CategoryList = (props: { categories: Array<BudgetCategoryType> }) => {
  return (
    <>
      {props.categories.map((category) => (
        <BudgetCategoryProvider key={category.key} category={category}>
          <BudgetCategoryCard />
        </BudgetCategoryProvider>
      ))}
    </>
  );
};

const Header = () => {
  return (
    <HeaderComponent
      title="Manage Budget Categories"
      rightColumnComponent={<NewFormButton />}
    />
  );
};

const RightColumn = () => {
  const archivedCategories = useArchivedBudgetCategories({
    applyFilter: false,
  });

  return (
    <>
      <FilterTermTextField />
      {!!archivedCategories.length && <ArchivedCategoriesComponent />}
      <ExpenseFilters />
      <CategoryTypeFilters />
    </>
  );
};

export { CategoryList, Header, RightColumn };
