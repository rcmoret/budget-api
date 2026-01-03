import { BudgetFinalizePageData } from "@/components/layout/Header";
import { FinalizeCategory } from "@/lib/hooks/useFinalizeEventsForm";
import { CategoryIndex as RightColumn } from "./categories";
import { Summary } from "./summary";
import { FinalizeFormProvider, useFinalizeFormContext } from "./form_context";
import { LeftColumn } from "./left_column";
import { useEffect } from "react";
import { useAppConfigContext } from "@/components/layout/Provider";
import { KeyboardNav } from "./keyboard_nav";

type IndexComponentProps = {
  categories: Array<FinalizeCategory>
  target: BudgetFinalizePageData;
  data: BudgetFinalizePageData;
  metadata: {
    namespace: "budget";
    page: {
      name: string;
    }
  };
}

const SubmitSection = (props: { children: React.ReactNode }) => {
  const { allItemsReviewed } = useFinalizeFormContext()

  if (allItemsReviewed) {
    return (
      <div className="my-2 pb-2 border-b border-gray-400">
        <span id="finalize-summary"></span>
        <div className="flex flex-col gap-2">
          {props.children}
        </div>
      </div>
    )
  } else {
    return null
  }
}

const BudgetFinalizeIndex = (props: IndexComponentProps) => {
  return (
    <div className="w-full flex flex-row flex-wrap">
      <FinalizeFormProvider {...props}>
        <KeyboardNav />
        <div className="w-full flex md:flex-row flex-col gap-6 mb-6 p-2">
          <LeftColumn >
            <Summary />
          </LeftColumn >
          <div>
            <RightColumn />
          </div>
        </div>
      </FinalizeFormProvider>
    </div>
  )
}

export default BudgetFinalizeIndex;
