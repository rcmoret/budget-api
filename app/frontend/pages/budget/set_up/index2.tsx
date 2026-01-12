import { TCategoryGroup, SetupEvent, SetupProvider } from "@/lib/hooks/useSetUpEventsForm";
import { LeftColumn } from  "@/pages/budget/set_up/left_column";
import { RightColumn } from  "@/pages/budget/set_up/right_column";
import { KeyboardNav } from "./keyboard_nav";
import { BudgetCategory } from "@/types/budget";

export type ComponentProps = {
  groups: {
    revenues: TCategoryGroup;
    monthlyExpenses: TCategoryGroup;
    dayToDayExpenses: TCategoryGroup;
  };
  budgetCategory: BudgetCategory & { events: Array<SetupEvent> },
  metadata: {
    budgetTotal: number;
    isSubmittable: boolean;
    nextCategorySlug: string;
    previousCategorySlug: string;
    month: number;
    year: number;
  };
}

const NewSetUpComponent = (props: ComponentProps) => {
  return (
    <SetupProvider { ...props }>
      <KeyboardNav />
      <div className="w-full flex flex-row flex-wrap">
        <div className="w-full flex md:flex-row flex-col gap-6 mb-6 p-2">
          <LeftColumn />
          <RightColumn />
        </div>
      </div>
    </SetupProvider>
  )
}

export default NewSetUpComponent;
