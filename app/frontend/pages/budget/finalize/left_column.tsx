import { useFinalizeFormContext } from "@/pages/budget/finalize/form_context";
import {
  FinalizeCategoryFormItem,
  FinalizeFormCategory,
} from "@/lib/hooks/useFinalizeEventsForm";
import { Point } from "@/components/common/Symbol";

const LeftColumn = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-4">
      {props.children}
      <CategoryList />
    </div>
  );
};

const CompletionMarker = (props: { needsReview: boolean }) => {
  if (props.needsReview) {
    return <div className="font-semibold text-gray-1000">&#9675;</div>;
  } else {
    return <div className="text-green-500">&#9679;</div>;
  }
};

const buttonClassName = (isCurrentlyViewing: boolean) => {
  const activeClasses = ["font-semibold", "p-2", "text-lg", "w-80"];
  const inactiveClasses = [
    "px-2",
    "py-1",
    "text-base",
    "w-72",
    "hover:outline-gray-200",
  ];

  return [
    "shadow-md",
    "font-medium",
    "rounded-lg",
    "text-center",
    "bg-gray-50",
    "outline",
    "outline-gray-200",
    "w-72",
    "text-black",
    ...(isCurrentlyViewing ? activeClasses : inactiveClasses),
  ].join(" ");
};

const CategoryButton = (props: {
  category: FinalizeFormCategory;
  isCurrentlyViewing: boolean;
}) => {
  const { category } = props;
  const items: FinalizeCategoryFormItem[] = category.items;
  const needsReview = items.some(({ needsReview }) => needsReview);
  const { setViewingCategoryKey } = useFinalizeFormContext();

  const onClick = () => setViewingCategoryKey(category.key);

  return (
    <button
      type="button"
      className={buttonClassName(props.isCurrentlyViewing)}
      onClick={onClick}
    >
      <div className="flex flex-row justify-between w-full">
        {category.name}
        <CompletionMarker needsReview={needsReview} />
      </div>
    </button>
  );
};

const SummaryButton = (props: { isCurrentlyViewing: boolean }) => {
  const { setViewingCategoryKey } = useFinalizeFormContext();

  const onClick = () => setViewingCategoryKey("__summary__");

  return (
    <div>
      <Point>
        <span className="text-xl underline text-cyan-700">Summary</span>
      </Point>
      <div className="flex flex-col gap-2 px-4">
        <button
          type="button"
          className={buttonClassName(props.isCurrentlyViewing)}
          onClick={onClick}
        >
          <div className="flex flex-row justify-between w-full">
            <div>Items</div>
          </div>
        </button>
      </div>
    </div>
  );
};

const CategoryList = () => {
  const { groups, viewingCategoryKey } = useFinalizeFormContext();

  return (
    <>
      {groups.map(({ label, collection }) => (
        <div key={label}>
          <Point>
            <span className="text-xl underline text-cyan-700">{label}</span>
          </Point>
          <div className="flex flex-col gap-2 px-4">
            {collection.map((category) => (
              <CategoryButton
                key={category.key}
                category={category}
                isCurrentlyViewing={category.key === viewingCategoryKey}
              />
            ))}
          </div>
        </div>
      ))}
      <SummaryButton
        isCurrentlyViewing={viewingCategoryKey === "__summary__"}
      />
    </>
  );
};

export { LeftColumn };
