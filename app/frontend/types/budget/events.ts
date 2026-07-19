import { MonetaryAmount } from "@/types/amount";

type BudgetItemCreateEventType =
  | "item_create"
  | "pre_setup_item_create"
  | "rollover_extra_target_create"
  | "rollover_item_create"
  | "setup_item_create";

type BudgetItemEventType = BudgetItemCreateEventType;

type BudgetItemEvent<T = BudgetItemEventType> = {
  amount: MonetaryAmount;
  budgetCategoryKey: string;
  budgetItemKey: string;
  data: any;
  eventType: T;
  key: string;
  name: string;
  objectKey: string;
  slug: string;
};

export { type BudgetItemCreateEventType, type BudgetItemEvent };
