import { useBudgetItemContext } from "./context-provider";
import { AmountSpan } from "@/components/amount-span";

const PreviouslyBudgetedDetails = () => {
  const { item } = useBudgetItemContext();
  const { previouslyBudgeted, previouslyBudgetedPercentage } = item;

  return (
    <>
      <div>Previously Budgeted</div>
      <div className="bg-accent w-1.5 h-1.5 rounded-full"></div>
      <div></div>
      <div className="text-right">
        <AmountSpan amount={previouslyBudgeted.cents} absolute={true} />
      </div>
      <div className="text-right">
        ({previouslyBudgetedPercentage}%)
      </div>
    </>
  )
}

const CurrentlyBudgetedDetails = () => {
  const { item } = useBudgetItemContext()
  const { currentlyBudgeted, currentlyBudgetedPercentage } = item

  return (
    <>
      <div>Currently Budgeted</div>
      <div className="bg-secondary w-1.5 h-1.5 rounded-full"></div>
      <div></div>
      <div className="text-right">
        <AmountSpan amount={currentlyBudgeted.cents} absolute={true} />
      </div>
      <div className="text-right">
        ({currentlyBudgetedPercentage}%)
      </div>
    </>
  )
}

const ItemCompositionDetails = () => {
  const { item } = useBudgetItemContext()
  const previouslyBudgetedPercentage = `${item.previouslyBudgetedPercentage}%`
  const currentlyBudgetedPercentage = `${item.currentlyBudgetedPercentage}%`

  if (item.currentlyBudgetedPercentage === 100) { return null }

  return (
    <>
      <div className="grid grid-cols-[auto_auto_1fr_auto_auto] gap-x-2 gap-y-0 text-xs px-1 items-center">
        <PreviouslyBudgetedDetails />
        <CurrentlyBudgetedDetails />
      </div>
      <div className="w-full px-1">
        <div className="h-1.5 w-full overflow-hidden rounded-lg flex flex-row">
          <div className="h-1.5 bg-accent" style={{ width: previouslyBudgetedPercentage }} title={previouslyBudgetedPercentage}></div>
          <div className="h-1.5 bg-secondary" style={{ width: currentlyBudgetedPercentage }} title={currentlyBudgetedPercentage}></div>
        </div>
      </div>
    </>
  )
}

export { ItemCompositionDetails }
