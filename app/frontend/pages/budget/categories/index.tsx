import {
  CategoryList,
  Header,
  RightColumn,
} from "@/pages/budget/categories/manage";
import { BudgetCategoryType } from "@/types/budget";
import { PageComponent } from "@frontend/layout";
import {
  useActiveBudgetCategories,
  useArchivedBudgetCategories,
  useInitBudgetCategoriesStore,
  useBudgetCategoriesStore,
  useShowNewCategoryForm,
} from "@/pages/budget/categories/store";
import { NewCategoryForm } from "@/pages/budget/categories/manage/new-category-form";

const CategoryIndex = (props: { metadata: { pageName: string; namespace: string } }) => {
  const { metadata } = props;
  const activeCategories = useActiveBudgetCategories();
  const filteredArchivedCategories = useArchivedBudgetCategories();
  const showArchivedCategories = useBudgetCategoriesStore(
    (s) => s.showArchivedCategories,
  );
  const showNewCategoryForm = useShowNewCategoryForm();

  return (
    <PageComponent
      mainId="manage-budget-categories"
      header={<Header />}
      metadata={metadata}
      rightColumn={<RightColumn />}
    >
      <div id="category-list" className="flex flex-col gap-2">
        {showNewCategoryForm && <NewCategoryForm />}
        <CategoryList categories={activeCategories} />
        {showArchivedCategories && (
          <>
            <div className="text-lg my-4">Archived Categories</div>
            <CategoryList categories={filteredArchivedCategories} />
          </>
        )}
      </div>
    </PageComponent>
  );
};

type ManageCategoriesProps = {
  categories: Array<BudgetCategoryType>;
  metadata: {
    namespace: string;
    pageName: string;
  };
};

const Categories = (props: ManageCategoriesProps) => {
  const { metadata, categories } = props;
  useInitBudgetCategoriesStore(categories);

  return <CategoryIndex metadata={metadata} />;
};

export default Categories;
