import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/cta";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ThemedSelect } from "@/components/themed-select";
import { getAccountLinks } from "@/layout/account-navigation-store";
import { useTransactionContext } from "../context-provider";
import { getFeaturedAccount } from "../store";
import { useTransactionFormContent } from "./context-provider";

type AccountOption = { label: string; value: string };

// The accounts behind the nav links: already scoped to the current user and
// already filtered to the active ones, which is exactly the set a transaction
// may be moved to. They arrive ordered by priority — right for the nav, but a
// select is scanned for a name, so this is the one place that sorts by it.
const useAccountOptions = (): Array<AccountOption> => {
  const accounts = getAccountLinks();

  return useMemo(
    () =>
      accounts
        .map(({ key, name }) => ({ label: name, value: key }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [accounts],
  );
};

const AccountSelect = () => {
  const { accountKey, setAccountKey } = useTransactionFormContent();
  const options = useAccountOptions();
  const selected = options.find(({ value }) => value === accountKey) ?? null;

  return (
    <div>
      <label htmlFor="transaction-account">Account</label>
      <ThemedSelect
        inputId="transaction-account"
        options={options}
        value={selected}
        // Non-clearable: a transaction has to belong to some account, and the
        // backend reads a blank `account_key` as "leave it alone" rather than as
        // an instruction.
        isClearable={false}
        onChange={(option) => option && setAccountKey(option.value)}
      />
    </div>
  );
};

const CheckNumber = () => {
  const { checkNumber, setCheckNumber } = useTransactionFormContent();

  return (
    <div>
      <label htmlFor="transaction-check-number">Check Number</label>
      <input
        id="transaction-check-number"
        type="text"
        value={checkNumber}
        onChange={(ev) => setCheckNumber(ev.target.value)}
        className="input input-xs input-secondary w-full"
      />
    </div>
  );
};

const BudgetExclusion = () => {
  const { budgetExclusion, toggleBudgetExclusion } =
    useTransactionFormContent();

  return (
    <div className="flex justify-between items-center">
      <label htmlFor="budget-exclusion">Budget Exclusion?</label>
      <input
        id="budget-exclusion"
        type="checkbox"
        checked={budgetExclusion}
        onChange={toggleBudgetExclusion}
        className="checkbox checkbox-xs checkbox-secondary justify-self-start"
      />
    </div>
  );
};

const Notes = () => {
  const { notes, setNotes } = useTransactionFormContent();

  return (
    <div>
      <label htmlFor="transaction-notes">Notes</label>
      <RichTextEditor id="transaction-notes" value={notes} onChange={setNotes} />
    </div>
  );
};

// Mirrors the `receipt` validations on Transaction::Entry — the same content
// types, the same ceiling, and the same wording, so a file the server would
// reject never gets as far as a request. The model stays the authority; this is
// only here to fail fast. Note there is no `image/jpg`: browsers report a .jpg
// as image/jpeg, and the model doesn't accept anything else either.
const ACCEPTED_CONTENT_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024;

const rejectionReason = (file: File): null | string => {
  if (!ACCEPTED_CONTENT_TYPES.includes(file.type)) {
    return "Must be a PNG, JPG, or PDF file";
  }
  if (file.size > MAX_BYTES) return "Must be less than 10MB";

  return null;
};

// An object URL rather than a FileReader data URL: the browser hands it back
// synchronously and nothing has to be read into memory. It does have to be
// revoked, hence the effect over a plain derived value.
const useImagePreviewUrl = (file: null | File): null | string => {
  const [url, setUrl] = useState<null | string>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};

const previewClassName = "max-w-32 max-h-32 rounded border border-secondary";

const ReceiptUpload = () => {
  const { receipt, setReceipt } = useTransactionFormContent();
  const { transaction } = useTransactionContext();
  const [rejection, setRejection] = useState<null | string>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useImagePreviewUrl(receipt);

  // A freshly picked file replaces whatever is attached on save, so the two are
  // never shown at once — clearing the pick brings the attached one back.
  const { receiptUrl, receiptFilename, receiptContentType } = transaction;
  const attached = receipt ? null : receiptUrl;

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const reason = rejectionReason(file);
    setRejection(reason);
    if (reason) {
      // Dropped from the input as well as from the form state, so the control
      // never reads back a filename the form isn't holding.
      ev.target.value = "";
      return;
    }

    setReceipt(file);
  };

  const clearReceipt = () => {
    setReceipt(null);
    setRejection(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid gap-2 justify-items-start">
      <div className="grid grid-cols-[auto_auto] items-center">
        <div className="flex gap-2">
          <label htmlFor="transaction-receipt">Receipt</label>
          <IconButton
            onClick={() => inputRef.current?.click()}
            title={receipt || attached ? "replace receipt" : "attach a receipt"}
          >
            <Icon name="paperclip" />
          </IconButton>
        </div>
        {receipt ? (
          <>
            <span className="text-xs">{receipt.name}</span>
            <button
              type="button"
              aria-label="remove receipt"
              title="remove receipt"
              className="round-cta cta-sm cancel-cta"
              onClick={clearReceipt}
            >
              &#x2718;
            </button>
          </>
        ) : null}
        {/* Already attached, so it has a URL of its own — worth linking, and
              there's no removing it from here: purging runs through the
              transaction's own DELETE .../receipt route. */}
        {attached ? (
          <a
            href={receiptUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="link link-secondary text-xs"
          >
            {receiptFilename}
          </a>
        ) : null}
      </div>
      <div>
        {rejection ? (
          <span className="text-error text-xs">{rejection}</span>
        ) : null}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Receipt preview"
            className={previewClassName}
          />
        ) : null}
        {attached && receiptContentType?.startsWith("image/") ? (
          <img
            src={receiptUrl ?? undefined}
            alt="Current receipt"
            className={previewClassName}
          />
        ) : null}
        <input
          ref={inputRef}
          id="transaction-receipt"
          type="file"
          accept={ACCEPTED_CONTENT_TYPES.join(",")}
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

// A fragment, not a wrapping element: each of these is a row of the form's grid,
// so they have to stay direct children of the <form> for its row gap to space
// them apart. Boxing them up puts both of them in the *one* row the wrapper
// occupies — which is what `grid-rows-subgrid` was stacking them into.
const SupplementalFormDetails = () => {
  const { isCashFlow } = getFeaturedAccount();
  // A new transaction is a nested resource under the account page it's
  // created from — its account is implied, not a choice, so there's nothing
  // to select.
  const { isNew } = useTransactionContext();

  return (
    <>
      <div className="grid grid-rows-subgrid grid-cols-subgrid col-span-2 items-start">
        {isNew ? null : <AccountSelect />}
        <Notes />
      </div>
      <div className="grid grid-rows-subgrid grid-cols-subgrid col-span-2 items-start">
        <ReceiptUpload />
        {isCashFlow ? <CheckNumber /> : <BudgetExclusion />}
      </div>
    </>
  );
};

export { SupplementalFormDetails };
