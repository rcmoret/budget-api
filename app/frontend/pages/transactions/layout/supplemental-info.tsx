import { KeyIdentifier } from "@/components/key-identifier";
import { useTransactionContext } from "../context-provider";
import { Pill } from "@/components/pill";
import { ReactNode, useCallback, useState } from "react";
import { NotificationKind } from "@/lib/app-stores/notification-store";
import { ReceiptDrawer } from "./receipt-drawer";

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
  <LocalPill themeOption="notice">Budget Exclusion</LocalPill>
);

// Only on transactions with an attached receipt; opens it in a bottom sheet.
const ReceiptPill = (props: {
  contentType: null | string;
  filename: null | string;
  url: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        className="max-w-42 text-center cursor-pointer"
        aria-label="View receipt"
        onClick={() => setIsOpen(true)}
      >
        <Pill themeOption="alert">Receipt</Pill>
      </button>
      {isOpen && (
        <ReceiptDrawer
          contentType={props.contentType}
          filename={props.filename}
          onClose={close}
          url={props.url}
        />
      )}
    </>
  );
};

const SupplementalInfo = () => {
  const { transaction, isNew } = useTransactionContext();
  const {
    key,
    isBudgetExclusion,
    receiptContentType,
    receiptFilename,
    receiptUrl,
    transferKey,
  } = transaction;

  // A new transaction has no key yet, and the form's own Save/Close row
  // already covers collapsing it back down.
  if (key === "initial" || isNew) return null;

  return (
    <div className="col-span-full grid gap-1">
      {!!isBudgetExclusion && <BudgetExcluionPill />}
      {!!transferKey && <TransferPill />}
      {!!receiptUrl && (
        <ReceiptPill
          contentType={receiptContentType ?? null}
          filename={receiptFilename ?? null}
          url={receiptUrl}
        />
      )}
      <KeyIdentifier identifier={key} />
    </div>
  );
};

export { SupplementalInfo };
