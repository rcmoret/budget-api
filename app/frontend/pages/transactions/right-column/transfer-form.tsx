import { useForm } from "@inertiajs/react";
import { ThemedSelect } from "@/components/themed-select";
import { CloseButton } from "@/components/close-button";
import { Collapse } from "@/components/collapse";
import { getAccountLinks } from "@/layout/account-navigation-store";
import { getFeaturedAccount } from "../store";
import { getRedirectQueryParams } from "@/lib/app-stores/app-config-store";
import { amountStringValidator, decimalToInt } from "@/lib/money-formatter";

type AccountOption = { label: string; value: string };

// Every other account the transfer could go to — the account this page is
// scoped to isn't a valid target for its own transfer.
const useTransferAccountOptions = (): Array<AccountOption> => {
  const accounts = getAccountLinks();
  const { key: currentKey } = getFeaturedAccount();

  return accounts
    .filter(({ key }) => key !== currentKey)
    .map(({ key, name }) => ({ label: name, value: key }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

type TransferFormBody = {
  toAccountKey: string | null;
  amount: string;
};

const initialBody: TransferFormBody = { toAccountKey: null, amount: "" };

const TransferForm = () => {
  const { key: fromAccountKey } = getFeaturedAccount();
  const options = useTransferAccountOptions();
  const { data, setData, post, processing, transform, reset } =
    useForm<TransferFormBody>(initialBody);

  const isOpen = !!data.toAccountKey;
  const isSubmittable = isOpen && amountStringValidator(data.amount);
  const selected =
    options.find(({ value }) => value === data.toAccountKey) ?? null;

  transform(() => ({
    transfer: {
      fromAccountKey,
      toAccountKey: data.toAccountKey,
      amount: decimalToInt(data.amount ?? ""),
    },
  }));

  const redirectParams = getRedirectQueryParams();

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!isSubmittable || processing) return;

    post(`/accounts/transfer?${redirectParams}`, { onSuccess: () => reset() });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
        <ThemedSelect
          inputId="transfer-to-account"
          aria-label="Transfer to account"
          placeholder="Transfer to..."
          options={options}
          value={selected}
          isClearable={false}
          onChange={(option) => setData("toAccountKey", option?.value ?? null)}
        />
        <CloseButton
          onClick={() => reset()}
          ariaLabel="Cancel transfer"
          title="Cancel transfer"
          disabled={!isOpen}
        />
      </div>
      <Collapse open={isOpen} fade>
        <div className="grid gap-2 pt-2">
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
            <label htmlFor="transfer-amount">Amount</label>
            <input
              id="transfer-amount"
              type="text"
              value={data.amount}
              onChange={(ev) => setData("amount", ev.target.value)}
              className="input input-xs input-secondary text-right w-32"
            />
          </div>
          <button
            type="submit"
            disabled={!isSubmittable || processing}
            className="btn btn-sm btn-success text-success-content w-full"
          >
            Transfer
          </button>
        </div>
      </Collapse>
    </form>
  );
};

export { TransferForm };
