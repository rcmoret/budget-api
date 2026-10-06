import { Link } from "@inertiajs/react";
import { Collapse } from "@/components/collapse";
import { useToggle } from "@/utils/hooks/useToogle";
import {
  CategoryGroup,
  CategoryType,
  ItemStatusType,
} from "@/types/budget/planning/rollover";
import {
  orderedGroups,
  useFeaturedCategory,
  useFeaturedItems,
  useRolloverGroups,
  useShowReviewedCategories,
} from "../store";

const StatusDot = (props: { status: ItemStatusType }) => {
  const { isReviewed, isValid } = props.status;

  const color = !isValid
    ? "bg-error"
    : isReviewed
      ? "bg-secondary"
      : "bg-neutral";

  return <div className={`${color} w-1.5 h-1.5 rounded-full`} />;
};

const StatusDots = (props: { items: Array<ItemStatusType> }) => (
  <div className="flex justify-end gap-2">
    {props.items.map((status, index) => (
      <StatusDot key={index} status={status} />
    ))}
  </div>
);

// The featured category uses the live item state, so its dots change as
// soon as an edit is made.
const FeaturedCategoryRow = () => {
  const category = useFeaturedCategory();
  const items = useFeaturedItems();

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
      <StatusDots items={items} />
    </div>
  );
};

const CategoryRow = (props: { category: CategoryType }) => {
  const { category } = props;
  const featuredCategory = useFeaturedCategory();
  const { toggleValue: showReviewed } = useShowReviewedCategories();

  if (featuredCategory.slug === category.slug) {
    return <FeaturedCategoryRow />;
  }

  const needsReview = category.items.some(
    ({ isReviewed, isValid }) => !isReviewed || !isValid,
  );

  const innerClassName = [
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
    <Collapse
      open={needsReview || showReviewed}
      fade
      subgrid
      innerClassName={innerClassName}
    >
      <Link href={category.route}>{category.name}</Link>
      <StatusDots items={category.items} />
    </Collapse>
  );
};

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
];

const GroupLabel = (props: { group: CategoryGroup }) => {
  const { isReviewed, count, isSelected } = props.group.metadata;
  const fontClasses = isSelected ? "text-lg font-bold" : "font-semi";

  return (
    <>
      <div className={fontClasses}>&bull; {props.group.label}</div>
      <div className="text-sm text-right">
        {isReviewed} / {count}
      </div>
    </>
  );
};

const Group = (props: { group: CategoryGroup }) => {
  const { group } = props;
  const { isSelected } = group.metadata;
  const [showList, toggleList] = useToggle(isSelected);

  const label = isSelected ? (
    <div
      className={[
        ...groupLabelClasses,
        "bg-base-200",
        "outline-2",
        "outline-secondary",
        "-outline-offset-2",
        "mb-2",
      ].join(" ")}
    >
      <GroupLabel group={group} />
    </div>
  ) : (
    <button
      type="button"
      onClick={toggleList}
      className={[...groupLabelClasses, "bg-base-200/60"].join(" ")}
    >
      <GroupLabel group={group} />
    </button>
  );

  return (
    <div className="grid grid-cols-subgrid col-span-full">
      {label}
      <Collapse open={isSelected || showList} subgrid>
        {group.categories.map((category) => (
          <CategoryRow key={category.key} category={category} />
        ))}
      </Collapse>
    </div>
  );
};

const CategoryGroupList = () => {
  const groups = useRolloverGroups();

  return (
    <div className="grid grid-cols-[1fr_auto] gap-y-2 content-start">
      {orderedGroups(groups).map((group) => (
        <Group key={group.key} group={group} />
      ))}
    </div>
  );
};

export { CategoryGroupList };
