import { NewBudgetCategoryType } from "@/types/budget";
import { BudgetCategoryProvider } from "@/pages/budget/categories/context-provider";
import { ActiveItemCard, CardLabel, CloseFormButton } from "@/layout/card";
import {
  useBudgetCategoriesStore,
  useShowNewCategoryForm,
} from "@/pages/budget/categories/store";
import { BudgetCategoryForm } from "@/pages/budget/categories/form";

const NewFormCardLabel = () => {
  const { onDismiss } = useBudgetCategoriesStore();
  return (
    <CardLabel label="New Category">
      <CloseFormButton onDismiss={onDismiss} />
    </CardLabel>
  );
};

const NewCategoryForm = () => {
  const newCategoryKey = useBudgetCategoriesStore((s) => s.newCategoryKey);
  const c: NewBudgetCategoryType = {
    key: newCategoryKey,
    objectKey: "",
    name: "",
    slug: "",
    isExpense: null,
    isMonthly: null,
    createdAt: "",
    archivedAt: null,
    isAccrual: false,
    isArchived: false,
    defaultAmount: null,
  };

  return (
    <BudgetCategoryProvider key={c.key} category={c}>
      <ActiveItemCard
        isFormShown={true}
        label={<NewFormCardLabel />}
        id={c.objectKey}
      >
        <BudgetCategoryForm />
      </ActiveItemCard>
    </BudgetCategoryProvider>
  );
};

const NewFormButton = () => {
  const onDismiss = useBudgetCategoriesStore((s) => s.onDismiss);
  const showNewCategoryForm = useBudgetCategoriesStore(
    (s) => s.showNewCategoryForm,
  );
  const isNewCategoryFormShown = useShowNewCategoryForm();

  const className = ["btn", "btn-sm", "btn-success", "btn-wide"].join(" ");
  if (isNewCategoryFormShown) {
    return (
      <div>
        <button
          type="button"
          className={className}
          onClick={onDismiss}
          title="close new account form"
        >
          Close Form
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          type="button"
          className={className}
          onClick={showNewCategoryForm}
          title="open new budget category form"
        >
          + New Category
        </button>
      </div>
    );
  }
};

export { NewCategoryForm, NewFormButton };
