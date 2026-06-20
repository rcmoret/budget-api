import { PageComponent } from "@frontend/layout";
import { AccountTransaction, TransactionDetailBudgetItem } from "@/types/transaction"
import { TransactionProvider } from "./context-provider"
import { ClearanceDate } from "./layout/clearance-date"
import { TransactionDetails } from "./layout/transaction-details"
import { TransactionAmounts } from "./layout/transaction-amount"
import { RunningBalance } from "./layout/running-balance"
import { ReceiptComponent } from "./layout/receipt-component"
import { SupplementalInfo } from "./layout/supplemental-info"
import { AccountProps, FeaturedAccountType } from "@/types/account"
import { BudgetMonthData } from "@/types/budget/month-data"
import { initBudgetMonthStore } from "../budget/month-store";
import { TransactionIndexHeader as Header } from "./layout/header";
import { getTransactions, initTransactionIndexStore } from "./store";
import { RightColumn } from "./right-column";

const AccountTransactionCard = (props: { transaction: AccountTransaction }) => {
  const cardClassName = [
    "grid",
    "grid-cols-subgrid",
    "grid-col-gap-2",
    "col-span-full",
    "rounded",
    "shadow-md",
    "px-4",
    "pt-2",
    "pb-4",
    "last:mb-12",
    "self-start",
    "odd:bg-base-300/30",
    "even:bg-base-300/12"
  ].join(" ")

  return (
    <TransactionProvider transaction={props.transaction}>
      <div className={cardClassName}>
        <ClearanceDate />
        <TransactionDetails />
        <TransactionAmounts />
        <RunningBalance />
        <ReceiptComponent />
        <SupplementalInfo />
      </div>
    </TransactionProvider>
  )
}

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
      </>
    </PageComponent>
  )
}

const IndexComponent = (props: TransactionsIndexProps) => {
  const { budgetMonth, metadata, budgetItems, accounts } = props;
  const { transactions, ...featuredAccount } = props.featuredAccount;
  const { balancePriorTo } = featuredAccount

  const balanceInfo: AccountTransaction = {
    key: "initial",
    accountKey: "",
    accountSlug: "",
    amount: balancePriorTo,
    checkNumber: null,
    clearanceDate: budgetMonth.firstDate,
    description: "Initial Balance",
    details: [],
    isBudgetExclusion: false,
    notes: null,
    receiptContentType: null,
    receiptUrl: null,
    receiptFilename: null,
    runningBalance: balancePriorTo,
    updatedAt: ""
  }

  initBudgetMonthStore({ budgetMonth })
  initTransactionIndexStore({
    accounts,
    budgetItems,
    featuredAccount,
    transactions: [balanceInfo, ...transactions].reverse()
  })

  return <TransactionsIndexComponent metadata={metadata} />
}

export default IndexComponent;
