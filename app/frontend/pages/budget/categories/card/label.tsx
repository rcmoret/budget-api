import { useBudgetCategoryContext } from "@/pages/budget/categories/context-provider";
import { useBudgetCategoriesStore } from "@/pages/budget/categories/store";
import { CardLabel, CloseFormButton, EditButton } from "@/components/card";
import { Icon } from "@/components/icon";

const NameComponent = () => {
  const { category } = useBudgetCategoryContext();
  return (
    <div className="flex gap-2">
      <div>
        {category.name}
      </div>
      <div>
        <Icon name={category.iconClassName} />
      </div>
    </div>
  )
}

const CategoryCardLabel = () => {
  const { isFormShown, showForm } = useBudgetCategoryContext();
  const { onDismiss } = useBudgetCategoriesStore();

  return (
    <CardLabel label={<NameComponent />}>
      {isFormShown ? (
        <CloseFormButton onDismiss={onDismiss} />
      ) : (
        <EditButton showForm={showForm} />
      )}
    </CardLabel>
  );
};

export { CategoryCardLabel };
