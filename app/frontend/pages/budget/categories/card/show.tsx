import { ArchivedAtRow, ArchiveIcon, CardRow } from "@/layout/card";
import { redirectQueryParams } from "@/utils/redirect_params";
import { router } from "@inertiajs/react";
import { KeyIdentifier } from "@/components/key-identifier";
import { useBudgetCategoryContext } from "@/pages/budget/categories/context-provider";
import { Pill } from "@/components/pill";

const budgetCategoryManageReturnQueryParams = redirectQueryParams([
  "budget",
  "categories",
]);

const BudgetCategoryCardBottomRow = () => {
  const { category } = useBudgetCategoryContext();
  const { isArchived } = category;
  const handleArchive = () => {
    router.put(
      `/budget/category/${category.key}?${budgetCategoryManageReturnQueryParams}`,
      {
        category: { is_archived: true },
      },
    );
  };

  if (isArchived) {
    return <ArchivedAtRow archivedAt={category.archivedAt} />;
  } else {
    return (
      <>
        <KeyIdentifier
          identifier={category.key}
          className="text-base-content/66"
        />
        <ArchiveIcon title="archive budget category" onClick={handleArchive} />
      </>
    );
  }
};

const BudgetCategoryShow = () => {
  const { category } = useBudgetCategoryContext();

  return (
    <>
      <CardRow>
        <div>Fixed/Variable</div>
        <div className="font-semibold">
          {category.isMonthly ? "Fixed" : "Variable"}
        </div>
      </CardRow>
      <CardRow>
        <div>Expense/Revenue</div>
        <div className="font-semibold">
          {category.isExpense ? "Expense" : "Revenue"}
        </div>
      </CardRow>
      <CardRow>
        <div>Slug</div>
        <div>{category.slug}</div>
      </CardRow>
      {category.isAccrual && (
        <CardRow>
          <Pill>Accrual</Pill>
        </CardRow>
      )}
      <CardRow>
        <BudgetCategoryCardBottomRow />
      </CardRow>
    </>
  );
};

export { BudgetCategoryShow };
