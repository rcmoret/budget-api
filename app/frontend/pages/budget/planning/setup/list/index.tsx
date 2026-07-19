import { useSetupGroups } from "../store";
import { GroupComponent } from "./group";
import { CategoryGroupProvider } from "./group-context";

const CategoryGroupList = () => {
  const { revenues, fixedExpenses, variableExpenses } = useSetupGroups();

  return (
    <div className="grid-cols-[1fr_auto] px-1 pt-2 gap-6">
      <CategoryGroupProvider key={revenues.key} group={revenues}>
        <GroupComponent key={revenues.key} />
      </CategoryGroupProvider>
      <CategoryGroupProvider key={fixedExpenses.key} group={fixedExpenses}>
        <GroupComponent key={fixedExpenses.key} />
      </CategoryGroupProvider>
      <CategoryGroupProvider
        key={variableExpenses.key}
        group={variableExpenses}
      >
        <GroupComponent key={variableExpenses.key} />
      </CategoryGroupProvider>
    </div>
  );
};

export { CategoryGroupList };
