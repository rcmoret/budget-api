import { useTransactionContext } from "@/pages/accounts/transactions/context-provider";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { byAmount } from "@/lib/sort_functions";

const DescriptionLine = () => {
  const {
    flags: { singleItem, noDescription, noItems },
    transaction: { description, details },
  } = useTransactionContext();

  const defaultLabel = noItems ? "Entry" : "Items";
  const label = description ?? defaultLabel;

  if (noDescription && singleItem) {
    return (
      <div className="text-left">
        {details[0]?.budgetCategoryName ?? defaultLabel}
      </div>
    );
  }
  return <div className="text-left">{label}</div>;
};

const BudgetItemList = () => {
  const {
    transaction: { details },
  } = useTransactionContext();

  return details.sort(byAmount).map((detail) => (
    <div key={detail.key} className="w-full text-sm text-left">
      {detail.budgetCategoryName || "Petty Cash"}{" "}
      {detail.iconClassName && <Icon name={detail.iconClassName} />}
    </div>
  ));
};

const DescriptionComponent = () => {
  const {
    flags: { noDescription },
    showForm,
    transaction: { details },
  } = useTransactionContext();

  return (
    <Button type="button" onClick={showForm}>
      <div className="full flex flex-col">
        <DescriptionLine />
        {(!noDescription || details.length > 1) && <BudgetItemList />}
      </div>
    </Button>
  );
};

export { DescriptionComponent };
