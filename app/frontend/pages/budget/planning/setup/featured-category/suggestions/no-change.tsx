import { AmountSpan } from "@/components/amount-span";
import { Suggestion } from ".";
import {
  useEventFlagsContext,
  useEventContext,
} from "@/pages/budget/planning/setup/featured-category/events/event-context";

const NoChangeSuggestion = () => {
  const { event, setAmount, selectedSuggestion, setSelectedSuggestion } =
    useEventContext();
  const { eqPrevBudgeted } = useEventFlagsContext();
  const onClick = () => {
    setAmount({ adjustment: "0.00" });
    setSelectedSuggestion("unchanged");
  };
  const isSelected = selectedSuggestion === "unchanged" && eqPrevBudgeted;
  const { previouslyBudgeted } = event;

  return (
    <Suggestion onClick={onClick} isSelected={isSelected}>
      <div>No Change</div>
      <div className="text-right">
        <AmountSpan amount={previouslyBudgeted.cents} />
      </div>
    </Suggestion>
  );
};

export { NoChangeSuggestion };
