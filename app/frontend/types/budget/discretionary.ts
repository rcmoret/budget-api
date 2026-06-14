import { MonetaryAmount } from "@/types/amount";

type DiscretionaryDetails = {
  initialAmount: MonetaryAmount
  overUnderBudget: MonetaryAmount
  remaining: MonetaryAmount
  transactionsTotal: MonetaryAmount
}

export { DiscretionaryDetails }
