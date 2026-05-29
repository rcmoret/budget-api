import { useBudgetCategoryContext } from "@/pages/budget/categories/context-provider";
import {
  useBudgetCategoriesStore,
  useShowNewCategoryForm,
} from "@/pages/budget/categories/store";
import { SetDataAction, useForm } from "@inertiajs/react";
import { createContext, useContext } from "react";
import { redirectQueryParams } from "@/utils/redirect_params";

type BudgetCategoryFormProps = {
  name: string;
  slug: string;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  isAccrual: boolean;
  defaultAmount: number | string | null;
};

type BudgetCategoryFormContextType = {
  data: BudgetCategoryFormProps;
  isSubmittable: boolean;
  setData: SetDataAction<BudgetCategoryFormProps>;
};

const BudgetCategoryFormContext =
  createContext<BudgetCategoryFormContextType | null>(null);

const BudgetCategoryFormProvider = (props: { children: React.ReactNode }) => {
  const { category } = useBudgetCategoryContext();
  const onSuccess = useBudgetCategoriesStore((s) => s.onDismiss);
  const isNewCategoryFormShown = useShowNewCategoryForm();
  const newCategoryKey = useBudgetCategoriesStore((s) => s.newCategoryKey);
  const { data, isDirty, post, put, setData, transform } =
    useForm<BudgetCategoryFormProps>({
      name: category.name,
      slug: category.slug,
      isExpense: category.isExpense,
      isMonthly: category.isMonthly,
      isAccrual: category.isAccrual,
      defaultAmount: category.defaultAmount,
    });

  const queryParams = redirectQueryParams(["budget", "category"]);
  const isSubmittable = isDirty;

  const value: BudgetCategoryFormContextType = {
    data,
    isSubmittable,
    setData,
  };

  const formUrl = [
    "/budget",
    "/category",
    ...(isNewCategoryFormShown ? [] : ["/", category.key]),
    "?",
    queryParams,
  ].join("");

  const handleSubmit = (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    transform((current) => {
      const properties = {
        name: current.name,
        slug: current.slug,
        defaultAmount: current.defaultAmount,
      };
      if (isNewCategoryFormShown) {
        return {
          category: {
            ...properties,
            expense: current.isExpense,
            monthly: current.isMonthly,
            key: newCategoryKey,
          },
        };
      } else {
        return { category: properties };
      }
    });

    if (isNewCategoryFormShown) {
      post(formUrl, { onSuccess });
    } else {
      put(formUrl, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BudgetCategoryFormContext.Provider value={value}>
        {props.children}
      </BudgetCategoryFormContext.Provider>
    </form>
  );
};

const useBudgetCategoryFormContext = () => {
  const context = useContext(BudgetCategoryFormContext);

  if (!context) {
    throw new Error(
      "useBudgetCategoryFormContext must be used within BudgetCategoryFormContext",
    );
  }

  return context;
};

export { BudgetCategoryFormProvider, useBudgetCategoryFormContext };
