import { useState } from "react";
import { AmountSpan } from "@/components/amount-span";
import { Suggestion } from "@/pages/budget/planning/setup/featured-category/suggestions";
import { RolloverTargetEvent } from "@/types/budget/planning/rollover";
import { moneyFormatter } from "@/lib/money-formatter";
import { useRolloverClient } from "../client";
import { FeaturedItem, useFeaturedCategory } from "../store";
import {
  NONE_EVENT_KEY,
  rolloverAll,
  rolloverNone,
  rolloverPartial,
} from "../suggestions";

const targetLabel = (event: RolloverTargetEvent, index: number) => {
  const amount = moneyFormatter(event.budgeted.cents, { decorate: true });

  return event.eventType === "item_adjust"
    ? `Adjust existing item (${amount})`
    : `New item #${index + 1}`;
};

// Simple categories have one target, assigned up front. Complex categories
// let each review item pick from the category's target events.
const TargetPicker = (props: { item: FeaturedItem }) => {
  const { item } = props;
  const { targetEvents } = useFeaturedCategory();
  const { updateItem } = useRolloverClient();

  if (targetEvents.length <= 1) {
    const target = targetEvents[0];

    return (
      <div className="col-span-full text-sm">
        &rarr; {target ? targetLabel(target, 0) : "No target"}
      </div>
    );
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    updateItem(item.key, {
      adjustment: item.adjustment,
      eventKey: event.target.value || null,
    });

  return (
    <label className="col-span-full flex items-center gap-2 text-sm">
      <span>Roll over to</span>
      <select
        className="select select-sm select-bordered"
        value={item.eventKey ?? ""}
        onChange={onChange}
      >
        <option value="" disabled>
          Pick a target
        </option>
        {targetEvents.map((event, index) => (
          <option key={event.key} value={event.key}>
            {targetLabel(event, index)}
          </option>
        ))}
        <option value={NONE_EVENT_KEY}>Don&apos;t roll over</option>
      </select>
    </label>
  );
};

const PartialInput = (props: { item: FeaturedItem }) => {
  const { item } = props;
  const { updateItem } = useRolloverClient();
  const [display, setDisplay] = useState(
    item.highlighted === "partial"
      ? moneyFormatter(item.adjustment.cents, { absolute: true })
      : "",
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(event.target.value);
    updateItem(item.key, rolloverPartial(item, event.target.value), {
      debounce: true,
    });
  };

  const className = [
    "input",
    "input-sm",
    "input-bordered",
    "w-28",
    "text-right",
    item.isValid ? "" : "input-error",
  ].join(" ");

  return (
    <input
      id={`partial-${item.key}`}
      className={className}
      inputMode="decimal"
      placeholder="0.00"
      value={display}
      onChange={onChange}
    />
  );
};

const Suggestions = (props: { item: FeaturedItem }) => {
  const { item } = props;
  const { updateItem } = useRolloverClient();

  const focusPartial = () =>
    document.getElementById(`partial-${item.key}`)?.focus();

  return (
    <>
      <Suggestion
        isSelected={item.highlighted === "all"}
        onClick={() => updateItem(item.key, rolloverAll(item))}
      >
        <div>Rollover all</div>
        <div className="text-right">
          <AmountSpan amount={item.remaining.cents} />
        </div>
      </Suggestion>
      <Suggestion
        isSelected={item.highlighted === "none"}
        onClick={() => updateItem(item.key, rolloverNone(item))}
      >
        <div>Rollover none</div>
        <div className="text-right">
          <AmountSpan amount={0} />
        </div>
      </Suggestion>
      <Suggestion
        isSelected={item.highlighted === "partial"}
        onClick={focusPartial}
      >
        <div>Rollover partial</div>
        <div className="text-right">
          <PartialInput item={item} />
        </div>
      </Suggestion>
    </>
  );
};

const ItemCard = (props: { item: FeaturedItem }) => {
  const { item } = props;

  const className = [
    "bg-base-300",
    "col-span-full",
    "grid",
    "grid-cols-subgrid",
    "gap-y-2",
    "py-4",
    "px-2",
    "rounded",
    item.isValid ? "" : "outline-2 outline-error",
  ].join(" ");

  return (
    <div className={className}>
      <div className="col-span-2">Remaining</div>
      <div className="text-right">
        <AmountSpan amount={item.remaining.cents} />
      </div>
      <TargetPicker item={item} />
      <Suggestions item={item} />
      <div className="col-span-2 text-sm">Target item total</div>
      <div className="text-right text-sm">
        <AmountSpan amount={item.updatedTargetAmount.cents} />
      </div>
      <div className="col-span-2 text-sm">Not rolled over</div>
      <div className="text-right text-sm">
        <AmountSpan amount={item.unappliedAmount.cents} />
      </div>
    </div>
  );
};

export { ItemCard };
