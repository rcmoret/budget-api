import { BudgetData, DiscretionaryData } from "@/types/budget";
// import { BudgetSummary } from "@/components/budget_summary";
// import { MonthYearSelect } from "@/components/common/MonthYearSelect";
// import { DateFormatter } from "@/lib/DateFormatter";
import { Items as ItemsComponent } from "@/pages/budget/items";

interface ComponentProps {
  data: BudgetData;
  discretionary: DiscretionaryData;
}
const BudgetComponent = (props: ComponentProps) => (
  <ItemsComponent data={props.discretionary} />
);

export default BudgetComponent;
