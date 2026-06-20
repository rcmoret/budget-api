import { AccountTransaction } from "@/types/transaction"
import { useContext, createContext } from "react"

type TransactionContextValue = {
  transaction: AccountTransaction
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

const TransactionProvider = (props: { transaction: AccountTransaction; children: React.ReactNode }) => {
  const { transaction, children } = props
  const value: TransactionContextValue = { transaction }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

const useTransactionContext = (): TransactionContextValue => {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context
}

export { TransactionProvider, useTransactionContext }
