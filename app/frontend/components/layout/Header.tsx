import React from "react";

import { InertiaLink } from "@inertiajs/inertia-react";

import { Cell, Row } from "@/components/common";

export const Header = ({ namespace }: { namespace: string }) => {
  const bgColor = "bg-gradient-to-b from-gray-200 to-gray-100";
  const selectedBgColor = "bg-gradient-to-b from-green-400 to-green-300";
  const accountsBgColor = namespace === "accounts" ? selectedBgColor : bgColor;
  const budgetBgColor = namespace === "budget" ? selectedBgColor : bgColor;
  const selectedAccountPath = "";

  return (
    <Row
      styling={{
        backgroundColor: "bg-blue-900",
        padding: "p-1",
        margin: "mb-1",
      }}
    >
      <Cell
        styling={{
          width: "w-6/12",
          fontSize: "text-3xl",
          textAlign: "text-center",
          padding: "p-1",
        }}
      >
        <div className="w-full">
          <InertiaLink href={`/accounts/${selectedAccountPath}`}>
            <div className={`w-full ${accountsBgColor} rounded pt-4 pb-4`}>
              <h2>Accounts</h2>
            </div>
          </InertiaLink>
        </div>
      </Cell>
      <Cell
        styling={{
          width: "w-6/12",
          fontSize: "text-3xl",
          textAlign: "text-center",
          padding: "p-1",
        }}
      >
        <div className="w-full">
          <InertiaLink href={`/accounts/${selectedAccountPath}`}>
            <div className={`w-full ${budgetBgColor} rounded pt-4 pb-4`}>
              <h2>Budget</h2>
            </div>
          </InertiaLink>
        </div>
      </Cell>
    </Row>
  );
};
