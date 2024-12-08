import { accountTransaction as model, ModeledTransaction } from "@/lib/models/transaction";
import { byClearanceDate } from "@/lib/sort_functions";
import { AccountTransaction } from "@/types/transaction";

import { InitialBalance } from "@/pages/accounts/transactions/initial_balance";
import { TransactionForm } from "@/pages/accounts/transactions/form";
import { TransactionShow } from "@/pages/accounts/transactions/show";
import { useContext, useState } from "react";
import { AddNewComponent } from "./transactions/AddNew";
import { AppConfigContext } from "@/components/layout/Provider";
import Select, { SingleValue } from "react-select";
import { AmountInput, inputAmount } from "@/components/common/AmountInput";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { SubmitButton } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";

const TransferComponent = () => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext)
  const { accounts, account, budget } = appConfig
  const { data, setData, transform, post, processing } = useForm({
    amount: inputAmount({ display: "" }),
    accountKey: ""
  })

  // @ts-ignore
  transform((data) => {
    return {
      transfer: {
        fromAccountKey: key,
        toAccountKey: data.accountKey,
        amount: data.amount.cents
      }
    }
  })

  if (!account.showTransferForm) { return }


  const { slug, key } = account
  const options = accounts.reduce((collection, account) => {
    if (key === account.key) {
      return collection
    } else {
      return [ ...collection, { label: account.name, value: account.key } ]
    }
  }, [] as Array<{ label: string, value: string}>)

  const formUrl = UrlBuilder({
    name: "AccountTransfer",
    queryParams: buildQueryParams([
      "account",
      slug,
      "transactions",
      budget.data.month,
      budget.data.year
    ])
  })

  const isSubmittable = !!data.amount.cents && !!data.accountKey

  const onSubmit = () => {
    const onSuccess = () => {
      setAppConfig({
        ...appConfig,
        account: {
          ...appConfig.account,
          showTransferForm: false
        }
      })
      setData({
        accountKey: "",
        amount: inputAmount({ display: "" })
      })
    }

    post(formUrl, { onSuccess })
  }

  const onAccountChange = (ev: SingleValue<{ label: string; value: string; }>) => {
    setData({ ...data, accountKey: String(ev?.value) })
  }

  const onAmountChange = (amount: string) => {
    setData({ ...data, amount: inputAmount({ display: amount }) })
  }

  const value = options.find((option) => option.value === data.accountKey) || { label: "", value: "" }

  return (
    <div className="w-full py-2 px-4 bg-sky-100 flex flex-row gap-8">
      <div className="self-center">Transfer to: </div>
      <div className="min-w-72">
        <Select
          options={options}
          onChange={onAccountChange}
          value={value}
        />
      </div>
      <div>
        <AmountInput
          name="transfer-amount"
          amount={data.amount}
          onChange={onAmountChange}
          classes={["h-input-lg"]}
        />
      </div>
      <div>
        <SubmitButton
          isEnabled={isSubmittable && !processing}
          styling={{
            color: "text-white",
            padding: "px-2 py-1",
            backgroundColor: "bg-green-600",
            hoverColor: "hover:bg-green-700",
            height: "h-input-lg",
            rounded: "rounded"
          }}
          disabledStyling={{
            color: "text-black",
            backgroundColor: "bg-gray-300"
          }}
          onSubmit={onSubmit}
        >
          <div className="flex flex-row gap-2">
            <div>
              CREATE TRANSFER
            </div>
            <div className={isSubmittable ? "text-chartreuse-300" : "text-gray-800"}>
              <Icon name="check-circle" />
            </div>
          </div>
        </SubmitButton>
      </div>
    </div>
  )
}

interface ComponentProps {
  initialBalance: number;
  transactions: AccountTransaction[];
  budget: {
    firstDate: string;
  };
}

interface TransactionWithBalance extends ModeledTransaction {
  balance: number;
}

const Transactions = (props: ComponentProps) => {
  const transactions = props.transactions.map(model).sort(byClearanceDate);
  const { budget } = props;
  let balance = props.initialBalance;

  const [showFormKey, setShowFormKey] = useState<string | null>(null)
  const closeForm = () => setShowFormKey(null)
  const showNewForm = () => setShowFormKey("__new__")

  const sortedTransactions = transactions.reduce((acc, txn) => {
    balance = balance + txn.amount
    return [
      {
        ...txn,
        balance
      },
      ...acc
    ]
  }, [] as TransactionWithBalance[])

  let index = 0

  return (
    <div className="bg-gray-50 w-full px-4 md:px-24 mx-auto flex flex-col pb-20  pt-8">
      <div className="w-full overflow-hidden shadow-lg">
        <TransferComponent />
        <AddNewComponent
          index={index}
          isFormShown={showFormKey === "__new__"}
          closeForm={closeForm}
          openForm={showNewForm}
        />
        {sortedTransactions.map((transaction) => {
          index += 1
          if (showFormKey === transaction.key) {
            return (
              <TransactionForm
                index={index}
                key={transaction.key}
                transaction={transaction}
                closeForm={closeForm}
              />
            )
          } else {
            return (
              <TransactionShow
                index={index}
                key={transaction.key}
                transaction={transaction}
                showFormFn={setShowFormKey}
              />
            )
          }
        })}
        <InitialBalance
          index={index + 1}
          balance={props.initialBalance}
          initialDate={budget.firstDate}
        />
      </div>
    </div>
  );
};

export { Transactions, TransactionWithBalance };
