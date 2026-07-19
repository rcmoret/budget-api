import {
  useEventFlagsContext,
  useEventContext,
} from "@/pages/budget/planning/setup/featured-category/events/event-context";
import { Suggestion } from ".";
import { AmountSpan } from "@/components/amount-span";

const BudgetedSuggestion = () => {
  const { event, setAmount, selectedSuggestion, setSelectedSuggestion } =
    useEventContext();
  const { eqPrevBudgeted, eqPrevSpent } = useEventFlagsContext();

  const { previouslyBudgeted } = event;
  const isSelected =
    (selectedSuggestion ?? "budgeted") === "budgeted" && eqPrevBudgeted;

  const label = eqPrevSpent ? "Budgeted / Spent" : "Budgeted";

  const setBudgeted = () => {
    setSelectedSuggestion("budgeted");
    setAmount({ total: event.previouslyBudgeted.display });
  };

  return (
    <Suggestion onClick={setBudgeted} isSelected={isSelected}>
      <div>{label}</div>
      <div className="text-right">
        <AmountSpan amount={previouslyBudgeted.cents} />
      </div>
    </Suggestion>
  );
};

export { BudgetedSuggestion };
