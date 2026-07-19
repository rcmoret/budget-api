import { useEventContext } from "./event-context";
import { AmountSpan } from "@/components/amount-span";
import { useAdjustmentInputsContext } from "@/components/adjustment-input/context-provider";
import { GenericAmountInput } from "@/components/adjustment-input";

const AdjustmentEventAmountInput = () => {
  const { adjustment, adjustmentInputId, updateItemByAdjustment } =
    useAdjustmentInputsContext();
  const { setAmount } = useEventContext();
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateItemByAdjustment(ev.target.value);
    setAmount({ adjustment: ev.target.value });
  };

  return (
    <div className="grid grid-cols-subgrid col-span-full">
      <label htmlFor={adjustmentInputId} className="col-span-2">
        adjustment
      </label>
      <div className="text-end">
        <GenericAmountInput
          id={adjustmentInputId}
          name="adjustment-amount"
          onChange={onChange}
          value={adjustment.adjustmentAmount.display}
        />
      </div>
    </div>
  );
};

const ItemTotalAmountInput = () => {
  const { setAmount } = useEventContext();
  const { adjustment, updateItemByTotal, totalInputId } =
    useAdjustmentInputsContext();
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateItemByTotal(ev.target.value);
    setAmount({ total: ev.target.value });
  };

  return (
    <div className="grid grid-cols-subgrid col-span-full items-end">
      <label htmlFor={totalInputId}>total</label>
      <div className="text-end -col-start-2 -col-end-1">
        <GenericAmountInput
          id={totalInputId}
          onChange={onChange}
          value={adjustment.newTotal.display}
        />
      </div>
    </div>
  );
};

const AmountSpanToggle = (props: {
  label: string;
  amount: number;
  onClick: () => void;
}) => {
  const { amount, onClick, label } = props;
  return (
    <>
      <div className="col-span-2">{label}</div>
      <div className="text-end -col-start-2 -col-end-1">
        <button type="button" onClick={onClick}>
          <AmountSpan amount={amount} />
        </button>
      </div>
    </>
  );
};

const EventAmountInput = () => {
  const { event } = useEventContext();
  const {
    adjustment,
    editingAdjustment,
    editingTotal,
    showAdjustmentInput: selectAdjustmentInput,
    showTotalInput: selectTotalInput,
  } = useAdjustmentInputsContext();

  const total = event.updatedAmount.cents;

  return (
    <>
      {editingAdjustment ? (
        <AdjustmentEventAmountInput />
      ) : (
        <AmountSpanToggle
          onClick={selectAdjustmentInput}
          amount={adjustment.adjustmentAmount.cents}
          label="adjustment"
        />
      )}
      {editingTotal ? (
        <ItemTotalAmountInput />
      ) : (
        <AmountSpanToggle
          onClick={selectTotalInput}
          amount={total}
          label="total"
        />
      )}
    </>
  );
};

export { EventAmountInput, ItemTotalAmountInput };
