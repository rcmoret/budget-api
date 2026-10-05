import { useEffect } from "react";
import { AmountSpan } from "@/components/amount-span";
import { CloseButton } from "@/components/close-button";
import {
  CreateEventSelectComponent,
  CreateEventSelectProvider,
  useCreateEventSelectContext,
} from "@/components/create-event-form";
import { useRolloverClient } from "../client";
import { useUnapplied } from "../store";

// Saves the picked category as soon as it's selected, then resets the
// select. Candidate keys change on every fetch, so the saved target is shown
// as text rather than as the select's value.
const SaveSelection = () => {
  const { selectedEvent, setSelectedKey } = useCreateEventSelectContext();
  const { updateUnappliedTarget } = useRolloverClient();

  useEffect(() => {
    if (!selectedEvent) return;

    updateUnappliedTarget(selectedEvent);
    setSelectedKey(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent?.key]);

  return null;
};

const StoredTarget = () => {
  const { scope, targetEvent, isTargetValid } = useUnapplied();
  const { updateUnappliedTarget } = useRolloverClient();

  if (!targetEvent) {
    return <div className="text-sm text-neutral-600">No category picked</div>;
  }

  const kind = scope === "expenses" ? "an expense" : "a revenue";

  return (
    <div className="grid gap-1">
      <div className="flex justify-between items-center">
        <span className={isTargetValid ? "" : "line-through"}>
          {targetEvent.name}
        </span>
        <CloseButton
          onClick={() => updateUnappliedTarget(null)}
          title="Clear Category"
          ariaLabel="Clear Category"
        />
      </div>
      {!isTargetValid && (
        <div className="text-sm text-error">Pick {kind} category instead</div>
      )}
    </div>
  );
};

const UnappliedTarget = () => {
  const { isReady, scope, total, targetMonth, targetYear } = useUnapplied();

  if (!isReady) {
    return (
      <div className="text-sm text-neutral-600">
        Review every category to choose where the remainder goes
      </div>
    );
  }

  if (!scope) {
    return <div className="text-sm">Everything rolls over</div>;
  }

  return (
    <div className="grid gap-2 w-full">
      <div className="flex justify-between">
        <span>Apply remainder to</span>
        <AmountSpan amount={total.cents} />
      </div>
      <StoredTarget />
      <CreateEventSelectProvider
        scopes={[scope]}
        eventContext="current"
        month={targetMonth}
        year={targetYear}
      >
        <CreateEventSelectComponent aria-label="Choose where the remainder goes" />
        <SaveSelection />
      </CreateEventSelectProvider>
    </div>
  );
};

export { UnappliedTarget };
