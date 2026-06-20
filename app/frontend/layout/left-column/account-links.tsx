import { AmountSpan } from "@/components/amount-span";
import { getAccounts } from "@/pages/transactions/store";
import { AccountProps } from "@/types/account";
import { Link } from "@inertiajs/react";

const Symbol = () => (
  <div className="inline-block -translate-y-0.5">
    &#9900;
  </div>
)

const AccountLink = (props: { account: AccountProps }) => {
  const { account } = props
  const linkClassName = [
    "flex",
    "w-full",
    "justify-between",
    "p-2",
    "cursor-pointer",
    "border-neutral",
    "hover:bg-[#61a078]",
    "not-last:border-b"
  ].join(" ")

  return (
    <Link href={account.href} className={linkClassName}>
      <div>
        <Symbol /> {account.name}
      </div>
      <div>
        <AmountSpan amount={account.balance} />
      </div>
    </Link>
  )
}

const AccountLinks = () => {
  const accounts = getAccounts()
  const dropDownClassName = [
    "dropdown-content",
    "menu",
    "mt-0",
    "w-full",
    "z-1",
  ].join(" ")

  return (
    <div tabIndex={-1} className={dropDownClassName}>
      <div className="overflow-hidden mx-1 rounded text-secondary-content bg-secondary text-sm">
        {accounts.map((a) => (
          <AccountLink key={a.objectKey} account={a} />
        ))}
      </div>
    </div>
  )
}

export { AccountLinks }
