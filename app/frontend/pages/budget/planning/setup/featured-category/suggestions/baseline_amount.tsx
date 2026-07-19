import { AmountSpan } from "@/components/amount-span";
import { Suggestion } from ".";
import {
  useEventFlagsContext,
  useEventContext,
} from "@/pages/budget/planning/setup/featured-category/events/event-context";
import { useFeaturedCategory } from "../../store";

const BaselineAmountSuggestion = () => {
  const category = useFeaturedCategory();
  const baselineAmount = category.defaultAmount;
  const { showDefaultSuggestion } = useEventFlagsContext();
  const { selectedSuggestion, setAmount, setSelectedSuggestion } =
    useEventContext();
  const isSelected = selectedSuggestion === "baseline";
  const onClick = () => {
    setSelectedSuggestion("baseline");
    setAmount({ total: baselineAmount.display });
  };

  if (!showDefaultSuggestion) return null;

  return (
    <Suggestion isSelected={isSelected} onClick={onClick}>
      <div>Baseline</div>
      <div className="text-right">
        <AmountSpan amount={baselineAmount.cents} />
      </div>
    </Suggestion>
  );
};

export { BaselineAmountSuggestion };
