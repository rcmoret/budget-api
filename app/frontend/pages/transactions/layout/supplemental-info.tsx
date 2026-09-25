import { KeyIdentifier } from "@/components/key-identifier";
import { useTransactionContext } from "../context-provider";
import { Pill } from "@/components/pill";
import { ReactNode } from "react";

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
      <KeyIdentifier identifier={key} />
    </div>
  );
};

export { SupplementalInfo };
