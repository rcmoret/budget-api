import React from "react";
import { StripedRow } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";

interface ContainerProps {
  keyComponent: React.ReactNode;
  caretComponent: React.ReactNode;
  clearanceDateComponent: React.ReactNode;
  descriptionComponent: React.ReactNode | string;
  transactionAmountComponent: React.ReactNode;
  balanceCompnent: React.ReactNode | null;
  children?: React.ReactNode;
}

const TransactionContainer = (props: ContainerProps) => (
  <StripedRow
    styling={{
      flexAlign: "justify-start",
      flexWrap: "flex-wrap",
      padding: "p-2",
      margin: "mt-1",
    }}
  >
    {props.keyComponent}
    <div className="flex w-full sm:w-6/12">
      <Cell
        styling={{
          width: "w-full",
          flexAlign: "justify-between",
          display: "flex",
        }}
      >
        {props.caretComponent}
        {props.clearanceDateComponent}
        <div className="w-3/12">{props.descriptionComponent}</div>
        <div className="w-3/12 text-right">
          {props.transactionAmountComponent}
        </div>
        <div className="w-3/12 text-right">{props.balanceCompnent}</div>
      </Cell>
    </div>
    {props.children}
  </StripedRow>
);

export { TransactionContainer };
