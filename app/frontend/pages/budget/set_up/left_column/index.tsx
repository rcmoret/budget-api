import {
  TCategoryGroup,
  useSetupEventsFormContext,
} from "@/pages/budget/set_up";
import { CategoryButton } from "./category_button";
import { CategoryListItemShow as CategoryShow } from "@/pages/budget/set_up/categories";
import {
  CategoryGroup,
  useSetupCategoryGroupContext,
} from "@/pages/budget/set_up/categories/group_context";
import { AddCategorySelect } from "./new-category";

const CategoryList = () => {
  const { categories, metadata } = useSetupCategoryGroupContext();

  if (metadata.isSelected) {
    return (
      <div className="flex flex-col gap-2 px-4">
        {categories.map((category) => (
          <CategoryShow key={category.slug} category={category}>
            <CategoryButton />
          </CategoryShow>
        ))}
        <AddCategorySelect />
      </div>
    );
  } else {
    return null;
  }
};

const GroupLabel = () => {
  const { categories, label, metadata } = useSetupCategoryGroupContext();
  const { putCategory } = useSetupEventsFormContext();

  const onClick = () => {
    if (!metadata.count) {
      return null;
    } else {
      putCategory(categories[0]?.slug ?? null);
    }
  };

  const className = [
    "w-full",
    "flex",
    "flex-row",
    "justify-between",
    "items-center",
    ...(metadata.isSelected
      ? ["border-b", "mb-4", "pb-1", "border-gray-100"]
      : ["my-2"]),
  ].join(" ");

  const labelClassName = [
    "text-blue-300",
    "font-semibold",
    ...(metadata.isSelected ? ["text-2xl"] : ["text-xl"]),
  ].join(" ");

  const widthPercentage = !metadata.count
    ? 0
    : ((100 * metadata.isReviewed) / metadata.count).toFixed(2);

  const outterProgressClassName = [
    "h-[9px]",
    "w-20",
    "bg-gray-100",
    "rounded-xl",
    "overflow-hidden",
  ].join(" ");

  const innerProgressClassName = [
    "h-[9px]",
    ...(!metadata.unreviewed ? ["bg-chartreuse-400"] : ["bg-chartreuse-300"]),
  ].join(" ");

  return (
    <div className={className}>
      <button type="button" onClick={onClick}>
        <div className={labelClassName}>{label}</div>
      </button>{" "}
      <div className={outterProgressClassName}>
        <div
          className={innerProgressClassName}
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const SelectedGroupWrapper = (props: { children: React.ReactNode }) => {
  const boxShadowProp = {
    boxShadow: [
      "3px -3px 3px -1px rgba(0, 0, 0, 0.2)",
      "2px 1px 4px -1px rgba(0, 0, 0, 0.2)",
      "-1px 0px 4px -1px rgba(0, 0, 0, 0.2)",
    ].join(", "),
  };

  const style = {
    ...boxShadowProp,
  };

  return (
    <div className="px-2 py-4" style={style}>
      {props.children}
    </div>
  );
};

const UnselectedGroupWrapper = (props: { children: React.ReactNode }) => {
  return <div className="px-2 py-4">{props.children}</div>;
};

const GroupWrapper = (props: {
  group: TCategoryGroup;
  children: React.ReactNode;
}) => {
  if (props.group.metadata.isSelected) {
    return <SelectedGroupWrapper>{props.children}</SelectedGroupWrapper>;
  } else {
    return <UnselectedGroupWrapper>{props.children}</UnselectedGroupWrapper>;
  }
};

const LeftColumn = () => {
  const { groups } = useSetupEventsFormContext();

  return (
    <div className="flex flex-col gap-1">
      {Object.values(groups).map((group, index) => (
        <GroupWrapper key={index} group={group}>
          <CategoryGroup group={group} key={index}>
            <GroupLabel />
            <CategoryList />
          </CategoryGroup>
        </GroupWrapper>
      ))}
    </div>
  );
};

export { LeftColumn };
