import { Point } from "@/components/common/Symbol";
import { AccountManage } from "@/types/account";
import { AccountForm } from "@/pages/accounts/manage/Form";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import {
  ActionSubmitButton,
  ActionButton,
} from "@/lib/theme/buttons/action-button";

const ArchivedAtComponent = ({ account }: { account: AccountManage }) => {
  if (!account.isArchived) {
    return null;
  }

  const { put, processing } = useForm({
    account: { archivedAt: null },
  });

  const onSubmit = () => {
    const formUrl = UrlBuilder({
      key: account.key,
      name: "AccountShow",
      queryParams: buildQueryParams(["accounts", "manage"]),
    });
    put(formUrl);
  };

  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="w-4/12 text-sm">archived:</div>
      <div className="w-8/12 text-sm italic text-right flex flex-row justify-end items-center gap-2">
        <div>{account.archivedAt}</div>
        <form>
          <ActionSubmitButton
            onSubmit={onSubmit}
            icon="angle-double-right"
            title={
              processing
                ? "Restoring account..."
                : `Restore ${account.name} from archive`
            }
            isEnabled={!processing}
            isBusy={processing}
          />
        </form>
      </div>
    </div>
  );
};

const ArchiveButton = (props: { account: AccountManage }) => {
  const { put, processing } = useForm({
    account: { archivedAt: new Date() },
  });

  const onSubmit = () => {
    const formUrl = UrlBuilder({
      key: props.account.key,
      name: "AccountShow",
      queryParams: buildQueryParams(["accounts", "manage"]),
    });
    put(formUrl);
  };

  return (
    <form>
      <ActionSubmitButton
        onSubmit={onSubmit}
        icon="trash"
        title={
          processing ? "Archiving account..." : `Archive ${props.account.name}`
        }
        isEnabled={!processing}
        isBusy={processing}
        color="red"
      />
    </form>
  );
};

const AccountCard = (props: {
  account: AccountManage;
  showForm: () => void;
}) => {
  const { account, showForm } = props;
  const accountHeadingId = `account-heading-${account.key}`;

  return (
    <article
      aria-labelledby={accountHeadingId}
      className="w-72 border-b border-gray700 flex flex-row flex-wrap justify-between pb-2"
    >
      <h3 id={accountHeadingId} className="text-lg">
        <Point>{account.name}</Point>
      </h3>
      <div
        className="text-right flex flex-row justify-end"
        role="group"
        aria-label={`Actions for ${account.name}`}
      >
        <ActionButton
          onClick={showForm}
          icon="edit"
          title={`Edit ${account.name}`}
        />
        {!account.isArchived && <ArchiveButton account={account} />}
      </div>
      <div className="w-full text-sm">
        {!!account.isCashFlow ? "cash-flow" : "budget-exempt"}
      </div>
      <dl className="w-full flex flex-row flex-wrap">
        <dt className="w-4/12 text-sm">created:</dt>
        <dd className="w-7/12 text-sm italic text-right">
          {account.createdAt}
        </dd>
      </dl>
      <ArchivedAtComponent account={account} />
    </article>
  );
};

const AccountCardWrapper = (props: {
  account: AccountManage;
  isFormShown: boolean;
  setShowFormFor: (key: string | null) => void;
}) => {
  const { account, isFormShown, setShowFormFor } = props;
  if (isFormShown) {
    return (
      <AccountForm account={account} closeForm={() => setShowFormFor(null)} />
    );
  } else {
    return (
      <AccountCard
        key={account.key}
        account={account}
        showForm={() => setShowFormFor(account.key)}
      />
    );
  }
};

export { AccountCardWrapper };
