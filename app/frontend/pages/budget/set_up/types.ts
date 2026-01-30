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

type HookProps = ComponentProps & {
  putCategory: (slug?: string) => void;
  changePreviousCategory: () => void;
  changePreviousUnreviewedCategory: () => void;
  changeNextCategory: () => void;
  changeNextUnreviewedCategory: () => void;
  processing: boolean;
  removeEvent: (p: { slug: string; key: string }) => void;
  updateEvents: (events: Array<{ key: string; amount: string }>) => void;
};

type ComponentProps = {
  groups: {
    revenues: TCategoryGroup;
    monthlyExpenses: TCategoryGroup;
    dayToDayExpenses: TCategoryGroup;
  };
  budgetCategory: BudgetCategory & { events: Array<SetupEvent> };
  metadata: {
    budgetTotal: number;
    isSubmittable: boolean;
    nextCategorySlug: string;
    nextUnreviewedCategorySlug: string;
    previousCategorySlug: string;
    previousUnreviewedCategorySlug: string;
    previousMonth: number;
    previousYear: number;
    month: number;
    year: number;
  };
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
  ComponentProps,
  HookProps,
  SetupEvent,
  SetupCategory,
  TCategoryGroup,
  TCategoryListItem,
  TGroupScopes,
  TEventFlags,
};
