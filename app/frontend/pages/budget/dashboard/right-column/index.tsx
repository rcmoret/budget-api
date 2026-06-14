import { BudgetMonth, NeighborLinks } from "./budget-month"
import { Discretionary } from "./discretionary"

const RightColumn = () => {
  return (
    <>
      <NeighborLinks />
      <div className="border rounded border-neutral p-4">
        <BudgetMonth />
      </div>
      <div className="border rounded border-neutral p-4">
        <Discretionary />
      </div>
    </>
  )
}

export { RightColumn }
