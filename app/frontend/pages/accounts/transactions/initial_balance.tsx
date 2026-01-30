import { AmountSpan } from "@/components/common/AmountSpan";
import { dateParse } from "@/lib/DateFormatter";
import { TransactionContainer } from "@/pages/accounts/transactions/container";
import { ClearanceDateComponent } from "@/pages/accounts/transactions/common";
import { textColorFor } from "@/lib/context-colors";

const InitialBalance = (props: {
  index: number;
  balance: number;
  initialDate: string;
}) => {
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
        <AmountSpan
          amount={props.balance}
          negativeColor={textColorFor("negativeAmount")}
        />
      }
    />
  );
};

export { InitialBalance };
