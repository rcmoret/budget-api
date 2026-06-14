import { pageHeaderClassName, pageHeadingClassName } from "@/layout";
import { useBudgetDashboardStore } from "../store";

const Header = () => {
  const budgetMonth = useBudgetDashboardStore((s) => s.budgetMonth)

  return (
    <div className={pageHeaderClassName}>
      <h1 className={pageHeadingClassName}>
        Budget: {budgetMonth.monthName} {budgetMonth.year}
      </h1>
    </div>
  );
};

export { Header }
