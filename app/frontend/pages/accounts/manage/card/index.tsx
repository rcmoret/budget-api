import { useAccountShowContext } from "../account-context-provider";
import { useAccountsManagerStore } from "@/pages/accounts/manage/store";

import { Form as AccountForm } from "../form";

import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
  ActiveItemCard,
  ArchivedAtRow,
  ArchivedItemCard,
  ArchiveIcon,
  CardLabel,
  CardRow,
  CloseFormButton,
  EditButton,
} from "@/components/card";
import { AmountSpan } from "@/components/amount-span";
import { KeyIdentifier } from "@/components/key-identifier";
import { getRedirectQueryParams } from "@/layout/app-config-store";

const AccountCardBottomRow = () => {
  const accountManageReturnQueryParams = getRedirectQueryParams();
  const { account } = useAccountShowContext();
  const { isArchived } = account;
  const handleArchive = () => {
    router.put(`/account/${account.key}?${accountManageReturnQueryParams}`, {
      account: { is_archived: true },
    });
  };

  if (isArchived) {
    return <ArchivedAtRow archivedAt={account.archivedAt} />;
  } else {
    return (
      <>
        <KeyIdentifier
          identifier={account.key}
          className="text-base-content/66"
        />
        <ArchiveIcon title="archive account" onClick={handleArchive} />
      </>
    );
  }
};

const Show = () => {
  const { account } = useAccountShowContext();
  const { isCashFlow, slug } = account;

  return (
    <>
      <CardRow>
        <div>Balance:</div>
        <div>
          <AmountSpan amount={account.balance} colorize="normal" />{" "}
        </div>
      </CardRow>
      <CardRow>
        <div>Account Type</div>
        <div>{isCashFlow ? "Cash Flow" : "Budget Exclusion"}</div>
      </CardRow>
      <CardRow>
        <div>Slug</div>
        <div>{slug}</div>
      </CardRow>
      <CardRow>
        <AccountCardBottomRow />
      </CardRow>
    </>
  );
};

const LabelLink = () => {
  const { account } = useAccountShowContext();
  return <Link href={account.href}>{account.name}</Link>;
};

const AccountCardLabel = () => {
  const { dragAttributes, dragListeners } = useAccountShowContext();
  return (
    <CardLabel
      label={<LabelLink />}
      dragAttributes={dragAttributes}
      dragListeners={dragListeners}
    >
      <AccountCardLabelButton />
    </CardLabel>
  );
};

const AccountCardLabelButton = () => {
  const { showForm, isFormShown } = useAccountShowContext();
  const onDismiss = useAccountsManagerStore((s) => s.onDismiss);

  if (isFormShown) {
    return <CloseFormButton onDismiss={onDismiss} />;
  } else {
    return <EditButton showForm={showForm} />;
  }
};

const AccountCard = () => {
  const { account } = useAccountShowContext();
  const { isArchived } = account;

  if (isArchived) {
    return <ArchivedAccountCard />;
  } else {
    return <ActiveAccountCard />;
  }
};

const ActiveAccountCard = () => {
  const { account } = useAccountShowContext();

  return (
    <ActiveItemCard
      label={<AccountCardLabel />}
      isFormShown={false}
      id={account.objectKey}
    >
      <InnerCardComponent />
    </ActiveItemCard>
  );
};

const InnerCardComponent = () => {
  const { isFormShown } = useAccountShowContext();

  if (isFormShown) {
    return <AccountForm />;
  } else {
    return <Show />;
  }
};

const ArchivedAccountCard = () => {
  const { account } = useAccountShowContext();
  const accountManageReturnQueryParams = getRedirectQueryParams();

  const onClick = () => {
    router.put(`/account/${account.key}?${accountManageReturnQueryParams}`, {
      account: { is_archived: false },
    });
  };

  return (
    <ArchivedItemCard
      name={account.name}
      onClick={onClick}
      title="unarchive account"
      itemKey={account.key}
      id={account.objectKey}
    >
      <Show />
    </ArchivedItemCard>
  );
};

export { AccountCard };
