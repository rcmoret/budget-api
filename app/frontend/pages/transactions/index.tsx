import { PageComponent } from "@frontend/layout";
import { TransactionDetailBudgetItem } from "@/types/transaction";
import { AccountProps, FeaturedAccountType } from "@/types/account";
import { BudgetMonthData } from "@/types/budget/month-data";
import { initBudgetMonthStore } from "../budget/month-store";
import { TransactionIndexHeader as Header } from "./layout/header";
import { getTransactions, initTransactionIndexStore } from "./store";
import { RightColumn } from "./right-column";
import { AccountTransactionCard, InitialBlance } from "./layout/card";
import { PageProps } from "@/types/page_props";

type TransactionsIndexProps = PageProps & {
  accounts: Array<AccountProps>;
  budgetItems: Array<TransactionDetailBudgetItem>;
  budgetMonth: BudgetMonthData;
  featuredAccount: FeaturedAccountType;
};

const TransactionsIndexComponent = () => {
  const transactions = getTransactions();

  return (
    <PageComponent
      mainId="account-transaction-container"
      rightColumn={<RightColumn />}
      header={<Header />}
    >
      <>
        {transactions.map((transaction) => (
          <AccountTransactionCard
            key={transaction.key}
            transaction={transaction}
          />
        ))}
        <InitialBlance />
      </>
    </PageComponent>
  );
};

const IndexComponent = (props: TransactionsIndexProps) => {
  const { budgetItems, accounts, budgetMonth } = props;
  const { transactions, ...featuredAccount } = props.featuredAccount;

  initTransactionIndexStore({
    accounts,
    budgetItems,
    featuredAccount,
    transactions: [...transactions].reverse(),
  });
  initBudgetMonthStore({ budgetMonth });

  return <TransactionsIndexComponent />;
};

export default IndexComponent;
