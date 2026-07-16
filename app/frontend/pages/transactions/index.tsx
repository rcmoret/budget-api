import { HeaderComponent, PageComponent } from "@frontend/layout";
import { TransactionDetailBudgetItem } from "@/types/transaction";
import { AccountProps, FeaturedAccountType } from "@/types/account";
import { BudgetMonthData } from "@/types/budget/month-data";
import { initBudgetMonthStore } from "../budget/month-store";
import { initNeighborLinksStore } from "../budget/neighbor-links-store";
import { getTransactions, initTransactionIndexStore } from "./store";
import { RightColumn } from "./right-column";
import { AccountTransactionCard, InitialBlance } from "./layout/card";
import { PageProps } from "@/types/page_props";
import { useNeighborLinksKeyBoardHandlers } from "@/utils/hooks/neighbors-keyboard-nav";
import { NeighborLinks } from "@/components/neighbor-links";
import { getBudgetMonth } from "@/pages/budget/month-store";
import { getNeighborLinks } from "@/pages/budget/neighbor-links-store";
import { getFeaturedAccount } from "./store";

const Symbol = () => {
  return <div className="inline-block -translate-y-1 text-base">&#9900;</div>;
};

const TransactionIndexHeader = () => {
  const budgetMonth = getBudgetMonth();
  const featuredAccount = getFeaturedAccount();
  const { previous, next } = getNeighborLinks();

  return (
    <HeaderComponent
      rightColumnComponent={
        <NeighborLinks previousMonth={previous} nextMonth={next} />
      }
    >
      {featuredAccount.name} <Symbol /> {budgetMonth.monthName}{" "}
      {budgetMonth.year}
    </HeaderComponent>
  );
};

type TransactionsIndexProps = PageProps & {
  accounts: Array<AccountProps>;
  budgetItems: Array<TransactionDetailBudgetItem>;
  budgetMonth: BudgetMonthData;
  featuredAccount: FeaturedAccountType;
};

const TransactionsIndexComponent = () => {
  const transactions = getTransactions();

  useNeighborLinksKeyBoardHandlers();

  return (
    <PageComponent
      mainId="account-transaction-container"
      rightColumn={<RightColumn />}
      header={<TransactionIndexHeader />}
    >
      <>
        {transactions.map((transaction) => (
          <AccountTransactionCard
            key={transaction.key}
            transaction={transaction}
          />
        ))}
        <InitialBlance />
      </>
    </PageComponent>
  );
};

const IndexComponent = (props: TransactionsIndexProps) => {
  const { budgetItems, accounts, budgetMonth } = props;
  const { transactions, ...featuredAccount } = props.featuredAccount;

  initTransactionIndexStore({
    accounts,
    budgetItems,
    featuredAccount,
    transactions: [...transactions].reverse(),
  });
  initBudgetMonthStore({ budgetMonth });
  initNeighborLinksStore({
    previous: {
      href: budgetMonth.previousMonth.href,
      label: budgetMonth.previousMonth.monthName,
    },
    next: {
      href: budgetMonth.nextMonth.href,
      label: budgetMonth.nextMonth.monthName,
    },
  });

  return <TransactionsIndexComponent />;
};

export default IndexComponent;
