import { MonetaryAmount } from "./amount";
import { AccountTransaction } from "@/types/transaction";

type AccountProps = {
  key: string;
  objectKey: string;
  archivedAt: string | null;
  balance: number;
  editRoute: string;
  isCashFlow: boolean;
  name: string;
  href: string;
  priority: number | null;
  slug: string;
};

type FeaturedAccountType = Pick<
  AccountProps,
  "key" | "name" | "slug" | "editRoute" | "isCashFlow"
> & {
  balancePriorTo: MonetaryAmount;
  transactions: Array<AccountTransaction>;
};

export { type AccountProps, type FeaturedAccountType };
