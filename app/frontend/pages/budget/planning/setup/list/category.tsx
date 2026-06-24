import { CategoryType } from "@/types/budget/planning/setup";
import { useSetupClient } from "../client";
import { Link } from "@inertiajs/react";
import { useEventsRef } from "../store";

const FeaturedCategoryComponent = ({ category }: { category: CategoryType }) => {
  const className = [
    "grid",
    "grid-cols-subgrid",
    "col-span-full",
    "items-center",
    "py-1",
    "border-b",
    "px-2",
    "text-base",
    "border-primary",
  ].join(" ")

  return (
    <div className={className}>
      <div>
        {category.name}
      </div>
      <div className="flex justify-end gap-2">
        {category.events.map((event, index) => (
          <CompletionStatusIcon key={index} event={event} />
        ))}
      </div>
    </div>
  )
}

const NameComponent = (props: { category: CategoryType }) => {
  const { hasChanges } = useEventsRef()
  const { category } = props
  const { putCategory } = useSetupClient()
  const handleClick = () => putCategory({ slug: category.slug })

  if (hasChanges) {
    <button type="button" className="cursor-pointer text-left" onClick={handleClick}>
      {category.name}
    </button>
  } else {
    return (
      <Link href={category.route}>
        {category.name}
      </Link>
    )
  }
}

const CategoryComponent = (props: { category: CategoryType, isVisible?: boolean }) => {
  const { category, isVisible = true } = props

  const className = [
    "grid",
    "grid-cols-subgrid",
    "col-span-full",
    "items-center",
    "py-1",
    "border-b",
    "pl-4",
    "pr-2",
    "text-neutral",
    "text-sm",
    "border-neutral",
    "grid-rows-[1fr]",
    "transition-[grid-template-rows,opacity]",
    "duration-300",
    !isVisible && "grid-rows-[0fr] opacity-0",
  ].filter(Boolean).join(" ")

  return (
    <div className={className}>
      <div className="overflow-hidden grid grid-cols-subgrid col-span-full items-center">
        <NameComponent category={category} />
        <div className="flex justify-end gap-2">
          {category.events.map((event, index) => (
            <CompletionStatusIcon key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

type CompletionStatusProps = {
  unreviewed: boolean;
  isValid: boolean;
}


const CompletionStatusIcon = (props: { event: CompletionStatusProps }) => {
  const { event } = props

  if (!event.isValid) {
    return <div className="bg-alert w-1.5 h-1.5 rounded-full"></div>
  } else if (event.unreviewed) {
    return <div className="bg-neutral w-1.5 h-1.5 rounded-full"></div>
  } else {
    return <div className="bg-secondary w-1.5 h-1.5 rounded-full"></div>
  }
}

export { CategoryComponent, FeaturedCategoryComponent };
