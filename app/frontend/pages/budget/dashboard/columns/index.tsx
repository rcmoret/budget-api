import {
  Section,
  ClearedMonthlyItemsSections,
  DayToDayItemsSection,
  PendingMonthlyItemsSection,
} from "./section";
import { Cell } from "@/components/common/Cell";
import { Discretionary } from "@/pages/budget/discretionary";
import { useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";
import { DraftItem } from "@/pages/budget/dashboard";
import { SelectBudgetCategory } from "@/types/budget";
import { useToggle } from "@/lib/hooks/useToogle";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { NewItems, CategorySelect } from "./category_select";

interface ColumnProps {
  title: string;
  children: React.ReactNode;
  categories: Array<SelectBudgetCategory>;
  newItems: Array<DraftItem>;
}

const Column = (props: ColumnProps) => {
  const [isSelectShown, toggleSelect] = useToggle(false);

  return (
    <Cell
      styling={{
        width: "w-full md:w-1/2",
        padding: "px-2",
      }}
    >
      <div className="w-full p-2 flex flex-row justify-between">
        <div className="text-2xl">{props.title}</div>
        <div className="text-lg">
          <Button
            type="button"
            onClick={toggleSelect}
            styling={{ color: "text-blue-300" }}
          >
            <Icon name={isSelectShown ? "times-circle" : "plus-circle"} />
          </Button>
        </div>
      </div>
      {isSelectShown && <CategorySelect categories={props.categories} />}
      <NewItems items={props.newItems} />
      {props.children}
    </Cell>
  );
};

const DayToDayColumn = () => {
  const { itemCollections, weekly } = useBudgetDashboardContext();
  const { categories, newItems } = weekly;

  return (
    <Column title="Day-to-Day" categories={categories} newItems={newItems}>
      <Section title="Discretionary">
        <Discretionary />
      </Section>
      <div className="w-full h-0.5 my-2 px-4">
        <div className="bg-gray-300 h-full w-full"></div>
      </div>
      <DayToDayItemsSection
        title="Revenues"
        itemData={itemCollections.weekly.revenues}
      />
      <div className="w-full h-0.5 my-2 px-4">
        <div className="bg-gray-300 h-full w-full"></div>
      </div>
      <DayToDayItemsSection
        title="Expenses"
        itemData={itemCollections.weekly.expenses}
      />
    </Column>
  );
};

const MonthlyColumn = () => {
  const { monthly, itemCollections: hookItems } = useBudgetDashboardContext();
  const { categories, newItems } = monthly;
  const itemCollections = hookItems.monthly;

  return (
    <Column title="Monthly" categories={categories} newItems={newItems}>
      <PendingMonthlyItemsSection
        title="Revenues"
        itemData={itemCollections.pending.revenues}
      />
      <PendingMonthlyItemsSection
        title="Expenses"
        itemData={itemCollections.pending.expenses}
      />
      <div className="w-full h-0.5 my-2 px-4">
        <div className="bg-gray-300 h-full w-full"></div>
      </div>
      <ClearedMonthlyItemsSections />
    </Column>
  );
};

export { DayToDayColumn, MonthlyColumn };
