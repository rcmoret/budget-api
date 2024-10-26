import { BudgetItem, BudgetItemDetail } from "@/types/budget";

const accrualFilter = (props: { item: BudgetItem, showAccruals: boolean, month: number, year: number }) => {
  const { isAccrual, maturityMonth, maturityYear } = props.item
  const { showAccruals, month, year } = props

  if (!isAccrual || showAccruals) {
    return true
  }

  return maturityMonth === month && maturityYear === year
}
const clearedItems = (item: BudgetItem) => item.isMonthly && !!item.transactionDetails.length
const dayToDayItems = (item: BudgetItem) => !item.isMonthly
const pendingItems = (item: BudgetItem) => item.isMonthly && !item.transactionDetails.length
const revenueItems = (item: BudgetItem) => !item.isExpense
const expenseItems = (item: BudgetItem) => item.isExpense

const sortByAbsAmount = (item1: BudgetItem, item2: BudgetItem) => {
  if (item1.amount === item2.amount) {
    return item1.key < item2.key ? -1 : 1
  }

  return Math.abs(item1.amount) - Math.abs(item2.amount)
}

const sortByName = (item1: BudgetItem, item2: BudgetItem) => {
  if (item1.name === item2.name) {
    return sortByAbsAmount(item1, item2)
  } else {
    return item1.name < item2.name ? -1 : 1
  }
}

const sortDetails = (detail1: BudgetItemDetail, detail2: BudgetItemDetail) => {
  return detail1.comparisonDate < detail2.comparisonDate ? -1 : 1
}

export {
  accrualFilter,
  clearedItems,
  dayToDayItems,
  expenseItems,
  pendingItems,
  revenueItems,
  sortByName,
  sortDetails
}
