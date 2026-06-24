import { getFeaturedCategory } from "../store"
import { Suggestions } from "./suggestions"

const groupLabelClassName = [
  "from-accent/70",
  "dark:from-accent/90",
  "to-accent/40",
  "dark:to-accent/66",
  "shadow-md",
  "text-base-content",
  "dark:text-accent-content",
  "flex",
  "gap-2",
  "px-4",
  "py-2",
  "rounded",
  "text-xl",
  "tracking-wide",
  "bg-gradient-to-r"
].join(" ")

const FeaturedCategoryComponent = () => {
  const featuredCategory = getFeaturedCategory()

  return (
    <div className="content-start">
      <div className={groupLabelClassName}>
        {featuredCategory.name}
      </div>
      <Suggestions />
    </div>
  )
}

export { FeaturedCategoryComponent }
