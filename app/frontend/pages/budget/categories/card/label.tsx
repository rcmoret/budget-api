import { useBudgetCategoryContext } from "@/pages/budget/categories/context-provider";
import { useBudgetCategoriesStore } from "@/pages/budget/categories/store";
import { CardLabel, CloseFormButton, EditButton } from "@/layout/card";

const CategoryCardLabel = () => {
  const { category, isFormShown, showForm } = useBudgetCategoryContext();
  const { onDismiss } = useBudgetCategoriesStore();

  return (
    <CardLabel label={category.name}>
      {isFormShown ? (
        <CloseFormButton onDismiss={onDismiss} />
      ) : (
        <EditButton showForm={showForm} />
      )}
    </CardLabel>
  );
};

export { CategoryCardLabel };
