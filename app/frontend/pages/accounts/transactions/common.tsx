import { AccountTransactionDetail } from "@/types/transaction";
import { ModeledTransaction } from "@/lib/models/transaction";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { byAmount, byCategoryName } from "@/lib/sort_functions";
import { AmountSpan } from "@/components/common/AmountSpan";

interface CaretComponentProps {
  details: AccountTransactionDetail[];
  isDetailShown: boolean;
  toggleFn: () => void;
}

const CaretComponent = (props: CaretComponentProps) => {
  const { details, isDetailShown, toggleFn } = props;

  return (
    <div className="w-[5%]">
      {details.length > 1 ? (
        <DetailToggle isDetailShown={isDetailShown} toggleFn={toggleFn} />
      ) : (
        ""
      )}
    </div>
  );
};

const DetailToggle = (props: {
  isDetailShown: boolean;
  toggleFn: () => void;
}) => {
  const { isDetailShown, toggleFn } = props;
  const iconName = isDetailShown ? "caret-down" : "caret-right";

  return (
    <Button type="button" onClick={toggleFn} styling={{ color: "text-blue-300" }}>
      <Icon name={iconName} />
    </Button>
  );
};

const ClearanceDateComponent = (props: {
  clearanceDate: string;
  shortClearanceDate: string;
  toggleForm: () => void;
}) => {
  return (
    <div className="w-2/12">
      <Button
        type="button"
        onClick={props.toggleForm}
        styling={{ width: "w-full", textAlign: "text-left" }}
      >
        <span className="max-sm:hidden">{props.clearanceDate}</span>
        <span className="sm:hidden">{props.shortClearanceDate}</span>
      </Button>
    </div>
  )
}

const BudgetItemsDescription = (props: {
  details: AccountTransactionDetail[];
}) => {
  const details = props.details
    .filter((detail: AccountTransactionDetail) => detail.budgetCategoryName)
    .sort(byCategoryName);

  return (
    <>
      {details.map((detail: AccountTransactionDetail, n: number) => (
        <span key={detail.key}>
          {n > 0 && "; "}
          {detail.budgetCategoryName}{" "}
          {detail.iconClassName && <Icon name={detail.iconClassName} />}
        </span>
      ))}
    </>
  );
};

const BudgetItemList = (props: { details: AccountTransactionDetail[] }) => {
  return (
    props.details.sort(byAmount).map((detail) => (
      <div key={detail.key} className="w-full text-sm">
        {detail.budgetCategoryName || "Petty Cash"}{" "}
        {detail.iconClassName && <Icon name={detail.iconClassName} />}
      </div>
    )
  ))
}

const BudgetItemAmounts = (props: {
  details: AccountTransactionDetail[];
  amount: number;
  toggleForm: () => void;
}) => (
  <div className="w-full">
    <Button type="button" onClick={props.toggleForm}>
      <AmountSpan amount={props.amount} />
    </Button>
    {props.details.sort(byAmount).map((detail) => (
      <div key={detail.key} className="w-full text-sm">
        <AmountSpan amount={detail.amount} />
      </div>
    ))}
  </div>
);

const DescriptionComponent = (props: {
  transaction: ModeledTransaction;
  isDetailShown: boolean;
  toggleForm: () => void;
}) => {
  const { transaction, isDetailShown } = props
  const { details, description } = transaction

  if (details.length > 1 && isDetailShown) {
    return (
      <div className="w-full">
        <Button type="button" onClick={props.toggleForm}>
          {description ?
            <div className="w-full text-left">{description}</div> :
            <BudgetItemsDescription details={details} />}
        </Button>
        <BudgetItemList details={details} />
      </div>
    )
  } else if (description === null) {
    return (
      <Button type="button" onClick={props.toggleForm}>
        <BudgetItemsDescription details={details} />
      </Button>
    )
  } else {
    return (
      <Button type="button" onClick={props.toggleForm}>
        {description}
      </Button>
    )
  }
}

export { BudgetItemAmounts, BudgetItemsDescription, CaretComponent, ClearanceDateComponent, DescriptionComponent };
