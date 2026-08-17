import { useEffect, useState } from "react";
import type { GroupBase } from "react-select";
import { ThemedSelect } from "@/components/themed-select";
import { fetchCreateEvents, CreateEvent } from "@/lib/create-events-client";
import { useAdjustmentStore } from "@/lib/adjustment-amount-store";
import { BudgetItem } from "@/types/budget";
import { useEditStore } from "./store";

type Option = { value: string; label: string };

const AddItemSelect = (props: {
  items: Array<BudgetItem>;
  month: number | string;
  year: number | string;
}) => {
  const rows = useEditStore((s) => s.rows);
  const addRow = useEditStore((s) => s.addRow);
  const addAdjustmentItem = useAdjustmentStore((s) => s.addItem);
  const [createEvents, setCreateEvents] = useState<Array<CreateEvent>>([]);

  const rowKeys = rows.map((row) => row.budgetItemKey);
  const createExcludedKeys = rows
    .filter((row) => row.eventType === "item_create")
    .map((row) => row.budgetItemKey);
  const excludedKeysDep = createExcludedKeys.join(",");

  useEffect(() => {
    let cancelled = false;

    fetchCreateEvents({
      eventContext: "current",
      scopes: [],
      excludedKeys: createExcludedKeys,
      month: props.month,
      year: props.year,
    }).then((events) => {
      if (!cancelled) setCreateEvents(events ?? []);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedKeysDep, props.month, props.year]);

  const existingOptions: Array<Option> = props.items
    .filter((item) => !rowKeys.includes(item.key))
    .map((item) => ({ value: item.key, label: item.name }));

  const newOptions: Array<Option> = createEvents.map((event) => ({
    value: event.budgetItemKey,
    label: event.name,
  }));

  const groupedOptions: Array<GroupBase<Option>> = [
    { label: "Adjust existing", options: existingOptions },
    { label: "Add new", options: newOptions },
  ].filter((group) => group.options.length > 0);

  const onChange = (option: Option | null) => {
    if (!option) return;

    const existingItem = props.items.find((item) => item.key === option.value);
    if (existingItem) {
      addAdjustmentItem({
        objectKey: existingItem.key,
        amount: existingItem.amount.display,
      });
      addRow({
        budgetItemKey: existingItem.key,
        budgetCategoryKey: existingItem.budgetCategoryKey,
        name: existingItem.name,
        eventType: "item_adjust",
      });
      return;
    }

    const createEvent = createEvents.find(
      (event) => event.budgetItemKey === option.value,
    );
    if (!createEvent) return;

    addAdjustmentItem({ objectKey: createEvent.budgetItemKey, amount: "0" });
    addRow({
      budgetItemKey: createEvent.budgetItemKey,
      budgetCategoryKey: createEvent.budgetCategoryKey,
      name: createEvent.name,
      eventType: "item_create",
      createEvent,
    });
  };

  return (
    <ThemedSelect<Option>
      aria-label="Add an item"
      placeholder="Add an item"
      size="sm"
      variant="secondary"
      options={groupedOptions}
      value={null}
      onChange={onChange}
    />
  );
};

export { AddItemSelect };
