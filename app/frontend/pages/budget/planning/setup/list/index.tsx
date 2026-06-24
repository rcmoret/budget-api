import { getSetupGroups } from "../store";
import { GroupComponent } from "./group";
import { CategoryGroupProvider } from "./group-context";

const CategoryGroupList = () => {
  const { revenues, fixedExpenses, variableExpenses } = getSetupGroups()

  return (
    <div className="grid grid-cols-[1fr_auto] px-1 gap-6">
      <CategoryGroupProvider key={revenues.key} group={revenues} >
        <GroupComponent key={revenues.key} />
      </CategoryGroupProvider>
      <CategoryGroupProvider key={fixedExpenses.key} group={fixedExpenses} >
        <GroupComponent key={fixedExpenses.key} />
      </CategoryGroupProvider>
      <CategoryGroupProvider key={variableExpenses.key} group={variableExpenses} >
        <GroupComponent key={variableExpenses.key} />
      </CategoryGroupProvider>
    </div>
  )
}

export { CategoryGroupList }
