import { useState } from "react";
import { byName as sortByName } from "@/lib/sort_functions";
import { BudgetCategory } from "@/types/budget";
import { CardWrapper as Card, TIcon } from "@/pages/budget/categories/Card";
import { CategoryForm } from "@/pages/budget/categories/Form";
import { Button } from "@/components/common/Button";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { Icon } from "@/components/common/Icon";
import { CategoriesProvider } from "@/pages/budget/categories/CategoriesContext";
import { CategoryFormProvider } from "@/pages/budget/categories/category-form-context";
import { ActionButton } from "@/lib/theme/buttons/action-button";

const AddNewComponent = (props: {
  icons: Array<TIcon>;
  isFormShown: boolean;
  closeForm: () => void;
  openForm: () => void;
}) => {
  const { isFormShown, openForm, closeForm } = props;

  if (!isFormShown) {
    return (
      <div>
        <ActionButton
          id="new-category-form"
          onClick={openForm}
          icon="plus-circle"
          title="Toggle add new category form"
        >
          Add new
        </ActionButton>
      </div>
    );
  } else {
    const newCategory: NewBudgetCategory = {
      key: generateKeyIdentifier(),
      name: "",
      slug: "",
      archivedAt: null,
      defaultAmount: 0,
      iconKey: null,
      isAccrual: false,
      isArchived: false,
      isExpense: null,
      isMonthly: null,
      isPerDiemEnabled: false,
    };

    return (
      <div>
        <CategoryFormProvider
          category={newCategory}
          closeForm={closeForm}
          isFormShown={true}
          isNew={true}
        >
          <CategoryForm />
        </CategoryFormProvider>
      </div>
    );
  }
};

const BudgetCategoryIndexComponent = (props: {
  categories: Array<BudgetCategory>;
  icons: Array<TIcon>;
}) => {
  const categories = props.categories.sort(sortByName);

  const [showFormKey, setShowFormKey] = useState<null | string>(null);

  return (
    <CategoriesProvider icons={props.icons} categories={categories}>
      <div className="w-full px-4">
        <div className="text-xl">Manage Categories</div>
        <div className="w-full flex flex-col gap-4">
          <AddNewComponent
            icons={props.icons}
            isFormShown={showFormKey === "__new__"}
            closeForm={() => setShowFormKey(null)}
            openForm={() => setShowFormKey("__new__")}
          />
          {categories.map((category) => {
            return (
              <Card
                key={category.key}
                category={category}
                icons={props.icons}
                isFormShown={showFormKey === category.key}
                setShowFormKey={setShowFormKey}
              />
            );
          })}
        </div>
      </div>
    </CategoriesProvider>
  );
};

export default BudgetCategoryIndexComponent;
