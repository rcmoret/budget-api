import { PageComponent } from "@frontend/layout";
import { TransactionDetailBudgetItem } from "@/types/transaction"
import { AccountProps, FeaturedAccountType } from "@/types/account"
import { BudgetMonthData } from "@/types/budget/month-data"
import { initBudgetMonthStore } from "../budget/month-store";
import { TransactionIndexHeader as Header } from "./layout/header";
import { getTransactions, initTransactionIndexStore } from "./store";
import { RightColumn } from "./right-column";
import { AccountTransactionCard, InitialBlance } from "./layout/card"

type TransactionsIndexProps = {
  accounts: Array<AccountProps>
  budgetItems: Array<TransactionDetailBudgetItem>
  budgetMonth: BudgetMonthData;
  featuredAccount: FeaturedAccountType;
  metadata: { pageName: string; namespace: string; };
}

const TransactionsIndexComponent = (props: { metadata: { pageName: string; namespace: string } }) => {
  const { metadata } = props;
  const transactions = getTransactions()

  return (
    <PageComponent
      mainId="account-transaction-container"
      header={<Header />}
      metadata={metadata}
      rightColumn={<RightColumn />}
    >
      <>
        {transactions.map((transaction) => (
          <AccountTransactionCard key={transaction.key} transaction={transaction} />
        ))}
        <InitialBlance />
      </>
    </PageComponent>
  )
}

const IndexComponent = (props: TransactionsIndexProps) => {
  const { metadata, budgetItems, accounts, budgetMonth } = props;
  const { transactions, ...featuredAccount } = props.featuredAccount;

  initTransactionIndexStore({
    accounts,
    budgetItems,
    featuredAccount,
    transactions: [...transactions].reverse()
  })
  initBudgetMonthStore({ budgetMonth })

  return <TransactionsIndexComponent metadata={metadata} />
}

export default IndexComponent;
