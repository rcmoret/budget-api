import { AmountSpan } from "@/components/common/AmountSpan";
import { dateParse } from "@/lib/DateFormatter";
import { TransactionContainer } from "@/pages/accounts/transactions/container";
import {
  CaretComponent,
  ClearanceDateComponent,
} from "@/pages/accounts/transactions/common";

const InitialBalance = (props: { index: number, balance: number; initialDate: string }) => {
  const clearanceDate = dateParse(props.initialDate);
  const shortClearanceDate = dateParse(props.initialDate, {
    format: "m/d/yy",
  });


  return (
    <TransactionContainer
      index={props.index}
      keyComponent={null}
      clearanceDateComponent={
        <ClearanceDateComponent
          clearanceDate={clearanceDate}
          shortClearanceDate={shortClearanceDate}
          toggleForm={() => null}
        />
      }
      descriptionComponent="Balance"
      transactionAmountComponent={null}
      balanceCompnent={
        <AmountSpan amount={props.balance} negativeColor="text-red-400" />
      }
    />
  );
};

export { InitialBalance };
