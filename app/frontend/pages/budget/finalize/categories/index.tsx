import { useCategory } from "@/pages/budget/finalize/categories/context_provider";
import { ItemCard } from "../items";
import { EventList } from "./event_list";
import { useFinalizeFormContext } from "../form_context";
import { CategoryProvider } from "./context_provider";
import { byName } from "@/lib/sort_functions";
import { KeySpan } from "@/components/common/KeySpan";
import { Point } from "@/components/common/Symbol";
import { AmountSpan } from "@/components/common/AmountSpan";
import { FinalizeFormCategory, FinalizeCategoryEvent } from "@/lib/hooks/useFinalizeEventsForm";
import { ExtraEventsSelect } from "../extra_events_select";
import { FinalizeSubmitButton as SubmitButton } from "../submit_button";

const Circle = (props: { direction: "left" | "right"; children: React.ReactNode }) => {
  const scaleVal = props.direction === "left" ? "-1" : "1"

  return (
    <div
      className={[
        "bg-green-100 hover:bg-green-200 items-center flex justify-center text-sm text-chartreuse-700 font-bold",
        "shadow-md",
        "my-2",
        "outline-chartreuse-700 outline"
      ].join(" ")}
      style={{ width: "30px", height: "30px", borderRadius: "50%", transform: `scaleX(${scaleVal})` }}
    >
      <div>
        {props.children}
      </div>
    </div>
  )
}

const ReviewListEvent = (props: { event: FinalizeCategoryEvent }) => {
  const { rolloverAmountFor } = useCategory()

  const adjustmentAmount = rolloverAmountFor(props.event.key)
  const total = adjustmentAmount + props.event.amount

  return (
    <div className="flex flex-row w-full justify-end gap-3 text-xs">
      <div className="text-right w-16">
        <AmountSpan absolute={true} amount={props.event.amount} />
      </div>
      <div className="text-right w-16">
        <AmountSpan absolute={true} amount={adjustmentAmount} prefix="+" />
      </div>
      <div className="text-right w-16 font-semibold">
        <AmountSpan absolute={true} amount={total} />
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
      <div className="odd:bg-chartreuse-100 even:bg-chartreuse-200 px-4 py-2 w-full flex flex-row justify-between items-center">
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
    <div className="bg-chartreuse-100">
      {categories.map((category) => (
        <CategoryProvider key={category.key} category={category} setCategory={setCategory}>
          <ReviewListItems key={category.key} />
        </CategoryProvider>
      ))}
    </div>
  )
}

const CategoryShow = (props: { category: FinalizeFormCategory; }) => {
  const { category } = props
  const { viewingCategoryKey, setPrevReviewingCategoryKey, setNextReviewingCategoryKey } = useFinalizeFormContext()

  if (category.key !== viewingCategoryKey) {
    return null
  } else {
    return (
      <div
       style={{ width: "450px" }}
       className="my-2 p-4 border-2 border-gray-200 rounded-lg shadow-inner-lg"
      >
        <KeySpan
          _key={category.key}
          id={`category-${category.slug}`}
        />
        <div className="w-full flex flex-row justify-between px-4">
          <div>
            <button type="button" onClick={setPrevReviewingCategoryKey}>
              <Circle direction="left">
                &#10142;
              </Circle>
            </button>
          </div>
          <div>
            <button type="button" onClick={setNextReviewingCategoryKey}>
              <Circle direction="right">
                &#10142;
              </Circle>
            </button>
          </div>
        </div>
        <div className="text-lg">
          {category.name}
          {category.isAccrual && <div className="text-sm text-gray-700">{" "}(accrual)</div>}
        </div>
        <div className="mb-2">
          {category.items.map((item, index) => (
            <ItemCard
              key={item.key}
              budgetCategoryKey={category.key}
              item={item}
              index={index}
            />
          ))}
        </div>
        <div className="mb-12">
          <EventList />
        </div>
      </div>
    )
  }
}

const CategoryGroup = (props: {
  label: string;
  categories: FinalizeFormCategory[];
}) => {
  const { setCategory } = useFinalizeFormContext()

  return (
    <>
      {props.categories.map((category) => (
        <CategoryProvider key={category.key} category={category} setCategory={setCategory}>
          <CategoryShow key={category.key} category={category} />
        </CategoryProvider>
      ))}
    </>
  )
}

const SubmitSection = (props: { children: React.ReactNode }) => {
  const { allItemsReviewed } = useFinalizeFormContext()

  if (allItemsReviewed) {
    return (
      <div className="flex flex-row justify-end my-2 py-2 border-t-2 border-chartreuse-600">
        <div className="flex flex-col gap-2 w-52">
          {props.children}
        </div>
      </div>
    )
  } else {
    return null
  }
}

const CategoryIndex = () => {
  const { groups, viewingCategoryKey } = useFinalizeFormContext()
  if (viewingCategoryKey === "__summary__") {
    return (
      <div
       style={{ width: "450px" }}
       className="my-2 p-4 border-2 border-gray-200 rounded-lg shadow-inner-lg"
      >
        <ReviewList />
        <SubmitSection>
          <ExtraEventsSelect />
          <SubmitButton />
        </SubmitSection>
      </div>
    )
  } else {
    return (
      <>
        {groups.map(({ label, collection }) => (
          <CategoryGroup key={label} label={label} categories={collection.sort(byName)} />
        ))}
      </>
    )
  }
}

export { CategoryIndex }
