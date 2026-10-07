import { CategoryBudgetItem } from "@/types/budget";
import { GroupLabel } from "@/components/group-label";
import { BudgetItemCard } from "@/pages/budget/dashboard/items/card";
import { itemGroupLabels } from "@/pages/budget/dashboard/store";
import { ItemTransactionDetails } from "./transaction-details";
import { PerDiemDetails } from "./per-diem-details";

// A category's items all share a type and frequency, so a single group
// label covers them. There's no show/hide here, every item is rendered.
const CategoryItemsGroup = (props: { items: Array<CategoryBudgetItem> }) => {
  const { items } = props;

  if (!items.length) return null;

  const [fixedOrVariable, expenseOrRevenue] = itemGroupLabels(items[0]);

  return (
    <div className="flex flex-col gap-2 pb-4 py-1">
      <GroupLabel>
        <div>{fixedOrVariable}</div>
        <div>{expenseOrRevenue}</div>
      </GroupLabel>
      {items.map((item) => (
        <BudgetItemCard key={item.objectKey} item={item}>
          <PerDiemDetails item={item} />
          <ItemTransactionDetails details={item.transactionDetails} />
        </BudgetItemCard>
      ))}
    </div>
  );
};

export { CategoryItemsGroup };
