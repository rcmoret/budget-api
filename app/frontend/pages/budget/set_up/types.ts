import { BudgetCategory } from "@/types/budget";
import { TInputAmount } from "@/components/common/AmountInput";

type TGroupScopes = "revenues" | "expenses" | "monthly" | "weekly";

type TEventFlags = {
  eqPrevBudgeted: boolean;
  eqPrevSpent: boolean;
  showDefaultSuggestion: boolean;
  unreviewed: boolean;
  hasDeleteIntent: boolean;
  isValid: boolean;
};

type TCategoryListItem = BudgetCategory & {
  events: Array<TEventFlags>;
  currentlyReviewing: boolean;
};

type TCategoryGroup = {
  label: string;
  name: string;
  categories: Array<TCategoryListItem>;
  scopes: Array<TGroupScopes>;
  metadata: {
    count: number;
    sum: number;
    unreviewed: number;
    isReviewed: number;
    isSelected: boolean;
  };
};

type SetupCategory = BudgetCategory & {
  events: Array<TEventFlags>;
};

type SetupEvent = {
  budgetItemKey: string;
  amount: number;
  updatedAmount: number;
  eventType: "setup_item_create" | "setup_item_adjust";
  spent: number;
  // data: string;
  adjustment: TInputAmount;
  previouslyBudgeted: number;
  flags: TEventFlags;
};

export type {
  SetupEvent,
  SetupCategory,
  TCategoryGroup,
  TCategoryListItem,
  TGroupScopes,
  TEventFlags,
};
