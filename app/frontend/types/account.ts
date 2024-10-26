import { AccountBudgetSummary } from "@/types/budget";
import { AccountTransaction } from "@/types/transaction";

export interface AccountSummary {
  name: string;
  key: string;
  slug: string;
  balance: number;
  priority: number;
  isArchived: boolean;
}

// {"key"=>"0a29eb316bda",
// "name"=>"148th City Bank",
// "slug"=>"slug-146th",
// "priority"=>148,
// "balance"=>0,
// "balancePriorTo"=>0,
// "transactions"=>[],
// "isCashFlow"=>true,
// "isArchived"=>true,
// "archivedAt"=>"2023-05-14",
// "budget"=>{"items"=>[], "month"=>6, "year"=>2026, "daysRemaining"=>30, "totalDays"=>30, "firstDate"=>"2026-06-01", "lastDate"=>"2026-06-30", "isCurrent"=>false}}

export interface AccountShow {
  name: string;
  key: string;
  slug: string;
  balance: number;
  priority: number;
  isArchived: boolean;
  budget: AccountBudgetSummary;
  transactions: AccountTransaction[];
  balancePriorTo: number;
  metadata: {
    firstDate: string;
  }
}
