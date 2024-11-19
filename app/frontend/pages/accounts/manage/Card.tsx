import { Point } from "@/components/common/Symbol";
import { AccountManage } from "@/types/account";
import { Button } from "@/components/common/Button";
import { AccountForm } from "@/pages/accounts/manage/Form";
import { Icon } from "@/components/common/Icon";
import { useForm } from "@inertiajs/react";
import { SubmitButton } from "@/components/common/Button";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";

const ArchivedAtComponent = ({ account }: { account: AccountManage; }) => {
  if (!account.isArchived) { return null }

  const { put, processing } = useForm({
    account: { archivedAt: null }
  })

  const onSubmit = () => {
    const formUrl = UrlBuilder({
      key: account.key, name: "AccountShow",
      queryParams: buildQueryParams(["accounts", "manage"])
    })
    put(formUrl)
  }

  return (
    <>
      <div className="w-4/12 text-sm">
        archived:
      </div>
      <div className="w-7/12 text-sm italic text-right">
        {account.archivedAt}
      </div>
      <form>
        <SubmitButton
          onSubmit={onSubmit}
          styling={{ color: "text-green-800" }}
          isEnabled={!processing}
        >
          <Icon name="angle-double-right" />
        </SubmitButton>
      </form>
    </>
  )
}

const ArchiveButton = (props: { account: AccountManage }) => {
  const { put, processing } = useForm({
    category: { archivedAt: new Date() }
  })

  const onSubmit = () => {
    const formUrl = UrlBuilder({
      key: props.account.key, name: "AccountShow",
      queryParams: buildQueryParams(["accounts", "manage"])
    })
    put(formUrl)
  }


  return (
    <form>
      <SubmitButton
        onSubmit={onSubmit}
        styling={{ color: "text-red-700" }}
        isEnabled={!processing}
      >
        <Icon name="trash" />
      </SubmitButton>
    </form>
  )
}

const AccountCard = (props: {
  account: AccountManage,
  showForm: () => void;
}) => {
  const { account, showForm } = props

  return (
    <div className="w-72 border-b border-gray700 flex flex-row flex-wrap justify-between pb-2">
      <div className="hidden">{account.key}</div>
      <div className="w-7/12 text-lg">
        <Point>
          {account.name}
        </Point>
      </div>
      <div className="w-5/12 text-right text-blue-400">
        <Button
          type="button"
          onClick={showForm}
        >
          <Icon name="edit" />
        </Button>
        {!account.isArchived && <ArchiveButton account={account} />}
      </div>
      <div className="w-full text-sm">
        {!!account.isCashFlow ? "cash-flow" : "budget-exempt"}
      </div>
      <div className="w-4/12 text-sm">
        created:
      </div>
      <div className="w-7/12 text-sm italic text-right">
        {account.createdAt}
      </div>
      <ArchivedAtComponent account={account} />
    </div>
  )
}

const AccountCardWrapper = (props: {
  account: AccountManage;
  isFormShown: boolean;
  setShowFormFor: (key: string | null) => void;
}) => {
  const { account, isFormShown, setShowFormFor } = props
  if (isFormShown) {
    return (
      <AccountForm
        account={account}
        closeForm={() => setShowFormFor(null)}
      />
    )
  } else {
    return (
      <AccountCard
        key={account.key}
        account={account}
        showForm={() => setShowFormFor(account.key)}
      />
    )
  }
}

export { AccountCardWrapper }
