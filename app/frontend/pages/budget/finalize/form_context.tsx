import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import {
  TExtraCreateEvent,
  TExtraCategoryCreateEvent,
} from "./extra_events_select";
import {
  useFinalizeEventsForm,
  FinalizeCategory,
} from "@/lib/hooks/useFinalizeEventsForm";
import { BudgetFinalizePageData } from "@/components/layout/Header";
import {
  UpdateCategoryProps,
  FinalizeFormCategory,
} from "@/lib/hooks/useFinalizeEventsForm";
import { byName } from "@/lib/sort_functions";

type HookProps = {
  categories: Array<FinalizeCategory>;
  target: BudgetFinalizePageData;
  data: BudgetFinalizePageData;
};

type TFinalizeFormContext = {
  allItemsReviewed: boolean;
  base: BudgetFinalizePageData;
  categories: FinalizeFormCategory[];
  extraAmount: number;
  extraCategoryOptions: TExtraCategoryCreateEvent[];
  extraEvent: TExtraCreateEvent | null;
  groups: Array<{
    label: string;
    collection: Array<FinalizeFormCategory>;
  }>;
  isSubmittable: boolean;
  setCategory: (props: UpdateCategoryProps & { key: string }) => void;
  setExtraEventKey: (key: string) => void;
  setNextReviewingCategoryKey: () => void;
  setPrevReviewingCategoryKey: () => void;
  setViewingCategoryKey: (s: string) => void;
  submitHandler: (ev: React.MouseEvent) => void;
  viewingCategoryKey: string;
};

const grouped = [
  {
    label: "Accruals",
    filter: (category: FinalizeFormCategory) => category.isAccrual,
  },
  {
    label: "Revenues",
    filter: (category: FinalizeFormCategory) =>
      !category.isAccrual && !category.isExpense,
  },
  {
    label: "Expenses",
    filter: (category: FinalizeFormCategory) =>
      !category.isAccrual && category.isExpense,
  },
];

const FinalizeFormContext = createContext<TFinalizeFormContext | null>(null);

const FinalizeFormProvider = (props: HookProps & { children: ReactNode }) => {
  const hookData = useFinalizeEventsForm({
    categories: props.categories,
    month: props.target.month,
    year: props.target.year,
  });

  const groups = useMemo(
    () =>
      grouped.map(({ label, filter }) => ({
        label,
        collection: hookData.categories.filter(filter).sort(byName),
      })),
    [hookData.categories],
  );

  const [viewingCategoryKey, setViewingCategoryKey] = useState<string>(
    groups.find((group) => !!group.collection.length)?.collection?.at(0)?.key ??
      "",
  );

  const keyList = groups.flatMap(({ collection }) => {
    return collection.map(({ key }) => key);
  });

  const indexAt = Math.max(keyList.indexOf(viewingCategoryKey), 0);

  useEffect(() => {
    if (!viewingCategoryKey) {
      return;
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        const category = groups
          .flatMap(({ collection }) => collection)
          .find((c) => c.key === viewingCategoryKey);

        if (!category) {
          return;
        }

        const item = category.items[0];

        if (!item) {
          return;
        }

        const attemptFocus = () => {
          if (item.amountInputRef?.current) {
            item.amountInputRef.current.focus();
            return true;
          }
          return false;
        };

        if (!attemptFocus()) {
          setTimeout(() => {
            if (!attemptFocus()) {
              setTimeout(attemptFocus, 100);
            }
          }, 50);
        }
      }, 0);
    });
  }, [viewingCategoryKey, groups]);

  const setPrevReviewingCategoryKey = () => {
    const prevKey =
      indexAt === 0 ? (keyList.at(-1) ?? "") : keyList[indexAt - 1];

    setViewingCategoryKey(prevKey);
  };

  const setNextReviewingCategoryKey = () => {
    const nextKey =
      keyList.length === indexAt + 1 ? keyList[0] : keyList[indexAt + 1];

    setViewingCategoryKey(nextKey);
  };

  const value: TFinalizeFormContext = {
    ...hookData,
    groups,
    viewingCategoryKey,
    setViewingCategoryKey,
    setPrevReviewingCategoryKey,
    setNextReviewingCategoryKey,
    base: props.data,
  };

  return (
    <FinalizeFormContext.Provider value={value}>
      {props.children}
    </FinalizeFormContext.Provider>
  );
};

const useFinalizeFormContext = () => {
  const context = useContext(FinalizeFormContext);
  if (!context) {
    throw new Error(
      "useFinalizeFormContext must be used within a Finalize Form Provider",
    );
  }
  return context;
};

export { useFinalizeFormContext, FinalizeFormProvider };
