import { accountTransaction as model } from "@/lib/models/transaction";
import { byClearanceDate } from "@/lib/sort_functions";
import { AccountTransaction } from "@/types/transaction";

import { InitialBalance } from "@/pages/accounts/transactions/initial_balance";
import { TransactionForm } from "@/pages/accounts/transactions/form";
import { TransactionShow } from "@/pages/accounts/transactions/show";
import { useState } from "react";

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

  return (
    <div className="w-full flex flex-col-reverse">
      <InitialBalance balance={balance} initialDate={budget.firstDate} />
      {transactions.map((transaction) => {
        balance += transaction.amount;
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
              balance={balance}
              showFormFn={setShowFormKey}
            />
          )
        }
      })}
    </div>
  );
};

export { Transactions };
