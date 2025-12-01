import { BudgetFinalizePageData } from "@/components/layout/Header";
import { CategoryProvider, useCategory } from "./categories/context_provider";
import { FinalizeCategory, FinalizeCategoryEvent } from "@/lib/hooks/useFinalizeEventsForm";
import { CategoryIndex } from "./categories";
import { Summary } from "./summary";
import { ExtraEventsSelect } from "./extra_events_select";
import { FinalizeFormProvider, useFinalizeFormContext } from "./form_context";
import { FinalizeSubmitButton as SubmitButton } from "./submit_button";
import { AmountSpan } from "@/components/common/AmountSpan";
import { Point } from "@/components/common/Symbol";

type IndexComponentProps = {
  categories: Array<FinalizeCategory>
  target: BudgetFinalizePageData;
  data: BudgetFinalizePageData;
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

const ReviewListEvent = (props: { event: FinalizeCategoryEvent }) => {
  const { rolloverAmountFor } = useCategory()

  const adjustmentAmount = rolloverAmountFor(props.event.key)
  const total = adjustmentAmount + props.event.amount

  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="w-40 flex flex-row justify-between">
        <div className="text-left">
          budgeted:
        </div>
        <div className="text-right">
          <AmountSpan absolute={true} amount={props.event.amount} />
        </div>
      </div>
      <div className="w-40 flex flex-row justify-between">
        <div className="text-left">
          adjustment:
        </div>
        <div className="text-right border-b border-chartreuse-400">
          <AmountSpan absolute={true} amount={adjustmentAmount} />
        </div>
      </div>
      <div className="w-40 flex flex-row justify-between">
        <div className="text-left">
          total:
        </div>
        <div className="text-right">
          <AmountSpan absolute={true} amount={total} />
        </div>
      </div>
    </div>
  )
}

const ReviewListItems = () => {
  const { category, effectiveEvents, rolloverAmountFor } = useCategory()

  if (!effectiveEvents.length || !effectiveEvents.some((ev) => rolloverAmountFor(ev.key))) {
    return null
  } else {
    return (
      <div className="odd:bg-chartreuse-100 even:bg-chartreuse-200 p-2 rounded-lg">
        <Point>
          <a href={`#category-${category.slug}`}>
            {category.name}
          </a>
        </Point>
        {effectiveEvents.map((event) => (
          <ReviewListEvent key={event.key} event={event} />
        ))}
      </div>
    )
  }
}

const ReviewList = () => {
  const { categories: unsortedCategories, setCategory } = useFinalizeFormContext()

  const categories = unsortedCategories.sort((cat1, cat2) => cat1.name < cat2.name ? -1 : 1)

  return (
    <div className="bg-chartreuse-100 w-fit px-1 pb-2">
      {categories.map((category) => (
        <CategoryProvider key={category.key} category={category} setCategory={setCategory}>
          <ReviewListItems key={category.key} />
        </CategoryProvider>
      ))}
    </div>
  )
}

const BudgetFinalizeIndex = (props: IndexComponentProps) => {
  return (
    <div className="w-full flex flex-row flex-wrap">
      <FinalizeFormProvider {...props}>
        <div className="w-full md:w-1/2 flex flex-col gap-2 w-full mb-6 p-2">
          <Summary />
          <CategoryIndex />
          <Summary />
          <SubmitSection>
            <ReviewList />
            <ExtraEventsSelect />
            <SubmitButton />
          </SubmitSection>
        </div>
      </FinalizeFormProvider>
    </div>
  )
}

export default BudgetFinalizeIndex;
