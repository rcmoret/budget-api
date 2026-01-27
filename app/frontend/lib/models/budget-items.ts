import { SetUpCategory } from "@/lib/hooks/useSetUpEventsForm";
import { BudgetItem } from "@/types/budget";

const accrualFilter = (props: {
  item: BudgetItem;
  showAccruals: boolean;
  month: number;
  year: number;
}) => {
  const { isAccrual, maturityMonth, maturityYear } = props.item;
  const { showAccruals, month, year } = props;

  if (!isAccrual || showAccruals) {
    return true;
  }

  return maturityMonth === month && maturityYear === year;
};
const clearedItems = (item: BudgetItem) =>
  item.isMonthly && !!item.transactionDetails.length;
const dayToDayItems = (item: BudgetItem | SetUpCategory) => !item.isMonthly;
const expenseItems = (item: BudgetItem | SetUpCategory) => item.isExpense;
const monthlyItems = (item: BudgetItem | SetUpCategory) => item.isMonthly;
const pendingItems = (item: BudgetItem) =>
  item.isMonthly && !item.transactionDetails.length;
const revenueItems = (item: BudgetItem | SetUpCategory) => !item.isExpense;

export {
  accrualFilter,
  clearedItems,
  dayToDayItems,
  expenseItems,
  monthlyItems,
  pendingItems,
  revenueItems,
};
