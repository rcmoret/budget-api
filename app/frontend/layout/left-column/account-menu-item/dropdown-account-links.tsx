import { Link } from "@inertiajs/react";
import { AmountSpan } from "@/components/amount-span";
import { AccountLinkType } from "@/types/page_props";
import { getAccountLinks } from "@/layout/account-navigation-store";

const Symbol = () => (
  <div className="inline-block -translate-y-0.5">&#9900;</div>
);

const AccountLink = (props: { account: AccountLinkType }) => {
  const { account } = props;

  const linkClassName = [
    "grid",
    "grid-cols-[auto_1fr_auto]",
    "gap-1",
    "p-2",
    "cursor-pointer",
    "border-neutral",
    "hover:bg-[#61a078]",
    "not-last:border-b",
    "menu-item",
  ].join(" ");

  return (
    <Link href={account.href} title={account.name} className={linkClassName}>
      <div>
        <Symbol />
      </div>
      <div className="truncate"> {account.name}</div>
      <div>
        <AmountSpan amount={account.balance} />
      </div>
    </Link>
  );
};

const AccountLinks = () => {
  const accounts = getAccountLinks();

  return (
    <>
      {accounts.map((account) => (
        <AccountLink key={account.slug} account={account} />
      ))}
    </>
  );
};

export { AccountLinks as IndividualAccountLinks };
