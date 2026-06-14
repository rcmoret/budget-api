import { MonetaryAmount } from "@/types/amount";

type BudgetItemCreateEventType =
  "item_create" |
  "pre_setup_item_create" |
  "rollover_extra_target_create" |
  "rollover_item_create" |
  "setup_item_create"

type BudgetItemEventType = BudgetItemCreateEventType

type BudgetItemEvent<T = BudgetItemEventType> = {
  budgetCategoryKey: string;
  name: string;
  slug: string;
  amount: MonetaryAmount;
  budgetItemKey: string;
  eventType: T;
  key: string;
  data: any;
}

export {
  type BudgetItemCreateEventType,
  type BudgetItemEvent
}
