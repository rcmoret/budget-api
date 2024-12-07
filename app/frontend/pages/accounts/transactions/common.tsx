import { AccountTransactionDetail } from "@/types/transaction";
import { ModeledTransaction } from "@/lib/models/transaction";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { byAmount, byCategoryName } from "@/lib/sort_functions";
import { AmountSpan } from "@/components/common/AmountSpan";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { TransactionWithBalance } from "@/pages/accounts/transactions";
import { buildQueryParams } from "@/lib/redirect_params";
import { useContext } from "react";
import { AppConfigContext } from "@/components/layout/Provider";
import { Point } from "@/components/common/Symbol";

interface CaretComponentProps {
  details: AccountTransactionDetail[];
  isDetailShown: boolean;
  toggleFn: () => void;
}

const CaretComponent = (props: CaretComponentProps) => {
  const { details, isDetailShown, toggleFn } = props;

  return (
    <div className="md:w-[5%] hidden">
      {details.length > 1 ? (
        <DetailToggle isDetailShown={isDetailShown} toggleFn={toggleFn} />
      ) : (
        <span className="text-gray-600">
          <Point>{" "}</Point>
        </span>
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

const LineItemAmounts = (props: { details: AccountTransactionDetail[], display: sting }) => {
  return (
    <div className={props.display}>
      {props.details.sort(byAmount).map((detail) => (
        <div key={detail.key} className="w-full text-sm">
          <AmountSpan amount={detail.amount} />
        </div>
      ))}
    </div>
  )
}

const BudgetItemAmounts = (props: {
  details: AccountTransactionDetail[];
  amount: number;
  toggleForm: () => void;
  isDetailShown: boolean;
}) => {
  const { details, toggleForm, amount, isDetailShown } = props

  const display = isDetailShown ? "block" : "block md:hidden"

  return (
    <div className="w-full">
      <Button type="button" onClick={toggleForm}>
        <AmountSpan amount={amount} />
      </Button>
      {details.length > 1 && <LineItemAmounts details={details} display={display} />}
    </div>
  )
}

const DescriptionComponent = (props: {
  transaction: ModeledTransaction;
  isDetailShown: boolean;
  toggleForm: () => void;
}) => {
  const { transaction, isDetailShown } = props
  const { details, description } = transaction

  if (description === null) {
    return (
      <Button type="button" onClick={props.toggleForm}>
        <BudgetItemsDescription details={details} />
      </Button>
    )
  } else if (details.length > 1) {
    const display = isDetailShown ? "block" : "block md:hidden"
    return (
      <div className={`w-full ${display}`}>
        <Button type="button" onClick={props.toggleForm}>
          {description ?
            <div className="w-full text-left">{description}</div> :
            <BudgetItemsDescription details={details} />}
        </Button>
        <BudgetItemList details={details} />
      </div>
    )
  } else {
    return (
      <Button type="button" onClick={props.toggleForm} styling={{ textAlign: "text-left" }}>
        {description}
      </Button>
    )
  }
}

const DeleteIcon = (props: {
  transaction: TransactionWithBalance;
}) => {
  const { transaction } = props
  const { key, accountSlug } = transaction
  const { delete: destroy } = useForm({})
  const { appConfig } = useContext(AppConfigContext)
  const { month, year } = appConfig.budget.data

  const onClick = () => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return
    }
    const formUrl = UrlBuilder({
      name: "TransactionShow",
      key: key,
      accountSlug: accountSlug,
      queryParams: buildQueryParams(["account", accountSlug, "transactions", month, year])
    })
    destroy(formUrl)
  }

  return (
    <div className="mr-2">
      <Button
        type="button"
        onClick={onClick}
        styling={{ color: "text-blue-300" }}
      >
        <Icon name="trash" />
      </Button>
    </div>
  )
}

export {
  BudgetItemAmounts,
  BudgetItemsDescription,
  CaretComponent,
  ClearanceDateComponent,
  DeleteIcon,
  DescriptionComponent,
};
