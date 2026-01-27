import { useState } from "react";
import { byName as sortByName } from "@/lib/sort_functions";
import { BudgetCategory } from "@/types/budget";
import { CardWrapper as Card, TIcon } from "@/pages/budget/categories/Card";
import {
  CategoryForm,
  NewBudgetCategory,
} from "@/pages/budget/categories/Form";
import { Button } from "@/components/common/Button";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { Icon } from "@/components/common/Icon";

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
        <Button
          type="button"
          onClick={openForm}
          styling={{
            backgroundColor: "bg-blue-300",
            color: "text-white",
            rounded: "rounded",
            padding: "px-2 py-1",
            fontWeight: "font-bold",
          }}
        >
          ADD NEW{" "}
          <span className="text-sky-200">
            <Icon name="plus-circle" />
          </span>
        </Button>
      </div>
    );
  } else {
    const category: NewBudgetCategory = {
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
        <CategoryForm
          category={category}
          icons={props.icons}
          isNew={true}
          closeForm={closeForm}
        />
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
  );
};

export default BudgetCategoryIndexComponent;
