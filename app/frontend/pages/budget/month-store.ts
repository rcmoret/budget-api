import { BudgetMonthData } from "@/types/budget/month-data";
import { useEffect } from "react";
import { create } from "zustand";

const emptyBudgetMonth: BudgetMonthData = {
  month: 0,
  monthName: "",
  year: 0,
  totalDays: 0,
  daysRemaining: 0,
  isCurrent: false,
  firstDate: "",
  lastDate: "",
  isSetUp: true,
  previousMonth: {
    month: 0,
    year: 0,
    monthName: "",
    href: "",
  },
  nextMonth: {
    month: 0,
    year: 0,
    monthName: "",
    href: "",
  },
};

type BudgetMonthStore = {
  budgetMonth: BudgetMonthData;
};

const useBudgetMonthStore = create<BudgetMonthStore>(() => ({
  budgetMonth: emptyBudgetMonth,
}));

const initBudgetMonthStore = (props: { budgetMonth: BudgetMonthData }) => {
  const { budgetMonth } = props;

  useEffect(() => {
    useBudgetMonthStore.setState({ budgetMonth });
  }, [budgetMonth]);
};

const getBudgetMonth = () =>
  useBudgetMonthStore((s) => {
    return s.budgetMonth;
  });

export { useBudgetMonthStore, initBudgetMonthStore, getBudgetMonth };
