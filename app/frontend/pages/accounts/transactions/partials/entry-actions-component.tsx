import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { useAppConfigContext } from "@/components/layout/Provider";
import { useForm } from "@inertiajs/react";
import { useTransactionContext } from "@/pages/accounts/transactions/context-provider";

const DeleteIcon = () => {
  const { transaction } = useTransactionContext();
  const { key, accountSlug } = transaction;
  const { delete: destroy } = useForm({});
  const {
    appConfig: {
      budget: {
        data: { month, year },
      },
    },
  } = useAppConfigContext();

  const onClick = () => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    const formUrl = UrlBuilder({
      name: "TransactionShow",
      key: key,
      accountSlug: accountSlug,
      queryParams: buildQueryParams([
        "account",
        accountSlug,
        "transactions",
        month,
        year,
      ]),
    });
    destroy(formUrl);
  };

  return (
    <div className="mr-2">
      <Button
        type="button"
        onClick={onClick}
        styling={{ color: "text-blue-300" }}
      >
        <Icon name="trash" />
      </Button>
    </div>
  );
};

const EntryActionsComponent = () => {
  const { showForm } = useTransactionContext();
  return (
    <div className="w-full flex flex-row-reverse">
      <DeleteIcon />
      <Button
        type="button"
        onClick={showForm}
        styling={{ color: "text-blue-300" }}
      >
        <div className="mr-2">
          <Icon name="edit" />
        </div>
      </Button>
    </div>
  );
};

export { EntryActionsComponent };
