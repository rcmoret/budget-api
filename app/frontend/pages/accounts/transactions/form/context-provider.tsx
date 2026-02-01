import { useContext, createContext } from "react";
import { useForm } from "@inertiajs/react";
import { useAppConfigContext } from "@/components/layout/Provider";
import { buildQueryParams } from "@/lib/redirect_params";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { TransactionWithBalance } from "@/pages/accounts/transactions";

export type TFormDetail = {
  key: string;
  budgetItemKey: string | null;
  amount: TInputAmount;
  _destroy: boolean;
};

type InputProps = {
  name: string;
  value: string | number | boolean;
};

type FormData = {
  key: string;
  accountKey: string;
  checkNumber: string | null;
  clearanceDate: string | null;
  description: string | null;
  details: TFormDetail[];
  isBudgetExclusion: boolean;
  notes: string | null;
  receipt: File | null;
};

type TransactionFormContextValue = {
  // Form state
  data: FormData;
  processing: boolean;
  transaction: TransactionWithBalance;

  // Form flags
  isNew: boolean;
  isOdd: boolean;

  // Date context
  month: number;
  year: number;

  // Form actions
  updateFormData: (props: InputProps) => void;
  closeForm: () => void;
  onSubmit: () => void;

  // Detail management
  formDetails: TFormDetail[];
  addDetail: () => void;
  removeDetail: (key: string) => void;
  updateDetailItem: (props: {
    key: string;
    value: string | null;
    amount?: TInputAmount;
  }) => void;
  updateDetailAmount: (props: { key: string; value: TInputAmount }) => void;
};

type ProviderProps = {
  transaction: TransactionWithBalance;
  index: number;
  month: number;
  year: number;
  isNew: boolean;
  closeForm: () => void;
  onSuccess: () => void;
  children: React.ReactNode;
};

const LocalContext = createContext<TransactionFormContextValue | null>(null);

const TransactionFormProvider = (props: ProviderProps) => {
  const { children, index, month, year, transaction, isNew, closeForm } = props;
  const { appConfig } = useAppConfigContext();

  const {
    key,
    accountKey,
    accountSlug,
    checkNumber,
    clearanceDate,
    description,
    isBudgetExclusion,
    notes,
  } = transaction;

  const details: TFormDetail[] = transaction.details.map((detail) => ({
    key: detail.key,
    budgetItemKey: detail.budgetItemKey,
    amount: inputAmount({
      ...(detail.amount === 0 ? { display: "" } : { cents: detail.amount }),
    }),
    _destroy: false,
  }));

  const { data, setData, transform, processing, post, put } = useForm({
    key,
    accountKey,
    checkNumber,
    clearanceDate,
    description,
    details,
    isBudgetExclusion,
    notes,
    receipt: null,
  });

  // @ts-ignore
  transform(() => {
    const { key, details, accountKey, receipt, ...txn } = data;
    return {
      transaction: {
        ...txn,
        ...(isNew ? { key } : { accountKey }),
        detailsAttributes: details.map((detail) => {
          if (!detail._destroy) {
            return {
              key: detail.key,
              budgetItemKey: detail.budgetItemKey,
              amount: detail.amount.cents,
            };
          } else {
            return { key: detail.key, _destroy: true };
          }
        }),
        ...(receipt ? { receipt } : {}),
      },
    };
  });

  const updateFormData = (inputProps: InputProps) => {
    setData({ ...data, [inputProps.name]: inputProps.value });
  };

  const removeDetail = (detailKey: string) => {
    setData({
      ...data,
      details: data.details.reduce((collection, detail) => {
        if (detail.key !== detailKey) {
          return [...collection, detail];
        } else if (isNew) {
          return collection;
        } else {
          return [...collection, { ...detail, _destroy: true }];
        }
      }, [] as TFormDetail[]),
    });
  };

  const addDetail = () => {
    setData({
      ...data,
      details: [
        ...data.details,
        {
          key: generateKeyIdentifier(),
          amount: inputAmount({ display: "" }),
          budgetItemKey: null,
          _destroy: false,
        },
      ],
    });
  };

  const updateDetailItem = (updateProps: {
    key: string;
    value: string | null;
    amount?: TInputAmount;
  }) => {
    const { value, key: detailKey } = updateProps;

    setData({
      ...data,
      details: data.details.map((detail) =>
        detail.key === detailKey
          ? {
              ...detail,
              budgetItemKey: value,
              amount: updateProps.amount || detail.amount,
            }
          : detail
      ),
    });
  };

  const updateDetailAmount = (updateProps: {
    key: string;
    value: TInputAmount;
  }) => {
    const { value, key: detailKey } = updateProps;

    setData({
      ...data,
      details: data.details.map((detail) =>
        detail.key === detailKey ? { ...detail, amount: value } : detail
      ),
    });
  };

  const queryParams = buildQueryParams([
    "account",
    accountSlug,
    "transactions",
    appConfig.budget.data.month,
    appConfig.budget.data.year,
  ]);

  const postCreate = () => {
    const formUrl = UrlBuilder({
      name: "TransactionIndex",
      accountSlug,
      queryParams,
    });
    post(formUrl, { onSuccess: () => props.onSuccess() });
  };

  const putUpdate = () => {
    const formUrl = UrlBuilder({
      name: "TransactionShow",
      accountSlug,
      key,
      queryParams,
    });
    put(formUrl, { onSuccess: () => props.onSuccess() });
  };

  const onSubmit = () => {
    if (isNew) {
      postCreate();
    } else {
      putUpdate();
    }
  };

  const formDetails = data.details.filter((detail) => !detail._destroy);

  const value: TransactionFormContextValue = {
    data,
    processing,
    transaction,
    isNew,
    isOdd: index % 2 === 1,
    month,
    year,
    updateFormData,
    closeForm,
    onSubmit,
    formDetails,
    addDetail,
    removeDetail,
    updateDetailItem,
    updateDetailAmount,
  };

  return (
    <LocalContext.Provider value={value}>{children}</LocalContext.Provider>
  );
};

const useTransactionFormContext = (): TransactionFormContextValue => {
  const context = useContext(LocalContext);
  if (!context) {
    throw new Error(
      "useTransactionFormContext must be used within a TransactionFormProvider"
    );
  }
  return context;
};

export {
  TransactionFormProvider,
  useTransactionFormContext,
  type ProviderProps as TransactionFormProviderProps,
};
