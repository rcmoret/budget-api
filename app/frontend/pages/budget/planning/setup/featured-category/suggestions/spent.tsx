import { AmountSpan } from "@/components/amount-span";
import { Suggestion } from ".";
import { useFeaturedCategory } from "../../store";
import { useEventContext } from "@/pages/budget/planning/setup/featured-category/events/event-context";
import { useAdjustmentInputsContext } from "@/components/adjustment-input/context-provider";

const SpentSuggestion = () => {
  const { adjustment } = useAdjustmentInputsContext();
  const { event, selectedSuggestion, setAmount, setSelectedSuggestion } =
    useEventContext();
  const category = useFeaturedCategory();
  const isSelected =
    selectedSuggestion === "spent" &&
    event.transactionsTotal.cents === adjustment.newTotal.cents;
  const label = category.isExpense ? "Spent" : "Deposited";

  const onClick = () => {
    setAmount({ total: event.transactionsTotal.display });
    setSelectedSuggestion("spent");
  };

  return (
    <Suggestion onClick={onClick} isSelected={isSelected}>
      <div>{label}</div>
      <div className="text-right">
        <AmountSpan amount={event.transactionsTotal.cents} />
      </div>
    </Suggestion>
  );
};

export { SpentSuggestion };
