import { CategoryType } from "@/types/budget/planning/setup";
import { useSetupClient } from "../client";
import { Link } from "@inertiajs/react";
import {
  useToggleReviewedCategoryVisibility,
  useFeaturedCategory,
  useFeaturedEvents,
  useTrackedEvents,
} from "../store";

const FeaturedCategoryComponent = () => {
  const category = useFeaturedCategory();
  const events = useFeaturedEvents();
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
  ].join(" ");

  return (
    <div className={className}>
      <div>{category.name}</div>
      <div className="flex justify-end gap-2">
        {events.map((event, index) => (
          <CompletionStatusIcon key={index} event={event.flags} />
        ))}
      </div>
    </div>
  );
};

const NameComponent = (props: { category: CategoryType }) => {
  const { hasChanges } = useTrackedEvents();
  const { category } = props;
  const { updateCategory } = useSetupClient();
  const handleClick = () => updateCategory({ slug: category.slug });

  if (hasChanges) {
    return (
      <button
        type="button"
        className="cursor-pointer text-left"
        onClick={handleClick}
      >
        {category.name}
      </button>
    );
  } else {
    return <Link href={category.route}>{category.name}</Link>;
  }
};

const CategoryComponent = (props: { category: CategoryType }) => {
  const { category } = props;
  const { toggleValue: showReviewedCategories } =
    useToggleReviewedCategoryVisibility();
  const needsReview = category.events.some(
    ({ unreviewed, isValid }) => unreviewed || !isValid,
  );
  const isVisible = needsReview || showReviewedCategories;

  const className = [
    "grid",
    "grid-cols-subgrid",
    "col-span-full",
    "transition-[grid-template-rows,opacity]",
    "duration-300",
    "ease-in-out",
    isVisible
      ? "grid-rows-[minmax(0,1fr)]"
      : "grid-rows-[minmax(0,0fr)] opacity-0",
  ]
    .filter(Boolean)
    .join(" ");

  const innerClassName = [
    "overflow-hidden",
    "grid",
    "grid-cols-subgrid",
    "col-span-full",
    "items-center",
    "py-1",
    "pl-4",
    "pr-2",
    "border-b",
    "border-neutral-600",
    "text-neutral-600",
    "text-sm",
  ].join(" ");

  return (
    <div className={className}>
      <div className={innerClassName}>
        <NameComponent category={category} />
        <div className="flex justify-end gap-2">
          {category.events.map((event, index) => (
            <CompletionStatusIcon key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

type CompletionStatusProps = {
  unreviewed: boolean;
  isValid: boolean;
};

const CompletionStatusIcon = (props: { event: CompletionStatusProps }) => {
  const { event } = props;

  if (!event.isValid) {
    return <div className="bg-error w-1.5 h-1.5 rounded-full"></div>;
  } else if (event.unreviewed) {
    return <div className="bg-neutral w-1.5 h-1.5 rounded-full"></div>;
  } else {
    return <div className="bg-secondary w-1.5 h-1.5 rounded-full"></div>;
  }
};

const CategoryListComponent = (props: { category: CategoryType }) => {
  const featuredCategory = useFeaturedCategory();

  if (featuredCategory.slug === props.category.slug) {
    return <FeaturedCategoryComponent />;
  }

  return <CategoryComponent {...props} />;
};

export { CategoryListComponent };
