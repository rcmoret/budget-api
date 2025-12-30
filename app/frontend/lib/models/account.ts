import { AccountManage, AccountShow, AccountSummary } from "@/types/account";

type TSimpleAccount = {
  key: string;
  name: string;
  slug: string;
  priority: number;
  balance: number;
}

type TAccount =  AccountManage | AccountShow | AccountSummary | TSimpleAccount

const sortByPriority = (account1: TAccount, account2: TAccount) => {
  return  account1.priority - account2.priority
}

export { sortByPriority, TSimpleAccount }
