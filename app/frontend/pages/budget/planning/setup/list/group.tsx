import { useToggle } from "@/utils/hooks/useToogle";
import { CategoryComponent, FeaturedCategoryComponent } from "./category";
import { useCategoryGroupContext } from "./group-context";
import { getFeaturedCategory } from "../store";

const GroupComponent = () => {
  const group = useCategoryGroupContext()
  const { isSelected } = group.metadata
  const [showCategoryList, toggleCategoryList] = useToggle(isSelected)


  const isCategoryListVisible = isSelected || showCategoryList

  return (
    <div className="grid grid-cols-subgrid col-span-full">
      {isSelected ? <CurrentGroupLabel /> : <GroupLabelButton toggleCategoryList={toggleCategoryList} />}
      <CategoryList isCategoryListVisible={isCategoryListVisible} />
    </div>
  )
}

const CategoryList = (props: { isCategoryListVisible: boolean }) => {
  const group = useCategoryGroupContext()
  const featuredCategory = getFeaturedCategory();

  return (
    <div
      className={[
        "grid grid-cols-subgrid col-span-full",
        "grid-rows-[0fr] transition-[grid-template-rows] duration-300",
        props.isCategoryListVisible ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      ].join(" ")}
    >
      <div className="overflow-hidden grid grid-cols-subgrid col-span-full">
        {group.categories.map((category) => (
          featuredCategory.slug === category.slug ?
            <FeaturedCategoryComponent key={category.key} category={category} /> :
            <CategoryComponent key={category.key} category={category} />
        ))}
      </div>
    </div>
  )
}

const InnerGroupLabel = () => {
  const group = useCategoryGroupContext()

  const { isReviewed, count, isSelected } = group.metadata

  const fontClasses = isSelected ? "text-lg font-bold" : "font-semi"

  return (
    <>
      <div className={fontClasses}>
        &bull; {group.label}
      </div>
      <div className="text-sm text-right">
        {isReviewed} / {count}
      </div>
    </>
  )
}
const groupLabelClasses = [
  "grid",
  "grid-cols-subgrid",
  "col-span-full",
  "text-accent-content",
  "items-center",
  "rounded",
  "px-4",
  "py-1",
  "text-left",
]

const CurrentGroupLabel = () => {
  const className = [
    ...groupLabelClasses,
    "bg-base-200",
    "outline-2",
    "outline-secondary",
    "mb-2"
  ].join(" ")

  return (
    <div className={className}>
      <InnerGroupLabel />
    </div>
  )
}

const GroupLabelButton = (props: { toggleCategoryList: () => void }) => {
  const className = [
    ...groupLabelClasses,
    "bg-base-200/60"
  ].join(" ")


  return (
    <button type="button" onClick={props.toggleCategoryList} className={className}>
      <InnerGroupLabel />
    </button>
  )
}

export { GroupComponent }
