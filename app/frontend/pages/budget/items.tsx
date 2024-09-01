import React from "react";

import { Cell } from "@/components/common/Cell";
import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { Discretionary } from "@/pages/budget/discretionary";
import { DiscretionaryData } from "@/types/budget";

const Items = (props: { data: DiscretionaryData }) => (
  <>
    <Column title="Day-to-Day">
      <Section title="Discretionary">
        <Discretionary data={props.data} />
      </Section>
    </Column>
    <Column title="Monthly">Items...</Column>
  </>
);

interface ColumnProps {
  title: string;
  children: React.ReactNode;
}

const Column = (props: ColumnProps) => (
  <Cell
    styling={{
      width: "w-full md:w-1/2",
      padding: "px-2",
    }}
  >
    <div className="w-full text-2xl p-2">{props.title}</div>
    {props.children}
  </Cell>
);

const Section = (props: { title: string; children: React.ReactNode }) => (
  <Row
    styling={{
      flexWrap: "flex-wrap",
    }}
  >
    <Row
      styling={{
        backgroundColor: "bg-gradient-to-r from-green-300 to-green-600",
        margin: "mb-1",
        fontWeight: "font-semibold",
        fontSize: "text-xl",
        rounded: "rounded",
        overflow: "overflow-hidden",
        padding: "pt-2 pb-2 pl-1 pr-1",
      }}
    >
      <Point>
        <span className="underline">{props.title}</span>
      </Point>
    </Row>
    {props.children}
  </Row>
);

export { Items };
