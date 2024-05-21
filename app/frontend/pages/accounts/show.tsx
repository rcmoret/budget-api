import React from "react";

import { AccountTabs } from "@/pages/accounts/tabs";
import { BudgetSummary as AccountBudgetSummary } from "@/components/budget_summary";
import { Transactions as AccountTransactions } from "@/pages/accounts/transactions";
import { MonthYearSelect, Row } from "@/components/common";
import { DateFormatter } from "@/lib/DateFormatter";

import { AccountSummary, AccountShow } from "@/types/account";

interface ComponentProps {
  accounts: AccountSummary[];
  selectedAccount: AccountShow;
}

const AccountShowComponent = (props: ComponentProps) => {
  const { accounts, selectedAccount } = props;
  const { budget, name } = selectedAccount;
  const baseUrl = `/accounts/${selectedAccount.slug}/transactions`;

  return (
    <>
      <AccountTabs accounts={accounts} selectedAccount={selectedAccount} />
      <AccountBudgetSummary
        budget={selectedAccount.budget}
        baseUrl={baseUrl}
        titleComponent={
          <BudgetSummaryTitle
            month={budget.month}
            year={budget.year}
            accountName={name}
          />
        }
      >
        <MonthYearSelect
          baseUrl={baseUrl}
          month={budget.month}
          year={budget.year}
        />
      </AccountBudgetSummary>
      <AccountTransactions
        initialBalance={selectedAccount.balancePriorTo}
        transactions={selectedAccount.transactions}
        budget={budget}
      />
      <Row
        styling={{
          margin: "p-2 mt-12",
          backgroundColor: "bg-gradient-to-t from-blue-400 to-white",
          flexAlign: "justify-end",
          fontSize: "text-xl",
        }}
      >
        <div className="py-4 underline">Manage Accounts</div>
      </Row>
    </>
  );
};

interface TitleProps {
  accountName: string;
  month: number;
  year: number;
}

const BudgetSummaryTitle = (props: TitleProps) => (
  <span>
    <span className="underline">{props.accountName}</span>{" "}
    {DateFormatter({
      month: props.month,
      year: props.year,
      format: "monthYear",
    })}
  </span>
);

export default AccountShowComponent;
