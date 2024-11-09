import { AccountManage } from "@/types/account";
import { useState } from "react";
import { sortByPriority } from "@/lib/models/account";
import { AccountCardWrapper as AccountCard } from "@/pages/accounts/manage/Card";
import { AddNewComponent } from "./manage/Form";

const AccountsManageComponent = (props: { accounts: Array<AccountManage> }) => {
  const [showFormKey, setShowFormFor] = useState<string | null>(null)

  const accounts = props.accounts.sort(sortByPriority)

  return (
    <div className="w-full flex flex-col gap-4">
      <span className="text-2xl">
        Manage Accounts
      </span>
      <AddNewComponent
        setShowFormFor={setShowFormFor}
        isFormShown={showFormKey === "__new__"}
      />
      {accounts.map((account) => {
        return <AccountCard
          key={account.key}
          account={account}
          isFormShown={showFormKey === account.key}
          setShowFormFor={setShowFormFor}
        />
      })}
    </div>
  )
}

export default AccountsManageComponent
