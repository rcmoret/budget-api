import { accountTransaction as model } from "@/lib/models/transaction";
import { byClearanceDate } from "@/lib/sort_functions";
import { AccountTransaction } from "@/types/transaction";

import { InitialBalance } from "@/pages/accounts/transactions/initial_balance";
import { TransactionForm } from "@/pages/accounts/transactions/form";
import { TransactionShow } from "@/pages/accounts/transactions/show";
import { useState } from "react";
import { AddNewComponent } from "./transactions/AddNew";

interface ComponentProps {
  initialBalance: number;
  transactions: AccountTransaction[];
  budget: {
    firstDate: string;
  };
}

const Transactions = (props: ComponentProps) => {
  const transactions = props.transactions.map(model).sort(byClearanceDate);
  const { budget } = props;
  let balance = props.initialBalance;

  const [showFormKey, setShowFormKey] = useState<string | null>(null)
  const closeForm = () => setShowFormKey(null)
  const showNewForm = () => setShowFormKey("__new__")

  const sorted = transactions.reduce((acc, txn) => {
    balance = balance + txn.amount
    return [
      {
        ...txn,
        balance
      },
      ...acc
    ]
  }, [])

  return (
    <div className="w-full flex flex-col">
      <AddNewComponent
        isFormShown={showFormKey === "__new__"}
        closeForm={closeForm}
        openForm={showNewForm}
      />
      {sorted.map((transaction) => {
        if (showFormKey === transaction.key) {
          return (
            <TransactionForm
              transaction={transaction}
              closeForm={closeForm}
            />
          )
        } else {
          return (
            <TransactionShow
              transaction={transaction}
              balance={transaction.balance}
              showFormFn={setShowFormKey}
            />
          )
        }
      })}
      <InitialBalance balance={props.initialBalance} initialDate={budget.firstDate} />
    </div>
  );
};

export { Transactions };
