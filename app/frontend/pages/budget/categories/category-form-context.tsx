import { BudgetCategory } from "@/types/budget";
import { TInputAmount } from "@/components/common/AmountInput";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { createContext, useContext } from "react";
import { inputAmount } from "@/components/common/AmountInput";
import { useForm } from "@inertiajs/react";
import { SingleValue } from "react-select";

type SelectOption = SingleValue<{ label: string; value: string }>;

type NewBudgetCategory = {
  key: string;
  name: string;
  slug: string;
  archivedAt: null;
  defaultAmount?: number;
  iconKey: string | null;
  isAccrual: boolean;
  isArchived: false;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  isPerDiemEnabled: boolean;
};

type CategoryFormProps = {
  category: BudgetCategory | NewBudgetCategory;
  isFormShown: boolean;
  closeForm: () => void;
};

type FormData = {
  key: string;
  name: string;
  slug: string;
  defaultAmount: TInputAmount;
  iconKey: string | null;
  isAccrual: boolean;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  isPerDiemEnabled: boolean;
};

type ChangeHandlers = {
  handleAmount: (amount: string) => void;
  toggleAccrual: () => void;
  togglePerDiem: () => void;
  updateExpenseOrRevenue: (b: boolean) => void;
  updateIconKey: (o: SelectOption) => void;
  updateMonthlyOrDayToDay: (b: boolean) => void;
};

type CategoryFormContext = CategoryFormProps & {
  isNew: boolean;
  data: FormData;
  changeHanlders: ChangeHandlers;
  formHeadingId: string;
  onSubmit: () => void;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  processing: boolean;
};

const FormContext = createContext<CategoryFormContext | null>(null);

const CategoryFormProvider = (props: {
  category: BudgetCategory | NewBudgetCategory;
  children: React.ReactNode;
  closeForm: () => void;
  isFormShown: boolean;
  isNew: boolean;
}) => {
  const { children, category, isFormShown, isNew, closeForm } = props;

  const {
    key,
    name,
    slug,
    defaultAmount,
    iconKey,
    isAccrual,
    isExpense,
    isMonthly,
    isPerDiemEnabled,
  } = category;

  const { data, setData, processing, transform, post, put } = useForm({
    key,
    name,
    slug,
    defaultAmount: inputAmount({ cents: defaultAmount }),
    iconKey,
    isAccrual,
    isExpense,
    isMonthly,
    isPerDiemEnabled,
  });

  // @ts-ignore
  transform(() => {
    const newAttributes = {
      key: data.key,
      expense: data.isExpense,
      monthly: data.isMonthly,
    };

    return {
      category: {
        name: data.name,
        slug: data.slug,
        defaultAmount: data.defaultAmount.cents,
        iconKey: data.iconKey,
        ...(isNew ? newAttributes : {}),
        ...(data.isExpense ? { accrual: data.isAccrual } : {}),
        ...(!data.isMonthly ? { isPerDiemEnabled: data.isPerDiemEnabled } : {}),
      },
    };
  });

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [ev.target.name]: ev.target.value });
  };

  const postCreate = () => {
    const formUrl = UrlBuilder({
      name: "CategoryIndex",
      queryParams: buildQueryParams(["budget", "categories"]),
    });
    post(formUrl, { onSuccess: closeForm });
  };

  const putUpdate = () => {
    const formUrl = UrlBuilder({
      name: "CategoryShow",
      key: category.key,
      queryParams: buildQueryParams(["budget", "categories"]),
    });
    put(formUrl, { onSuccess: closeForm });
  };

  const onSubmit = isNew ? postCreate : putUpdate;

  const changeHanlders: ChangeHandlers = {
    handleAmount: (amount: string) => {
      const amountTuple = inputAmount({ display: amount });
      setData({ ...data, defaultAmount: amountTuple });
    },
    updateIconKey: (option: SelectOption) =>
      setData({ ...data, iconKey: String(option?.value) }),
    toggleAccrual: () => setData({ ...data, isAccrual: !data.isAccrual }),
    togglePerDiem: () =>
      setData({ ...data, isPerDiemEnabled: !data.isPerDiemEnabled }),
    updateExpenseOrRevenue: (value: boolean) => {
      setData({ ...data, isExpense: value });
    },
    updateMonthlyOrDayToDay: (value: boolean) => {
      setData({ ...data, isMonthly: value });
    },
  };

  const value: CategoryFormContext = {
    category,
    changeHanlders,
    closeForm,
    data,
    formHeadingId: `category-form-heading-${key}`,
    isFormShown,
    isNew,
    onChange,
    onSubmit,
    processing,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

const useCategoryFormContext = (): CategoryFormContext => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "useCategoryFormContext must be used within a FormProvider",
    );
  }
  return context;
};

export { CategoryFormProvider, useCategoryFormContext };
