import { AccountManage, AccountShow, AccountSummary } from "@/types/account";

type TAccount =  AccountManage | AccountShow | AccountSummary

const sortByPriority = (account1: TAccount, account2: TAccount) => {
  return  account1.priority - account2.priority
}

export { sortByPriority }
