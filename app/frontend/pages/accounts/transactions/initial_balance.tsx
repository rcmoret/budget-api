import { AmountSpan } from "@/components/common";
import { dateParse } from "@/lib/DateFormatter";
import { TransactionContainer } from "@/pages/accounts/transactions/container";
import {
  CaretComponent,
  ClearanceDateComponent,
} from "@/pages/accounts/transactions/common";

const InitialBalance = (props: { balance: number; initialDate: string }) => {
  const clearanceDate = dateParse(props.initialDate);
  const shortClearanceDate = dateParse(props.initialDate, {
    format: "m/d/yy",
  });
  return (
    <TransactionContainer
      keyComponent={null}
      caretComponent={
        <CaretComponent
          details={[]}
          isDetailShown={false}
          toggleFn={() => null}
        />
      }
      clearanceDateComponent={
        <ClearanceDateComponent
          clearanceDate={clearanceDate}
          shortClearanceDate={shortClearanceDate}
        />
      }
      descriptionComponent="Balance"
      transactionAmountComponent={null}
      balanceCompnent={
        <AmountSpan amount={props.balance} negativeColor="text-red-800" />
      }
    />
  );
};

export { InitialBalance };
