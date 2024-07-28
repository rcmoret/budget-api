import { BudgetData, DiscretionaryData } from "@/types/budget";
import { BudgetSummary } from "@/components/budget_summary";
import { MonthYearSelect } from "@/components/common";
import { DateFormatter } from "@/lib/DateFormatter";
import { Items as ItemsComponent } from "@/pages/budget/items";

interface ComponentProps {
  data: BudgetData;
  discretionary: DiscretionaryData;
}
const BudgetComponent = (props: ComponentProps) => (
  <>
    <BudgetSummary
      baseUrl="/budget"
      budget={props.data}
      titleComponent={
        <BudgetSummaryTitleComponent
          month={props.data.month}
          year={props.data.year}
        />
      }
    >
      <MonthYearSelect
        month={props.data.month}
        year={props.data.year}
        baseUrl="/budget"
      />
    </BudgetSummary>
    <ItemsComponent data={props.discretionary} />
  </>
);

const BudgetSummaryTitleComponent = (props: {
  month: number;
  year: number;
}) => (
  <div className="w-full flex justify-between text-2xl underline">
    Budget -{" "}
    {DateFormatter({
      ...props,
      format: "monthYear",
    })}
  </div>
);

export default BudgetComponent;
