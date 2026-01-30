import { BudgetCategory } from "@/types/budget";
import { TInputAmount } from "@/components/common/AmountInput";
import { LeftColumn } from "@/pages/budget/set_up/left_column";
import { RightColumn } from "@/pages/budget/set_up/right_column";
import { KeyboardNav } from "./keyboard_nav";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { createContext, useContext, useEffect, useRef } from "react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { useToggle } from "@/lib/hooks/useToogle";

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

const useSetUpEventsForm = (props: ComponentProps): HookProps => {
  const { delete: deleteRequest, processing, setData } = useForm();

  const selectedGroup = Object.values(props.groups).reduce((memo, group) => {
    if (group.metadata.isSelected) {
      return group.label;
    } else {
      return memo;
    }
  }, "");

  const [showAddEventForm, toggleShowAddEventForm] = useToggle(false);

  const eventAdjustmentsRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (showAddEventForm) {
      toggleShowAddEventForm();
    }
  }, [selectedGroup]);

  useEffect(() => {
    setData({ events: props.budgetCategory?.events || [] });
    eventAdjustmentsRef.current.clear();
  }, [props.budgetCategory?.slug]);

  const removeEvent = (args: { key: string; slug: string }) => {
    const { key, slug } = args;

    const url = UrlBuilder({
      name: "BudgetSetupRemoveEvent",
      month: props.metadata.month,
      year: props.metadata.year,
      categorySlug: slug,
      key,
    });
    deleteRequest(url, { data: {}, preserveState: true });
  };

  const updateEvents = (events: Array<{ key: string; amount: string }>) => {
    const url = UrlBuilder({
      name: "BudgetSetupPut",
      month: props.metadata.month,
      year: props.metadata.year,
      categorySlug: props.budgetCategory.slug,
    });

    events.forEach(({ key, amount }) => {
      eventAdjustmentsRef.current.set(key, amount);
    });

    router.put(
      url,
      {
        events: events.map(({ key, amount }) => ({
          budgetItemKey: key,
          adjustment: { display: amount },
        })),
      },
      { preserveState: true },
    );
  };

  const putCategory = (slug?: string) => {
    const events = props.budgetCategory.events.map(
      ({ budgetItemKey, adjustment }) => {
        const latestAdjustment = eventAdjustmentsRef.current.get(budgetItemKey);
        if (latestAdjustment !== undefined) {
          return {
            budgetItemKey,
            adjustment: { display: latestAdjustment },
          };
        }
        return { budgetItemKey, adjustment };
      },
    );

    const hasChanges = props.budgetCategory.events.some(
      ({ budgetItemKey, adjustment }) => {
        const latestAdjustment = eventAdjustmentsRef.current.get(budgetItemKey);
        if (latestAdjustment === undefined) {
          return false;
        }
        const propDisplay = adjustment.display ?? "";
        const trackedDisplay = latestAdjustment ?? "";
        return propDisplay !== trackedDisplay;
      },
    );

    if (hasChanges) {
      const url = UrlBuilder({
        name: "BudgetSetupPut",
        month: props.metadata.month,
        year: props.metadata.year,
        ...(!!slug ? { queryParams: `next-category=${slug}` } : {}),
        categorySlug: props.budgetCategory.slug,
      });

      router.put(
        url,
        { events },
        {
          preserveState: true,
          onSuccess: () => {
            eventAdjustmentsRef.current.clear();
          },
        },
      );
    } else {
      // No changes, use GET to navigate
      const targetSlug = slug || props.budgetCategory.slug;
      const url = `/budget/${props.metadata.month}/${props.metadata.year}/set-up/${targetSlug}`;

      router.get(url, {}, { preserveState: true });
    }
  };

  const changeNextCategory = () => {
    putCategory(props.metadata.nextCategorySlug);
  };

  const changeNextUnreviewedCategory = () => {
    putCategory(props.metadata.nextUnreviewedCategorySlug);
  };

  const changePreviousUnreviewedCategory = () => {
    putCategory(props.metadata.previousUnreviewedCategorySlug);
  };

  const changePreviousCategory = () => {
    putCategory(props.metadata.previousCategorySlug);
  };

  return {
    ...props,
    budgetCategory: props.budgetCategory,
    putCategory,
    changeNextCategory,
    changeNextUnreviewedCategory,
    changePreviousCategory,
    changePreviousUnreviewedCategory,
    processing,
    removeEvent,
    updateEvents,
  };
};

const SetupEventContext = createContext<ReturnType<
  typeof useSetUpEventsForm
> | null>(null);

const SetupProvider = (
  props: ComponentProps & { children: React.ReactNode },
) => {
  const { children, ...setupIndex } = props;
  const hook = useSetUpEventsForm(setupIndex);

  return (
    <SetupEventContext.Provider value={hook}>
      {children}
    </SetupEventContext.Provider>
  );
};

const useSetUpEventsFormContext = (): ReturnType<typeof useSetUpEventsForm> => {
  const context = useContext(SetupEventContext);
  if (!context) {
    throw new Error(
      "useSetupEventsFormContext must be used with a Set Up Provider",
    );
  }
  return context;
};

const NewSetUpComponent = (props: ComponentProps) => {
  return (
    <SetupProvider {...props}>
      <KeyboardNav />
      <div className="w-full flex flex-row flex-wrap">
        <div className="w-full flex md:flex-row flex-col gap-6 mb-6 p-2">
          <LeftColumn />
          <RightColumn />
        </div>
      </div>
    </SetupProvider>
  );
};

export type {
  SetupEvent,
  SetupCategory,
  TCategoryGroup,
  TCategoryListItem,
  TGroupScopes,
  TEventFlags,
};

export {
  useSetUpEventsFormContext,
  useSetUpEventsFormContext as useSetupEventsFormContext,
};

export default NewSetUpComponent;
