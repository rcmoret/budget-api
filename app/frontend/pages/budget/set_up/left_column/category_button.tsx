import { useSetupCategoryGroupContext } from "@/pages/budget/set_up/categories/group_context";
import { useSetupEventsFormContext, TEventFlags } from "@/pages/budget/set_up";
import { useSetupCategoryListItemContext } from "../categories";

const buttonClassName = (isCurrentlyViewing: boolean = false) => {
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

const StatusMarker = (props: { flags: TEventFlags }) => {
  if (!props.flags.isValid) {
    return <div className="text-red-600">&#9679;</div>;
  }

  if (props.flags.hasDeleteIntent) {
    return <div className="text-sm text-gray-700">&#8722;</div>;
  }

  if (props.flags.unreviewed) {
    return <div className="text-sm text-gray-700">&#9675;</div>;
  }

  return <div className="text-chartreuse-700">&#9679;</div>;
};

const CategoryListItem = () => {
  const { putCategory } = useSetupEventsFormContext();
  const { category, currentlyReviewing } = useSetupCategoryListItemContext();
  const { showAddForm, toggleShowAddForm } = useSetupCategoryGroupContext();

  const hasDeleteIntent = category.events.every((ev) => ev.hasDeleteIntent);
  const className = [...(hasDeleteIntent ? ["line-through"] : [""])].join(" ");
  const isSelected = currentlyReviewing && !showAddForm;

  if (currentlyReviewing && !showAddForm) {
    return (
      <div className={buttonClassName(true)}>
        <ListItemInner className={className} />
      </div>
    );
  } else if (currentlyReviewing && showAddForm) {
    return (
      <button
        type="button"
        className={buttonClassName(false)}
        onClick={toggleShowAddForm}
      >
        <ListItemInner className={className} />
      </button>
    );
  } else {
    const onClick = () => {
      putCategory(category.slug);
      if (showAddForm) {
        toggleShowAddForm();
      }
    };

    return (
      <button
        type="button"
        className={buttonClassName(isSelected)}
        onClick={onClick}
      >
        <ListItemInner className={className} />
      </button>
    );
  }
};

const ListItemInner = (props: { className: string }) => {
  const { category } = useSetupCategoryListItemContext();

  return (
    <div className="flex flex-row justify-between w-full">
      <div className={props.className}>{category.name}</div>
      <div className="flex flex-row-reverse gap-1 items-center">
        {category.events.map((flags, i) => (
          <StatusMarker key={i} flags={flags} />
        ))}
      </div>
    </div>
  );
};

export { CategoryListItem as CategoryButton };
