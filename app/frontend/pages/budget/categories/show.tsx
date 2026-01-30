import { BudgetCategory } from "@/types/budget";
import { useToggle } from "@/lib/hooks/useToogle";
import { Card, TIcon } from "@/pages/budget/categories/Card";
import { CategoryForm } from "./Form";
import BudgetSummaryChart from "@/components/BudgetSummaryChart";
import { CategoryFormProvider } from "@/pages/budget/categories/category-form-context";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-2 py-4">
      <div className="text-xl">Manage Category</div>
      <div className="w-full">{children}</div>
    </div>
  );
};

interface BudgetCategoryWithSummaries extends BudgetCategory {
  summaries: Array<{
    month: number;
    year: number;
    budgeted: number;
    transactionsTotal: number;
  }>;
}

const BudgetCategoryShowComponent = (props: {
  category: BudgetCategoryWithSummaries;
  icons: TIcon[];
}) => {
  const { category } = props;

  const [isFormShown, toggleForm] = useToggle(false);

  if (!isFormShown) {
    return (
      <Wrapper>
        <Card openForm={toggleForm} />
        {category.summaries && category.summaries.length > 0 && (
          <div className="mt-6">
            <BudgetSummaryChart summaries={category.summaries} />
          </div>
        )}
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <CategoryFormProvider
          category={category}
          closeForm={toggleForm}
          isFormShown={true}
          isNew={false}
        >
          <CategoryForm />
        </CategoryFormProvider>
      </Wrapper>
    );
  }
};

export default BudgetCategoryShowComponent;
