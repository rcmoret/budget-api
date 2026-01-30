import { useTransactionContext } from "@/pages/accounts/transactions/context-provider";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { byAmount } from "@/lib/sort_functions";

const DescriptionLine = () => {
  const {
    flags: { singleItem, noDescription, noItems },
    transaction: { description },
  } = useTransactionContext();

  const defaultLabel = noItems ? "Entry" : "Items";
  const label = description ?? defaultLabel;

  if (noDescription && singleItem) {
    return;
  }
  return <div className="w-full text-left">{label}</div>;
};

const BudgetItemList = () => {
  const {
    flags: { noDescription, singleItem },
    transaction: { details },
  } = useTransactionContext();

  const textClass = noDescription && singleItem ? "text-base" : "text-sm";

  return details.sort(byAmount).map((detail) => (
    <div key={detail.key} className={`w-full ${textClass}`}>
      {detail.budgetCategoryName || "Petty Cash"}{" "}
      {detail.iconClassName && <Icon name={detail.iconClassName} />}
    </div>
  ));
};

const LineItemAmounts = () => {
  const {
    transaction: { details },
  } = useTransactionContext();
  return (
    <div>
      {details.sort(byAmount).map((detail) => (
        <div key={detail.key} className="w-full text-sm pr-2 md:pr-0">
          <AmountSpan amount={detail.amount} />
        </div>
      ))}
    </div>
  );
};

const DescriptionComponent = () => {
  const {
    flags: { noDescription },
    showForm,
    transaction: { details },
  } = useTransactionContext();

  return (
    <Button type="button" onClick={showForm}>
      <div className="w-full flex flex-col">
        <DescriptionLine />
        <BudgetItemList />
        {!noDescription && details.length > 1 && <LineItemAmounts />}
      </div>
    </Button>
  );
};

export { DescriptionComponent };
