import { KeyIdentifier } from "@/components/key-identifier";
import { useTransactionContext } from "../context-provider";
import { Pill } from "@/components/pill";
import { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@/components/icon";

import { NotificationKind } from "@/lib/app-stores/notification-store";

const LocalPill = (props: {
  themeOption: NotificationKind;
  children: ReactNode;
}) => {
  return (
    <div className="max-w-42 text-center">
      <Pill themeOption={props.themeOption}>{props.children}</Pill>
    </div>
  );
};

const TransferPill = () => <LocalPill themeOption="info">Transfer</LocalPill>;
const BudgetExcluionPill = () => (
  <LocalPill themeOption="warning">Budget Exclusion</LocalPill>
);

// One link per budget item; split details on the same item share a link
const BudgetItemLinks = () => {
  const { transaction } = useTransactionContext();

  const links = transaction.details.flatMap((detail) =>
    detail.budgetItemHref
      ? [{ href: detail.budgetItemHref, label: detail.budgetCategoryName }]
      : [],
  );
  const uniqueLinks = links.filter(
    (link, index) => links.findIndex((l) => l.href === link.href) === index,
  );

  if (!uniqueLinks.length) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {uniqueLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-1 text-primary underline"
        >
          {label}
          <Icon name="arrow-right" />
        </Link>
      ))}
    </div>
  );
};

const SupplementalInfo = () => {
  const { transaction, isNew } = useTransactionContext();
  const { key, isBudgetExclusion, transferKey } = transaction;

  // A new transaction has no key yet, and the form's own Save/Close row
  // already covers collapsing it back down.
  if (key === "initial" || isNew) return null;

  return (
    <div className="col-span-full grid gap-1">
      {!!isBudgetExclusion && <BudgetExcluionPill />}
      {!!transferKey && <TransferPill />}
      <BudgetItemLinks />
      <KeyIdentifier identifier={key} />
    </div>
  );
};

export { SupplementalInfo };
