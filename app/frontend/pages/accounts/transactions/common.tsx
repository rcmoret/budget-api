import { AccountTransactionDetail } from "@/types/transaction";
import { ModeledTransaction } from "@/lib/models/transaction";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { byAmount } from "@/lib/sort_functions";
import { AmountSpan } from "@/components/common/AmountSpan";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { TransactionWithBalance } from "@/pages/accounts/transactions";
import { buildQueryParams } from "@/lib/redirect_params";
import { useAppConfigContext } from "@/components/layout/Provider";
import { Point } from "@/components/common/Symbol";

interface CaretComponentProps {
  details: AccountTransactionDetail[];
  isDetailShown: boolean;
  toggleFn: () => void;
}

const CaretComponent = (props: CaretComponentProps) => {
  const { details, isDetailShown, toggleFn } = props;

  return (
    <div className="hidden md:block w-[4%]">
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
    <div className="w-3/12">
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

const BudgetItemList = (props: { details: AccountTransactionDetail[], textClass: string }) => {
  return (
    props.details.sort(byAmount).map((detail) => (
      <div key={detail.key} className={`w-full ${props.textClass}`}>
        {detail.budgetCategoryName || "Petty Cash"}{" "}
        {detail.iconClassName && <Icon name={detail.iconClassName} />}
      </div>
    )
  ))
}

const LineItemAmounts = (props: { details: AccountTransactionDetail[] }) => {
  return (
    <div>
      {props.details.sort(byAmount).map((detail) => (
        <div key={detail.key} className="w-full text-sm pr-2 md:pr-0">
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
}) => {
  const { details, toggleForm, amount } = props

  return (
    <div className="w-full">
      <Button type="button" onClick={toggleForm}>
        <AmountSpan amount={amount} />
      </Button>
      {details.length > 1 && <LineItemAmounts details={details} />}
    </div>
  )
}

const DescriptionComponent = (props: {
  transaction: ModeledTransaction;
  toggleForm: () => void;
}) => {
  const { transaction } = props
  const { details, description } = transaction

  if (!description && details.length === 1) {
    return (
      <Button type="button" onClick={props.toggleForm} styling={{ textAlign: "text-left" }}>
        <BudgetItemList details={details} textClass="text-base" />
      </Button>
    )
  } else if (details.some((detail) => !!detail.budgetItemKey)) {
    return (
      <div>
          {description ? (
            <Button type="button" onClick={props.toggleForm}>
              <div className="w-full text-left">{description}</div>
            </Button>) :
            <span className="text-gray-600">Items:</span>}
        <BudgetItemList details={details} textClass="text-sm" />
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
  const { appConfig } = useAppConfigContext()
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
  CaretComponent,
  ClearanceDateComponent,
  DeleteIcon,
  DescriptionComponent,
};
