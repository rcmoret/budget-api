import { useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";
import { HeaderComponent, PageComponent } from "@frontend/layout";
import { BudgetItem, BudgetItemCollections, BudgetMonthIndex } from "@/types/budget";
import { initBudgetMonthStore, getBudgetMonth } from "../month-store";
import { useInitAdjustmentStore } from "@/lib/adjustment-amount-store";
import {
  getRedirectQueryParams,
  useAppRoutes,
} from "@/lib/app-stores/app-config-store";
import { useEditStore } from "./store";
import { AddItemSelect } from "./add-item-select";
import { EditRowCard } from "./row";
import { Notes } from "./notes";
import { RightColumn } from "./right-column";
import { useDiscretionaryPreview } from "./preview";
import { useChangePayloads } from "./payload";

const flattenItems = (items: BudgetItemCollections): Array<BudgetItem> => [
  ...items.fixedExpenses,
  ...items.variableExpenses,
  ...items.fixedRevenues,
  ...items.variableRevenues,
];

const useInitEditStore = () => {
  useEffect(() => {
    useEditStore.getState().reset();
  }, []);
};

type SaveFormBody = {
  events: ReturnType<typeof useChangePayloads>;
  notes: ReturnType<typeof useEditStore.getState>["notes"];
};

const SaveButton = () => {
  const rows = useEditStore((s) => s.rows);
  const notes = useEditStore((s) => s.notes);
  const payloads = useChangePayloads();
  const createBudgetEventsRoute = useAppRoutes("createBudgetEventsRoute");
  const redirectParams = getRedirectQueryParams();
  const { post, processing, transform } = useForm<SaveFormBody>({
    events: [],
    notes: null,
  });

  transform(() => ({ events: payloads, notes }));

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (processing || rows.length === 0) return;
    post(`${createBudgetEventsRoute}?${redirectParams}`);
  };

  return (
    <form onSubmit={onSubmit} className="contents">
      <button
        type="submit"
        disabled={processing || rows.length === 0}
        className="btn btn-sm btn-secondary"
      >
        Save
      </button>
    </form>
  );
};

const Header = () => {
  const budgetMonth = getBudgetMonth();
  const dashboardRoute = `/budget/edit/${budgetMonth.month}/${budgetMonth.year}`;

  return (
    <HeaderComponent
      rightColumnComponent={
        <div className="flex items-center gap-3">
          <Link href={dashboardRoute} className="btn btn-sm btn-ghost">
            Cancel
          </Link>
          <SaveButton />
        </div>
      }
    >
      Edit {budgetMonth.monthName} {budgetMonth.year}
    </HeaderComponent>
  );
};

const EditContent = (props: {
  items: Array<BudgetItem>;
  month: number;
  year: number;
}) => {
  useDiscretionaryPreview({ month: props.month, year: props.year });
  const rows = useEditStore((s) => s.rows);
  const itemsByKey = new Map(props.items.map((item) => [item.key, item]));

  return (
    <div className="grid gap-6 max-w-2xl">
      <div className="grid gap-2">
        <div className="text-lg">Add an item</div>
        <AddItemSelect items={props.items} month={props.month} year={props.year} />
      </div>
      {rows.length === 0 ? (
        <div className="text-sm opacity-55 py-4">
          No items added yet. Pick an existing category to adjust it, or add
          something new above.
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => (
            <EditRowCard
              key={row.budgetItemKey}
              row={row}
              currentItem={itemsByKey.get(row.budgetItemKey)}
            />
          ))}
        </div>
      )}
      <Notes />
    </div>
  );
};

const BudgetEdit = (props: BudgetMonthIndex) => {
  const { items, budgetMonth, discretionary } = props;

  initBudgetMonthStore({ budgetMonth });
  useInitAdjustmentStore();
  useInitEditStore();

  const flatItems = flattenItems(items);

  return (
    <PageComponent
      header={<Header />}
      mainId="budget-edit"
      mainComponentClassNames={["w-full"]}
      rightColumn={<RightColumn discretionaryBefore={discretionary} />}
      secondaryPanelLabel="Discretionary & review"
    >
      <EditContent
        items={flatItems}
        month={budgetMonth.month}
        year={budgetMonth.year}
      />
    </PageComponent>
  );
};

export default BudgetEdit;
