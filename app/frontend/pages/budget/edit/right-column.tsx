import { AmountSpan } from "@/components/amount-span";
import { DiscretionaryDetails } from "@/types/budget/discretionary";
import { useEditStore } from "./store";
import { useRowDisplayDeltas } from "./payload";

const DiscretionaryPreview = (props: { before: DiscretionaryDetails }) => {
  const after = useEditStore((s) => s.discretionaryAfter);
  const status = useEditStore((s) => s.previewStatus);
  const shown = after ?? props.before;

  return (
    <div className="grid gap-2">
      <div className="text-lg">Discretionary</div>
      <div
        className={[
          "flex items-center gap-2 text-sm bg-base-200 rounded shadow-md px-3 py-2",
          status === "loading" ? "opacity-60" : "",
        ].join(" ")}
      >
        <AmountSpan amount={props.before.remaining.cents} colorize="none" />
        <span aria-hidden="true">&rarr;</span>
        <AmountSpan amount={shown.remaining.cents} colorize="none" />
      </div>
    </div>
  );
};

const Review = () => {
  const rows = useEditStore((s) => s.rows);
  const deltas = useRowDisplayDeltas();

  if (rows.length === 0) {
    return <div className="text-sm opacity-55">No items yet.</div>;
  }

  return (
    <div className="grid gap-1">
      {rows.map((row) => (
        <div key={row.budgetItemKey} className="flex justify-between text-sm">
          <span className="opacity-75">{row.name}</span>
          <AmountSpan amount={deltas[row.budgetItemKey] ?? 0} colorize="normal" />
        </div>
      ))}
    </div>
  );
};

const RightColumn = (props: { discretionaryBefore: DiscretionaryDetails }) => {
  return (
    <div className="grid gap-4">
      <DiscretionaryPreview before={props.discretionaryBefore} />
      <div className="pt-4 border-t border-neutral">
        <div className="text-lg pb-2">Review</div>
        <Review />
      </div>
    </div>
  );
};

export { RightColumn };
