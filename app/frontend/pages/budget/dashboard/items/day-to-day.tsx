import { DifferenceLineItem, ItemContainer, LocalAmountInput } from ".";
import { useBudgetDashboardItemContext } from "@/pages/budget/dashboard/items/context_provider";
import { useBudgetDashboardContext } from "../context_provider";
import { useToggle } from "@/lib/hooks/useToogle";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { AmountSpan } from "@/components/common/AmountSpan";

const DayToDayItemForm = () => {
  const { item } = useBudgetDashboardItemContext();
  const { form } = useBudgetDashboardContext();

  const [showAdjustmentInput, toggleAdjustmentInput] = useToggle(true);

  if (!item.draftItem || !item.change) {
    return null;
  }

  const { change, draftItem } = item;

  const onChange = (amount: string) => {
    form.updateChange(item.key, amount);
  };
  const onChange2 = (amount: string) => {
    form.updateChangeV2({ key: item.key, amount });
  };

  return (
    <Row
      styling={{
        padding: "p-2",
        flexWrap: "flex-wrap",
        flexAlign: "justify-between",
      }}
    >
      <Cell styling={{ width: "w-6/12" }}>Budgeted</Cell>
      <Cell styling={{ width: "w-3/12", textAlign: "text-right" }}>
        <AmountSpan color="text-gray-800" amount={item.amount} />
      </Cell>
      <Cell styling={{ width: "w-3/12", textAlign: "text-right" }}>
        <AmountSpan color="text-gray-800" amount={item.amount} />
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>Adjustment</Cell>
      <Cell styling={{ width: "w-6/12", textAlign: "text-right" }}>
        <LocalAmountInput
          isInputShown={showAdjustmentInput}
          itemKey={item.key}
          amount={change.amount}
          onChange={onChange}
          toggleInput={toggleAdjustmentInput}
        >
          (
          <AmountSpan
                        amount={change.amount.cents ?? 0}
            absolute={true}
          />
          )
        </LocalAmountInput>
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>New Amount</Cell>
      <Cell
        styling={{
          padding: "py-2",
          width: "w-6/12",
          textAlign: "text-right",
          border: "border-b border-gray-500",
        }}
      >
        <LocalAmountInput
          itemKey={item.key}
          isInputShown={!showAdjustmentInput}
          onChange={onChange2}
          amount={change.updatedAmount}
          toggleInput={toggleAdjustmentInput}
        >
          <AmountSpan color="text-gray-800" amount={draftItem.amount} />
        </LocalAmountInput>
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>Spent/Deposited</Cell>
      <Cell styling={{ textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan
                    amount={item.spent}
          absolute={true}
          prefix="+"
        />
      </Cell>
      <Cell styling={{ textAlign: "text-right", width: "w-3/12" }}>
        <AmountSpan
                    amount={item.spent}
          absolute={true}
          prefix="+"
        />
      </Cell>
      <Cell styling={{ width: "w-6/12" }}>Remaining/Difference</Cell>
      <Cell
        styling={{
          fontWeight: "font-bold",
          textAlign: "text-right",
          width: "w-3/12",
        }}
      >
        <AmountSpan
                    amount={item.remaining}
          absolute={true}
        />
      </Cell>
      <Cell
        styling={{
          fontWeight: "font-bold",
          textAlign: "text-right",
          width: "w-3/12",
        }}
      >
        <AmountSpan
                    amount={draftItem.remaining}
          absolute={true}
        />
      </Cell>
    </Row>
  );
};

const DayToDayItem = () => {
  const { item } = useBudgetDashboardItemContext();

  if (!!item.draftItem) {
    return (
      <ItemContainer>
        <DayToDayItemForm />
      </ItemContainer>
    );
  } else {
    return (
      <ItemContainer>
        <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
          <Cell styling={{ width: "w-6/12" }}>Spent/Deposited</Cell>
          <Cell
            styling={{
              fontWeight: "font-bold",
              textAlign: "text-right",
              width: "w-4/12",
            }}
          >
            <AmountSpan amount={item.spent} absolute={true} />
          </Cell>
        </Row>
        <Row
          styling={{
            padding: "p-2",
            flexAlign: "justify-between",
            border: "border-b border-gray-100",
          }}
        >
          <Cell styling={{ width: "w-6/12" }}>Remaining/Difference</Cell>
          <Cell
            styling={{
              fontWeight: "font-bold",
              textAlign: "text-right",
              width: "w-4/12",
            }}
          >
            <AmountSpan amount={item.remaining} absolute={true} />
          </Cell>
        </Row>
        <DifferenceLineItem />
      </ItemContainer>
    );
  }
};

export { DayToDayItem };
