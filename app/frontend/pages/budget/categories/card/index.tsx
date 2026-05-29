import { CategoryCardLabel } from "./label";
import { ActiveItemCard, ArchivedItemCard } from "@/layout/card";
import { router } from "@inertiajs/react";
import { useBudgetCategoryContext } from "@/pages/budget/categories/context-provider";
import { BudgetCategoryForm } from "@/pages/budget/categories/form";
import { BudgetCategoryShow } from "./show";
import { redirectQueryParams } from "@/utils/redirect_params";

const budgetCategoryManageReturnQueryParams = redirectQueryParams([
  "budget",
  "categories",
]);

const ArchivedBudgetCategoryCard = () => {
  const { category } = useBudgetCategoryContext();

  const handleUnarchive = () => {
    router.put(
      `/budget/category/${category.key}?${budgetCategoryManageReturnQueryParams}`,
      {
        category: { is_archived: false },
      },
    );
  };
  return (
    <ArchivedItemCard
      name={category.name}
      onClick={handleUnarchive}
      title="unarchive budget category"
      itemKey={category.key}
      id={category.objectKey}
    >
      <BudgetCategoryShow />
    </ArchivedItemCard>
  );
};

const InnerCardComponent = () => {
  const { isFormShown } = useBudgetCategoryContext();

  if (isFormShown) {
    return <BudgetCategoryForm />;
  } else {
    return <BudgetCategoryShow />;
  }
};

const ActiveBudgetCategoryCard = () => {
  const { category, isFormShown } = useBudgetCategoryContext();

  return (
    <ActiveItemCard
      isFormShown={isFormShown}
      label={<CategoryCardLabel />}
      id={category.objectKey}
    >
      <InnerCardComponent />
    </ActiveItemCard>
  );
};

const BudgetCategoryCard = () => {
  const { category } = useBudgetCategoryContext();

  if (category.isArchived) {
    return <ArchivedBudgetCategoryCard />;
  } else {
    return <ActiveBudgetCategoryCard />;
  }
};

export { BudgetCategoryCard };
