import { createContext, useContext, ReactNode } from "react";
import { TExtraCreateEvent, TExtraCategoryCreateEvent } from "./extra_events_select";
import { useFinalizeEventsForm, FinalizeCategory } from "@/lib/hooks/useFinalizeEventsForm";
import { BudgetFinalizePageData } from "@/components/layout/Header";
import { UpdateCategoryProps, FinalizeFormCategory } from "@/lib/hooks/useFinalizeEventsForm"

type HookProps = {
  categories: Array<FinalizeCategory>
  target: BudgetFinalizePageData;
  data: BudgetFinalizePageData;
}

type TFinalizeFormContext = {
  allItemsReviewed: boolean;
  base: BudgetFinalizePageData;
  categories: FinalizeFormCategory[];
  extraAmount: number;
  extraCategoryOptions: TExtraCategoryCreateEvent[];
  extraEvent: TExtraCreateEvent | null;
  isSubmittable: boolean;
  setCategory: (props: UpdateCategoryProps & {key: string}) =>void;
  setExtraEventKey: (key: string) => void;
  submitHandler: (ev: React.MouseEvent) => void;
}

const FinalizeFormContext = createContext<TFinalizeFormContext | null>(null);

const FinalizeFormProvider = (props: HookProps & { children: ReactNode; }) => {
  const hookData = useFinalizeEventsForm({
    categories: props.categories,
    month: props.target.month,
    year: props.target.year
  })

  const value: TFinalizeFormContext = {
    ...hookData,
    base: props.data,
  }

  return (
    <FinalizeFormContext.Provider value={value}>
      {props.children}
    </FinalizeFormContext.Provider>
  )
}

const useFinalizeFormContext = () => {
  const context = useContext(FinalizeFormContext);
  if (!context) {
    throw new Error("useFinalizeFormContext must be used within a Finalize Form Provider");
  }
  return context;
}

export { useFinalizeFormContext, FinalizeFormProvider }
