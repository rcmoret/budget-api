import { useState, createContext, useContext } from "react";
import { useAppConfigContext } from "@/components/layout/Provider";
import {
  BudgetItem,
  DiscretionaryData,
  SelectBudgetCategory,
} from "@/types/budget";
import { DraftChange, MergedItem } from "@/lib/hooks/useDraftEvents";
import { DraftItem } from ".";
import { byName } from "@/lib/sort_functions";

type TFilterScopes =
  | "expenses"
  | "revenues"
  | "monthly"
  | "weekly"
  | "cleared"
  | "pending";

type TItemCollection = {
  items: BudgetItem[];
  name: TFilterScopes;
  count: number;
  hidden: {
    accruals: number;
    deleted: number;
  };
};

const sortedItems = (props: {
  items: BudgetItem[];
  isHiddenAccrual: (item: BudgetItem) => boolean;
  isHiddenDeleted: (item: BudgetItem) => boolean;
}) => {
  const isMonthly = (i: BudgetItem) => i.isMonthly;
  const isWeekly = (i: BudgetItem) => !i.isMonthly;
  const isExpense = (i: BudgetItem) => i.isExpense;
  const isRevenue = (i: BudgetItem) => !i.isExpense;

  const { items } = props;

  type Tfilter = {
    name: TFilterScopes;
    filter: (i: BudgetItem) => boolean;
  };

  const defCollection = (p: {
    items: BudgetItem[];
    scope: Tfilter;
  }): TItemCollection => {
    const items = p.items.filter(p.scope.filter);

    return {
      items: items.sort(byName),
      name: p.scope.name,
      count: items.length,
      hidden: {
        accruals: items.filter(props.isHiddenAccrual).length,
        deleted: items.filter(props.isHiddenDeleted).length,
      },
    };
  };

  const weeklyItems = defCollection({
    items,
    scope: { name: "weekly", filter: isWeekly },
  });
  const monthlyItems = defCollection({
    items,
    scope: { name: "monthly", filter: isMonthly },
  });
  const clearedMonthly = defCollection({
    items: monthlyItems.items,
    scope: { name: "cleared", filter: (i) => !!i.transactionDetails.length },
  });
  const pendingMonthly = defCollection({
    items: monthlyItems.items,
    scope: { name: "pending", filter: (i) => !i.transactionDetails.length },
  });

  return {
    monthly: {
      ...monthlyItems,
      cleared: {
        ...clearedMonthly,
        expenses: defCollection({
          items: clearedMonthly.items,
          scope: { name: "expenses", filter: isExpense },
        }),
        revenues: defCollection({
          items: clearedMonthly.items,
          scope: { name: "revenues", filter: isRevenue },
        }),
      },
      pending: {
        ...pendingMonthly,
        expenses: defCollection({
          items: pendingMonthly.items,
          scope: { name: "expenses", filter: isExpense },
        }),
        revenues: defCollection({
          items: pendingMonthly.items,
          scope: { name: "revenues", filter: isRevenue },
        }),
      },
    },
    weekly: {
      ...weeklyItems,
      expenses: defCollection({
        items: weeklyItems.items,
        scope: { name: "weekly", filter: isExpense },
      }),
      revenues: defCollection({
        items: weeklyItems.items,
        scope: { name: "weekly", filter: isRevenue },
      }),
    },
  };
};

type HookProps = {
  categories: SelectBudgetCategory[];
  discretionary: DiscretionaryData;
  items: BudgetItem[];
  form: {
    addChange: (change: DraftChange) => void;
    changes: DraftChange[];
    discretionary?: { amount: number; overUnderBudget: number };
    draftItems: DraftItem[];
    items: MergedItem[];
    newItems: DraftItem[];
    post: () => void;
    processing: boolean;
    removeChange: (k: string) => void;
    updateChange: (a: string, b: string) => void;
    updateChangeV2: (p: {
      key: string;
      amount?: string;
      adjustment?: string;
    }) => void;
  };
};

type TBudgetDashboardContext = {
  monthly: {
    categories: SelectBudgetCategory[];
    newItems: DraftItem[];
  };
  weekly: {
    categories: SelectBudgetCategory[];
    newItems: DraftItem[];
  };
  discretionary: DiscretionaryData;
  isHiddenAccrual: (i: BudgetItem) => boolean;
  isHiddenDeleted: (i: BudgetItem) => boolean;
  itemCollections: {
    monthly: TItemCollection & {
      cleared: TItemCollection & {
        expenses: TItemCollection;
        revenues: TItemCollection;
      };
      pending: TItemCollection & {
        expenses: TItemCollection;
        revenues: TItemCollection;
      };
    };
    weekly: TItemCollection & {
      expenses: TItemCollection;
      revenues: TItemCollection;
    };
  };
  itemFilter: {
    term: string;
    setTerm: (s: string) => void;
  };
  form: {
    addChange: (change: DraftChange) => void;
    changes: DraftChange[];
    discretionary?: { amount: number; overUnderBudget: number };
    draftItems: DraftItem[];
    items: MergedItem[];
    newItems: DraftItem[];
    post: () => void;
    processing: boolean;
    removeChange: (k: string) => void;
    updateChange: (a: string, b: string) => void;
    updateChangeV2: (p: {
      key: string;
      amount?: string;
      adjustment?: string;
    }) => void;
  };
};

const BudgetDashboardContext = createContext<TBudgetDashboardContext | null>(
  null,
);

const BudgetDashboardProvider = (
  props: HookProps & { children: React.ReactNode },
) => {
  const { appConfig } = useAppConfigContext();
  const { budget } = appConfig;
  const { data, showAccruals, showDeletedItems } = budget;
  const { children, categories, items, ...rest } = props;

  const monthly = {
    categories: categories.filter((category) => category.isMonthly),
    newItems: props.form.newItems.filter((item) => item.isMonthly),
  };
  const weekly = {
    categories: categories.filter((category) => !category.isMonthly),
    newItems: props.form.newItems.filter((item) => !item.isMonthly),
  };

  const isHiddenAccrual = (item: BudgetItem) => {
    if (!item.isAccrual || showAccruals) {
      return false;
    }

    return !(
      item.maturityMonth === data.month && item.maturityYear === data.year
    );
  };

  const isHiddenDeleted = (item: BudgetItem) =>
    item.isDeleted && !showDeletedItems;

  const [filterTerm, setFilterTerm] = useState<string>("");

  const applySearchTermFilter = (item: BudgetItem): boolean => {
    if (filterTerm.length < 3) {
      return true;
    }

    const expression = new RegExp(filterTerm, "i");

    return !!item.name.match(expression);
  };

  const itemFilter = {
    term: filterTerm,
    setTerm: setFilterTerm,
  };

  const value = {
    ...rest,
    itemCollections: sortedItems({
      items: items.filter(applySearchTermFilter),
      isHiddenAccrual,
      isHiddenDeleted,
    }),
    itemFilter,
    isHiddenAccrual,
    isHiddenDeleted,
    monthly,
    weekly,
  };

  return (
    <BudgetDashboardContext.Provider value={value}>
      {props.children}
    </BudgetDashboardContext.Provider>
  );
};

const useBudgetDashboardContext = () => {
  const context = useContext(BudgetDashboardContext);
  if (!context) {
    throw new Error(
      "useBudgetDashboardContext must be used within a Budget Dashboard Context Provider",
    );
  }
  return context;
};

export { TItemCollection, useBudgetDashboardContext, BudgetDashboardProvider };
