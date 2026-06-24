import { AccountTransaction } from "@/types/transaction"
import { TransactionProvider } from "../context-provider"
import { ClearanceDate } from "./clearance-date"
import { TransactionDetails } from "./transaction-details"
import { TransactionAmounts } from "./transaction-amount"
import { RunningBalance } from "./running-balance"
import { ReceiptComponent } from "./receipt-component"
import { SupplementalInfo } from "./supplemental-info"
import { getFeaturedAccount } from "../store"
import { getBudgetMonth } from "@/pages/budget/month-store"

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
  "odd:bg-base-300",
  "even:bg-base-300/50"
].join(" ")

const AccountTransactionCard = (props: { transaction: AccountTransaction }) => {
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

const InitialBlance = () => {
  const featuredAccount = getFeaturedAccount()
  const budgetMonth = getBudgetMonth()
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

  return (
    <TransactionProvider transaction={balanceInfo}>
      <div className={cardClassName}>
        <ClearanceDate />
        <TransactionDetails />
        <TransactionAmounts />
        <RunningBalance />
      </div>
    </TransactionProvider>
  )
}

export { AccountTransactionCard, InitialBlance }
