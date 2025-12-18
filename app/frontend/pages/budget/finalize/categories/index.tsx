import { FinalizeFormCategory } from "@/lib/hooks/useFinalizeEventsForm";
import { ItemCard } from "../items";
import { Point } from "@/components/common/Symbol";
import { EventList } from "./event_list";
import { useFinalizeFormContext } from "../form_context";
import { CategoryProvider } from "./context_provider";

const CategoryShow = (props: { category: FinalizeFormCategory; }) => {
  const { category } = props

  return (
    <div className="my-2 pb-2 border-b border-gray-400">
      <span id={`category-${category.slug}`}></span>
      <div className="text-lg">{category.name}</div>
      <div className="mb-2">
        {category.items.map((item, index) => (
          <ItemCard key={item.key} item={item} index={index} />
        ))}
      </div>
      <div className="mb-12">
        <EventList />
      </div>
    </div>
  )
}

const grouped = [
  {
    label: "Accruals",
    filter: (category: FinalizeFormCategory) => category.isAccrual,
  },
  {
    label: "Revenues",
    filter: (category: FinalizeFormCategory) => !category.isAccrual && !category.isExpense,
  },
  {
    label: "Expenses",
    filter: (category: FinalizeFormCategory) => !category.isAccrual && category.isExpense,
  }
]

const CategoryGroup = (props: {
  label: string;
  categories: FinalizeFormCategory[];
}) => {
  const { setCategory } = useFinalizeFormContext()
  return (
    <div>
      <div>
        <Point>
          <span className="text-xl underline text-cyan-700">
            {props.label}
          </span>
        </Point>
      </div>
      {props.categories.map((category) => (
        <CategoryProvider key={category.key} category={category} setCategory={setCategory}>
          <CategoryShow key={category.key} category={category} />
        </CategoryProvider>
      ))}
    </div>
  )
}

const CategoryIndex = () => {
  const { categories } = useFinalizeFormContext()

  const groups = grouped.map(({ label, filter }) => ({ label, collection: categories.filter(filter) }))

  return (
    <>
      {groups.map(({ label, collection }) => (
        <CategoryGroup key={label} label={label} categories={collection} />
      ))}
    </>
  )
}

export { CategoryIndex }
