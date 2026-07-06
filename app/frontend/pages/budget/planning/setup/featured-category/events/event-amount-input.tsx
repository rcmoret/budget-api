import { useState } from "react";
import { useEventContext } from "./event-context";
import { AmountSpan } from "@/components/amount-span";

type GenericAmountInputProps = {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
};

const GenericAmountInput = (props: GenericAmountInputProps) => {
  const { name, onChange, value } = props;

  return (
    <input
      value={value}
      onChange={onChange}
      className="input input-xs text-right"
      type="text"
      name={name}
    />
  );
};

const EventAmountInput = (props?: { label?: string }) => {
  const { event, setAmount } = useEventContext();
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(ev.target.value);
  const label = props?.label ?? null;

  return (
    <div className="grid grid-cols-subgrid col-span-full">
      <div className="col-span-2">{label}</div>
      <div className="text-end">
        <GenericAmountInput
          onChange={onChange}
          value={event.adjustment.display}
          name="adjust-amount"
        />
      </div>
    </div>
  );
};

const ItemTotalAmountInput = () => {
  const { event, setUpdatedAmount } = useEventContext();
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedAmount(ev.target.value);
  };

  return (
    <div className="grid grid-cols-subgrid col-span-full items-end">
      <div>total</div>
      <div className="text-end -col-start-2 -col-end-1">
        <GenericAmountInput
          value={event.updatedAmount.display}
          onChange={onChange}
          name="item-total"
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

const AdjustEventAmountInput = () => {
  const { event } = useEventContext();
  const [selectedInputName, setSelectedInputName] = useState<
    "adjustment" | "total"
  >("adjustment");

  const total = event.updatedAmount.cents;
  const selectAdjustmentInput = () => setSelectedInputName("adjustment");
  const selectTotalInput = () => setSelectedInputName("total");

  return (
    <>
      {selectedInputName === "adjustment" ? (
        <EventAmountInput label={selectedInputName} />
      ) : (
        <AmountSpanToggle
          onClick={selectAdjustmentInput}
          amount={event.adjustment.cents}
          label="adjustment"
        />
      )}
      {selectedInputName === "total" ? (
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

export { AdjustEventAmountInput, EventAmountInput, ItemTotalAmountInput };
