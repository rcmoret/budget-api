import React from "react";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";

interface ContainerProps {
  keyComponent: React.ReactNode;
  clearanceDateComponent: React.ReactNode;
  descriptionComponent: React.ReactNode | string;
  transactionAmountComponent: React.ReactNode;
  balanceCompnent: React.ReactNode | null;
  index: number;
  children?: React.ReactNode;
}

const TransactionContainer = (props: ContainerProps) => {
  const isEven = props.index % 2 === 0

  const bgColor = isEven ? "bg-sky-50" : "bg-sky-100"

  return (
    <Row
      styling={{
        backgroundColor: bgColor,
        flexAlign: "justify-start",
        flexWrap: "flex-wrap",
        padding: "px-4 py-2",
      }}
    >
      {props.keyComponent}
      <div className="flex w-full md:w-6/12">
        <Cell
          styling={{
            width: "w-full",
            flexAlign: "justify-between",
            display: "flex",
          }}
        >
          {props.clearanceDateComponent}
          <div className="w-4/12">{props.descriptionComponent}</div>
          <div className="w-4/12 flex flex-row justify-end gap-12 text-right">
            <div className="w-1/2">{props.transactionAmountComponent}</div>
            <div className="w-1/2">{props.balanceCompnent}</div>
          </div>
        </Cell>
      </div>
      {props.children}
    </Row>
  )
};

export { TransactionContainer };
