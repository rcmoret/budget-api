import { accountTransaction as model } from "@/lib/models/transaction";
import { byClearanceDate } from "@/lib/sort_functions";
import { AccountTransaction } from "@/types/transaction";

import { InitialBalance } from "@/pages/accounts/transactions/initial_balance";
import { TransactionShow } from "@/pages/accounts/transactions/show";

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

  return (
    <div className="w-full flex flex-col-reverse">
      <InitialBalance balance={balance} initialDate={budget.firstDate} />
      {transactions.map((transaction) => {
        balance += transaction.amount;
        return (
          <TransactionShow
            key={transaction.key}
            transaction={transaction}
            balance={balance}
          />
        );
      })}
    </div>
  );
};

export { Transactions };
