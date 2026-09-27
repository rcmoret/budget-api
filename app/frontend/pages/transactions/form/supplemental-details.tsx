import { useMemo } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ThemedSelect } from "@/components/themed-select";
import { getAccountLinks } from "@/layout/account-navigation-store";
import { useTransactionContext } from "../context-provider";
import { getFeaturedAccount } from "../store";
import { useTransactionFormContent } from "./context-provider";
import { Section } from "./section";

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
    <div className="grid form-field-row">
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
    <div className="grid form-field-row">
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

const Notes = () => {
  const { notes, setNotes } = useTransactionFormContent();

  return (
    <div className="grid form-field-row">
      <label htmlFor="transaction-notes">Notes</label>
      <RichTextEditor
        id="transaction-notes"
        value={notes}
        onChange={setNotes}
      />
    </div>
  );
};

const SupplementalFormDetails = () => {
  const { isCashFlow } = getFeaturedAccount();
  // A new transaction is a nested resource under the account page it's
  // created from — its account is implied, not a choice, so there's nothing
  // to select.
  const { isNew } = useTransactionContext();

  return (
    <Section sectionKey="supplemental">
      {isCashFlow && <CheckNumber />}
      <Notes />
      {isNew ? null : <AccountSelect />}
    </Section>
  );
};

export { SupplementalFormDetails };
