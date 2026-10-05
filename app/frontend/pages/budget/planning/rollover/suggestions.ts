import { MonetaryAmount } from "@/types/amount";
import { inputAmount } from "@/lib/adjustment-amount-store";

type SuggestionName = "all" | "none" | "partial";

type ItemAmounts = {
  adjustment: MonetaryAmount;
  remaining: MonetaryAmount;
  eventKey: string | null;
};

// The "none" target event: nothing rolls over, so there's nothing to target.
const NONE_EVENT_KEY = "none";

// An unset adjustment serializes with a blank display (NullMoney), which is
// different from an explicit zero ("0.00").
const hasAdjustment = (item: ItemAmounts) => item.adjustment.display !== "";

// Mirrors ItemToItemSerializer#reviewed?
const isReviewed = (item: ItemAmounts) =>
  !!item.eventKey && hasAdjustment(item);

// Mirrors ItemToItemSerializer#valid?: the adjustment is between zero and
// the remaining amount, whichever sign the remaining amount has.
const isValid = (item: ItemAmounts) => {
  const low = Math.min(0, item.remaining.cents);
  const high = Math.max(0, item.remaining.cents);
  const cents = item.adjustment.cents;

  return cents >= low && cents <= high;
};

const unappliedAmount = (item: ItemAmounts): MonetaryAmount => {
  if (!isReviewed(item)) {
    return { cents: 0, display: "" };
  }

  return inputAmount({ cents: item.remaining.cents - item.adjustment.cents });
};

// Which suggestion to highlight, from the amounts rather than the last click.
const highlightedSuggestion = (item: ItemAmounts): SuggestionName | null => {
  if (!hasAdjustment(item)) {
    return null;
  }

  const { cents } = item.adjustment;

  if (cents === item.remaining.cents) {
    return "all";
  } else if (cents === 0 && isReviewed(item)) {
    return "none";
  } else if (isReviewed(item) && isValid(item)) {
    return "partial";
  }

  return null;
};

type ItemChanges = {
  adjustment: MonetaryAmount;
  eventKey: string | null;
};

// Rolling over all of it, or part of it, needs a real target, so a "none"
// event key is cleared and the user picks a target (Complex) again.
const targetEventKey = (eventKey: string | null) =>
  eventKey === NONE_EVENT_KEY ? null : eventKey;

const rolloverAll = (item: ItemAmounts): ItemChanges => ({
  adjustment: inputAmount({ cents: item.remaining.cents }),
  eventKey: targetEventKey(item.eventKey),
});

// Nothing rolls over. When no target was picked yet, "none" is the target
// so a single click reviews the item.
const rolloverNone = (item: ItemAmounts): ItemChanges => ({
  adjustment: inputAmount({ cents: 0 }),
  eventKey: item.eventKey ?? NONE_EVENT_KEY,
});

// The typed amount takes the remaining amount's sign, so an expense can be
// entered as "40" rather than "-40".
const rolloverPartial = (item: ItemAmounts, display: string): ItemChanges => {
  const typed = Math.abs(inputAmount({ display }).cents);
  const cents = item.remaining.cents < 0 ? -typed : typed;

  return {
    adjustment:
      display === "" ? { cents: 0, display: "" } : inputAmount({ cents }),
    eventKey: targetEventKey(item.eventKey),
  };
};

export type { ItemAmounts, ItemChanges, SuggestionName };
export {
  NONE_EVENT_KEY,
  hasAdjustment,
  highlightedSuggestion,
  isReviewed,
  isValid,
  rolloverAll,
  rolloverNone,
  rolloverPartial,
  unappliedAmount,
};
