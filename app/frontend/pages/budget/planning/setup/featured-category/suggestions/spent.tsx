import { AmountSpan } from "@/components/amount-span";
import { Suggestion } from ".";
import { useFeaturedCategory } from "../../store";
import { useEventContext } from "@/pages/budget/planning/setup/featured-category/events/event-context";

const SpentSuggestion = () => {
  const { event, selectedSuggestion, setSelectedSuggestion } =
    useEventContext();
  const category = useFeaturedCategory();
  const isSelected =
    selectedSuggestion === "spent" && event.amount === event.updatedAmount;
  const label = category.isExpense ? "Spent" : "Deposited";

  const onClick = () => setSelectedSuggestion("spent");
  console.log(event);

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
