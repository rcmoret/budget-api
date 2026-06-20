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
  previousMonth: {
    month: 0,
    year: 0,
    monthName: "",
    href: ""
  },
  nextMonth: {
    month: 0,
    year: 0,
    monthName: "",
    href: ""
  }
}

type BudgetMonthStore = {
  budgetMonth: BudgetMonthData;
  setBudgetMonth: (budgetMonth: BudgetMonthData) => void;
}

const useBudgetMonthStore = create<BudgetMonthStore>((set) => ({
  budgetMonth: emptyBudgetMonth,
  setBudgetMonth: (budgetMonth) => set({ budgetMonth }),
}))

const initBudgetMonthStore = (props: { budgetMonth: BudgetMonthData }) => {
  const { budgetMonth } = props
  const setBudgetMonth = useBudgetMonthStore((s) => s.setBudgetMonth)

  useEffect(() => {
    setBudgetMonth(budgetMonth)
  }, [budgetMonth, setBudgetMonth])
}

const getBudgetMonth = () => useBudgetMonthStore((s) => s.budgetMonth)

export { useBudgetMonthStore, initBudgetMonthStore, getBudgetMonth }
