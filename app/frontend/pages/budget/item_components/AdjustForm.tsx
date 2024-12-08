import { AppConfigContext } from "@/components/layout/Provider";
import { DraftItem } from "@/pages/budget"
import { useContext } from "react";
import { AmountSpan } from "@/components/common/AmountSpan";
import { DraftChange, MergedItem } from "@/lib/hooks/useDraftEvents";
import { SubmitButton } from "@/components/common/Button";
import { StripedRow } from "@/components/common/Row";
import { Icon } from "@/components/common/Icon";

const LineItem = (props: {
  item: DraftItem;
  existingItems: MergedItem[];
  changes: DraftChange[];
}) => {
  const { item } = props
  const existingItem = props.existingItems.find((i) => {
    return i.key === item.key
  }) || null

  const change = props.changes.find((change) => {
    return change.budgetItemKey === item.key
  }) || null

  return (
    <StripedRow oddColor="odd:bg-cyan-50" evenColor="even:bg-cyan-100" styling={{ rounded: "rounded", padding: "p-2", flexAlign: "justify-between" }}>
      <div className="w-2/12">
        {item.name}
      </div>
      <div className="w-2/12 text-right">
        {!!existingItem ? <AmountSpan amount={existingItem.amount} /> : <span>-</span>}
      </div>
      <div className="w-2/12 text-right">
        {!!change && <AmountSpan amount={change.amount.cents || 0} />}
      </div>
      <div className="w-2/12 text-right">
        <AmountSpan amount={item.amount} />
      </div>
      <div className="w-2/12 text-right">
        {!!existingItem ? <AmountSpan amount={existingItem.spent} /> : <span>-</span>}
      </div>
      <div className="w-2/12 text-right">
        <AmountSpan amount={item.remaining} absolute={true} />
      </div>
    </StripedRow>
  )
}

type ComponentProps = {
  newDraftItems: Array<DraftItem>;
  adjustItems: Array<DraftItem>;
  discretionary: { amount: number; overUnderBudget: number } | undefined;
  existingItems: MergedItem[];
  changes: DraftChange[]
  postEvents: () => void;
  processing: boolean;
}

const AdjustForm = (props: ComponentProps) => {
  const { appConfig } = useContext(AppConfigContext)
  const { discretionary } = appConfig.budget
  const items = [...props.adjustItems, ...props.newDraftItems].sort((i1, i2) => {
    return i1.name.toLowerCase() < i2.name.toLowerCase() ? -1 : 1
  })

  const { discretionary: updatedDiscretionary } = props

  if (items.length < 2 || !updatedDiscretionary) { return null }

  const originalTotal = discretionary.amount - discretionary.transactionsTotal - discretionary.overUnderBudget;
  const updatedTotal = updatedDiscretionary.amount - discretionary.transactionsTotal - updatedDiscretionary.overUnderBudget;
  const updatedRemaining = updatedDiscretionary.amount
  const originalRemaining = discretionary.amount
  const bottomLineChange = updatedRemaining - originalRemaining

  return (
    <div className="w-full px-4 py-2 bg-cyan-50 rounded-lg">
      <div className="text-xl border-b border-[#056155] pb-2 w-full">Budget Updates</div>
      <div className="w-full flex flex-col mb-4 border-b border-[#056155]">
        <div className="w-full flex flex-row px-2 justify-between text-gray-800 text-sm">
          <div className="w-2/12">
            Item
          </div>
          <div className="w-2/12 text-right">
            Original Amount
          </div>
          <div className="w-2/12 text-right">
            Adjustment
          </div>
          <div className="w-2/12 text-right">
            Updated Amount
          </div>
          <div className="w-2/12 text-right">
            Spent or Deposited
          </div>
          <div className="w-2/12 text-right">
            Remaining
          </div>
        </div>
        {items.map((item) => {
          return (
            <LineItem
              key={item.key}
              item={item}
              existingItems={props.existingItems}
              changes={props.changes}
            />
          )
        })}
      </div>
      <div className="w-full flex flex-row items-end">
        <div className="w-8/12 flex flex-col gap-2">
          <div className="w-full flex flex-row justify-between">
            <div className="w-4/12">
            </div>
            <div className="w-4/12 text-right font-semibold underline">
              Original
            </div>
            <div className="w-4/12 text-right font-semibold underline">
              Updated
            </div>
          </div>
          <div className="w-full flex flex-fow justify-between">
            <div className="w-4/12">
              Total
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan amount={originalTotal} />
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan amount={updatedTotal} />
            </div>
          </div>
          <div className="w-full flex flex-fow justify-between">
            <div className="w-4/12">
              Deposited / Spent
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan amount={discretionary.transactionsTotal} />
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan amount={discretionary.transactionsTotal} />
            </div>
          </div>
          <div className="w-full flex flex-fow justify-between">
            <div className="w-4/12">
              Over / Under Budget
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan
                amount={discretionary.overUnderBudget}
                color="text-green-800"
                negativeColor="text-red-400"
                zeroColor="text-black"
              />
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan
                amount={updatedDiscretionary.overUnderBudget}
                color="text-green-800"
                negativeColor="text-red-400"
                zeroColor="text-black"
              />
            </div>
          </div>
          <div className="w-full flex flex-fow justify-between">
            <div className="w-4/12">
              Remaining
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan amount={originalRemaining} />
            </div>
            <div className="w-4/12 text-right">
              <AmountSpan amount={updatedRemaining} />
            </div>
          </div>
          <div className="w-full flex flex-fow justify-between border-t border-[#056155] pt-1">
            <div className="w-6/12">
              Bottom Line Change:
            </div>
            <div className="w-6/12 font-semibold">
              <AmountSpan
                amount={bottomLineChange}
                color="text-green-800"
                negativeColor="text-red-400"
                zeroColor="text-black"
              />
            </div>
          </div>
        </div>
        <div className="w-4/12 flex flex-row justify-end">
          <SubmitButton
            onSubmit={props.postEvents}
            disabledStyling={{
              color: "text-black",
              backgroundColor: "bg-gray-300",
              hoverColor: "hover:bg-gray-300",
              cursor: "cursor-not-allowed"
            }}
            styling={{
              color: "text-white",
              backgroundColor: "bg-green-600",
              hoverColor: "hover:bg-green-700",
              fontWeight: "font-semibold",
              rounded: "rounded",
              padding: "px-4 py-2",
              display: "flex",
              gap: "gap-2"
            }}
            isEnabled={!props.processing}
          >
            SUBMIT UPDATES
            <div className={props.processing ? "text-gray-700" : "text-chartreuse-300"}>
              <Icon name="check-circle" />
            </div>
          </SubmitButton>
        </div>
      </div>
    </div>
  )
}

export { AdjustForm }
