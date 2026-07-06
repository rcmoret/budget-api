import { MonetaryAmount } from "@/types/amount";

type TCategoryScope = "monthly" | "expenses" | "revenues" | "weekly";

type GroupNameType = "revenues" | "fixedExpenses" | "variableExpenses";

type GroupCollection<GenericGroup> = Record<GroupNameType, GenericGroup>;

type CategoryGroup<GenericCategory> = {
  label: string;
  name: string;
  key: string;
  scopes: Array<TCategoryScope>;
  categories: Array<GenericCategory>;
  metadata: {
    count: number;
    sum: MonetaryAmount;
    unreviewed: number;
    isReviewed: number;
    isSelected: boolean;
  };
};

type BudgetPlanningEvent<GenericEventNames, GenericFlag> = {
  eventType: GenericEventNames;
  amount: MonetaryAmount;
  budgetItemKey: string;
  updatedAmount: MonetaryAmount;
  previouslyBudgeted: MonetaryAmount;
  transactionsTotal: MonetaryAmount;
  adjustment: MonetaryAmount;
  flags: GenericFlag;
};

export type {
  BudgetPlanningEvent,
  GroupCollection as GenericGroupCollection,
  CategoryGroup as GenericGroup,
  TCategoryScope,
};
