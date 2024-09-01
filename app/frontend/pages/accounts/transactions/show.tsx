import React, { useState } from "react";

import { AmountSpan } from "@/components/common/AmountSpan";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { dateParse } from "@/lib/DateFormatter";
import { byAmount, byCategoryName } from "@/lib/sort_functions";
import { TransactionContainer } from "@/pages/accounts/transactions/container";
import {
  CaretComponent,
  ClearanceDateComponent,
} from "@/pages/accounts/transactions/common";
import { ModeledTransaction } from "@/lib/models/transaction";
import { AccountTransactionDetail } from "@/types/transaction";

const TransactionShow = (props: {
  transaction: ModeledTransaction;
  balance: number;
}) => {
  const [isDetailShown, updateDetailVisibility] = useState<boolean>(false);
  const toggleDetailView = () => updateDetailVisibility(!isDetailShown);
  const { transaction } = props;
  const {
    key,
    isBudgetExclusion,
    checkNumber,
    description,
    details,
    isPending,
    notes,
    transferKey,
  } = transaction;
  const clearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate));
  const shortClearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate), {
        format: "m/d/yy",
      });
  let descriptionComponent: string | React.ReactNode = description || "";
  if (details.length > 1 && isDetailShown) {
    descriptionComponent = (
      <>
        <div className="w-full">
          {description || <BudgetItemsDescription details={details} />}
        </div>
        <BudgetItemList details={details} />
      </>
    );
  } else if (description === null) {
    descriptionComponent = <BudgetItemsDescription details={details} />;
  } else {
    descriptionComponent = <span>{description}</span>;
  }

  let noteLines: string[] = [];
  const notesNeedAttn = !!notes?.startsWith("!!!");
  if (notes) {
    noteLines = notes.replace(/^!!!\s/, "").split("<br>");
  }

  return (
    <TransactionContainer
      keyComponent={<div className="hidden">{key}</div>}
      caretComponent={
        <CaretComponent
          details={details}
          isDetailShown={isDetailShown}
          toggleFn={toggleDetailView}
        />
      }
      clearanceDateComponent={
        <ClearanceDateComponent
          clearanceDate={clearanceDate}
          shortClearanceDate={shortClearanceDate}
        />
      }
      descriptionComponent={descriptionComponent}
      transactionAmountComponent={
        isDetailShown ? (
          <BudgetItemAmounts details={details} amount={transaction.amount} />
        ) : (
          <AmountSpan amount={transaction.amount} />
        )
      }
      balanceCompnent={
        <AmountSpan amount={props.balance} negativeColor="text-red-700" />
      }
    >
      <Cell
        styling={{
          display: "flex",
          width: "w-full md:w-4/12",
          flexAlign: "justify-start",
          flexWrap: "flex-wrap",
        }}
      >
        {!!description && details.length > 1 && (
          <BudgetItemsDescription details={details} />
        )}
        {isBudgetExclusion && (
          <div className="ml-4 md:max-w-2/12 max-md:w-full italic">
            budget exclusion
          </div>
        )}
        {checkNumber && (
          <div className="ml-4">
            <Icon name="money-check" /> {checkNumber}
          </div>
        )}
        {transferKey && (
          <div className="ml-4 max-md:w-full md:max-w-2/12 italic">
            <span className="hidden">{transferKey}</span>
            transfer
          </div>
        )}
        {!!noteLines.length && (
          <Notes noteLines={noteLines} notesNeedAttn={notesNeedAttn} />
        )}
      </Cell>
      <Cell
        styling={{
          width: "w-[14%]",
          flexAlign: "justify-start",
          margin: "mr-4",
        }}
      >
        <div className="w-full max-sm:justify-between flex flex-row-reverse">
          <div className="mr-2">
            <Icon name="trash" />
          </div>
          <div className="mr-2">
            <Icon name="edit" />
          </div>
        </div>
      </Cell>
    </TransactionContainer>
  );
};

const BudgetItemsDescription = (props: {
  details: AccountTransactionDetail[];
}) => {
  const details = props.details
    .filter((detail: AccountTransactionDetail) => detail.budgetCategoryName)
    .sort(byCategoryName);

  return (
    <div className="ml-4">
      {details.map((detail: AccountTransactionDetail, n: number) => (
        <span key={detail.key}>
          {n > 0 && "; "}
          {detail.budgetCategoryName}{" "}
          {detail.iconClassName && <Icon name={detail.iconClassName} />}
        </span>
      ))}
    </div>
  );
};

const BudgetItemList = (props: { details: AccountTransactionDetail[] }) =>
  props.details.sort(byAmount).map((detail) => (
    <div key={detail.key} className="w-full text-sm">
      {detail.budgetCategoryName || "Petty Cash"}{" "}
      {detail.iconClassName && <Icon name={detail.iconClassName} />}
    </div>
  ));

const BudgetItemAmounts = (props: {
  details: AccountTransactionDetail[];
  amount: number;
}) => (
  <div className="w-full">
    <AmountSpan amount={props.amount} />
    {props.details.sort(byAmount).map((detail) => (
      <div key={detail.key} className="w-full text-sm">
        <AmountSpan amount={detail.amount} />
      </div>
    ))}
  </div>
);

const Notes = (props: { noteLines: string[]; notesNeedAttn: boolean }) => {
  const className = [
    "ml-4",
    "max-md:w-full",
    "md:max-w-4/12",
    "pl-2",
    "pr-2",
    ...(props.notesNeedAttn ? ["bg-teal-400", "text-white", "rounded"] : []),
  ].join(" ");

  return (
    <div className={className}>
      {props.noteLines.map((noteLine: string, index: number) => (
        <div key={index} className="w-full">
          {index === 0 && <Icon name="sticky-note" />} {noteLine}
        </div>
      ))}
    </div>
  );
};

const LinkContainer = (props: { children: React.ReactNode }) => (
  <Cell
    styling={{
      width: "w-full md:w-1/7",
      flexAlign: "justify-start",
    }}
  >
    <div className="w-full max-sm:justify-between ml-4 flex flex-row-reverse">
      {props.children}
    </div>
  </Cell>
);
export { TransactionShow };
