import { useToggle } from "@/utils/hooks/useToogle";
import { CategoryListComponent } from "./category";
import { useCategoryGroupContext } from "./group-context";
import { Collapse } from "@/components/collapse";

const GroupComponent = () => {
  const group = useCategoryGroupContext();
  const { isSelected } = group.metadata;
  const [showCategoryList, toggleCategoryList] = useToggle(isSelected);

  const isCategoryListVisible = isSelected || showCategoryList;

  return (
    <div className="grid grid-cols-subgrid col-span-full">
      {isSelected ? (
        <CurrentGroupLabel />
      ) : (
        <GroupLabelButton toggleCategoryList={toggleCategoryList} />
      )}
      <CategoryList isCategoryListVisible={isCategoryListVisible} />
    </div>
  );
};

const CategoryList = (props: { isCategoryListVisible: boolean }) => {
  const group = useCategoryGroupContext();

  return (
    <Collapse open={props.isCategoryListVisible} subgrid>
      {group.categories.map((category) => (
        <CategoryListComponent key={category.key} category={category} />
      ))}
    </Collapse>
  );
};

const InnerGroupLabel = () => {
  const group = useCategoryGroupContext();

  const { isReviewed, count, isSelected } = group.metadata;

  const fontClasses = isSelected ? "text-lg font-bold" : "font-semi";

  return (
    <>
      <div className={fontClasses}>&bull; {group.label}</div>
      <div className="text-sm text-right">
        {isReviewed} / {count}
      </div>
    </>
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

const CurrentGroupLabel = () => {
  const className = [
    ...groupLabelClasses,
    "bg-base-200",
    "outline-2",
    "outline-secondary",
    "mb-2",
  ].join(" ");

  return (
    <div className={className}>
      <InnerGroupLabel />
    </div>
  );
};

const GroupLabelButton = (props: { toggleCategoryList: () => void }) => {
  const className = [...groupLabelClasses, "bg-base-200/60"].join(" ");

  return (
    <button
      type="button"
      onClick={props.toggleCategoryList}
      className={className}
    >
      <InnerGroupLabel />
    </button>
  );
};

export { GroupComponent };
