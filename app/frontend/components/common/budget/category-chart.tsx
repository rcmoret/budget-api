import { createContext, useContext } from "react";
import { AmountSpan } from "@/components/common/AmountSpan";
import { useRef, useState } from "react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import {
  bgCurrentlyBudgeted,
  bgDeposited,
  bgPreviouslyBudgeted,
  bgSpent,
} from "@/lib/theme/colors/backgrounds";
import { borderColor, backgroundFill } from "@/lib/context-colors";
import axios from "axios";

type MonthlyData = {
  month: number;
  year: number;
  budgeted: number;
  currentlyBudgeted: number;
  previouslyBudgeted: number;
  transactionsTotal: number;
};

type GenericCategory = {
  key: string;
  isExpense: boolean;
};

const Bar = (props: MonthlyData & { maxAmount: number }) => {
  const {
    category: { isExpense },
  } = useCategoryAveragesContext();
  const budgetedWidth = (100 * Math.abs(props.budgeted)) / props.maxAmount;
  const spentWidth =
    (100 * Math.abs(props.transactionsTotal)) / props.maxAmount;
  const previousShare =
    100 * Math.abs(props.previouslyBudgeted / props.budgeted);
  const currentShare = 100 * Math.abs(props.currentlyBudgeted / props.budgeted);

  return (
    <div
      className={`w-full text-xs flex flex-row items-center justify-between border-b ${borderColor("blue", "light")} py-2`}
    >
      <div className="w-2/12">
        {props.month}/{props.year}
      </div>
      <div className="w-7/12 flex flex-col gap-2">
        <div
          className="h-2 rounded-lg overflow-hidden flex flex-row"
          style={{ width: budgetedWidth.toFixed(2) + "%" }}
        >
          <div
            className={`h-2 ${bgPreviouslyBudgeted}`}
            style={{ width: previousShare.toFixed(2) + "%" }}
          ></div>
          <div
            className={`h-2 ${bgCurrentlyBudgeted}`}
            style={{ width: currentShare.toFixed(2) + "%" }}
          ></div>
        </div>
        <div
          className={`h-2 ${isExpense ? bgSpent : bgDeposited} rounded-lg`}
          style={{ width: spentWidth.toFixed(2) + "%" }}
        ></div>
      </div>
      <div className="w-2/12 flex flex-col gap-2 items-end">
        <div className="text-xs">
          <AmountSpan
            amount={props.currentlyBudgeted}
            absolute={true}
            showCents={false}
          />
        </div>
        <div className="text-xs">
          <AmountSpan
            amount={props.budgeted}
            absolute={true}
            showCents={false}
          />
        </div>
      </div>
    </div>
  );
};

const BarLabel = (props: {
  children: React.ReactNode;
  color: string;
  bgColor: string;
}) => {
  const { children, color, bgColor } = props;
  const className = [bgColor, color, "rounded"].join(" ");

  return (
    <div className="w-4/12 p-0.5">
      <div className={className}>{children}</div>
    </div>
  );
};

const MonthlyDataChart = (props: {
  data: Array<MonthlyData>;
}): JSX.Element | null => {
  const {
    category: { isExpense },
  } = useCategoryAveragesContext();

  if (!props.data || props.data.length === 0) return null;

  const maxAmount = Math.max(
    ...props.data.flatMap(({ budgeted, transactionsTotal }) => {
      return [Math.abs(transactionsTotal), Math.abs(budgeted)];
    }),
  );

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="w-full text-center flex flex-row justify-between text-xs items-center">
        <BarLabel bgColor={bgPreviouslyBudgeted} color="text-white">
          Previous
        </BarLabel>
        <BarLabel bgColor={bgCurrentlyBudgeted} color="text-white">
          Current
        </BarLabel>
        <BarLabel
          bgColor={isExpense ? bgSpent : bgDeposited}
          color="text-white"
        >
          {isExpense ? "Spent" : "Deposited"}
        </BarLabel>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="w-2/12"></div>
        <div
          className={`w-7/12 text-xs flex flex-row justify-between border-b ${borderColor("blue", "light")}`}
        >
          <div>
            <AmountSpan amount={0} absolute={true} showCents={false} />
          </div>
          <div>
            <AmountSpan
              amount={maxAmount / 2}
              absolute={true}
              showCents={false}
            />
          </div>
          <div>
            <AmountSpan amount={maxAmount} absolute={true} showCents={false} />
          </div>
        </div>
        <div className="w-2/12"></div>
      </div>
      {props.data.map((monthlyData) => (
        <Bar
          key={`${monthlyData.year}.${monthlyData.month}`}
          maxAmount={maxAmount}
          {...monthlyData}
        />
      ))}
    </div>
  );
};

type TBudgetCategorySummary = {
  id: number;
  budgetedAverage: number;
  transactionsTotalAverage: number;
  limit: number;
  data: Array<TMonthData>;
};

type TMonthData = {
  month: number;
  year: number;
  budgeted: number;
  transactionsTotal: number;
};

type CategorySummaryResponse = {
  category: TBudgetCategorySummary;
};

const getSummaryData = async (props: {
  limit?: number;
  categoryKey: string;
  month: number;
  year: number;
  setIsLoading: (b: boolean) => void;
  setNumberOfMonths: (n: number) => void;
  addSummaryData: (p: { key: string; data: TBudgetCategorySummary }) => void;
}) => {
  const {
    month,
    year,
    categoryKey,
    addSummaryData,
    setNumberOfMonths,
    setIsLoading,
  } = props;

  setIsLoading(true);
  const summaryUrl = UrlBuilder({
    name: "CategorySummary",
    key: categoryKey,
    limit: props?.limit,
    queryParams: `before[month]=${month}&before[year]=${year}`,
  });

  axios
    .get<CategorySummaryResponse>(summaryUrl)
    .then((response) => {
      const { category: categoryData } = response.data;
      setNumberOfMonths(Number(categoryData.limit));
      addSummaryData({ key: categoryKey, data: categoryData });
    })
    .catch((error) => {
      console.error("Error fetching summary data:", error);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

const MonthsInput = (props: {
  limit: number;
  isLoading: boolean;
  fetchSummaries: () => void;
  setNumberOfMonths: (n: number) => void;
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props.setNumberOfMonths(Number(event.target.value));
      props.fetchSummaries();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const onWheel = (ev: React.WheelEvent<HTMLInputElement>) => {
    ev.currentTarget.blur();
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    props.setNumberOfMonths(Number(ev.target.value));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      props.fetchSummaries();
    }, 1200);
  };

  return (
    <input
      className="text-right"
      value={props.limit}
      onChange={onChange}
      onKeyUp={onKeyUp}
      disabled={props.isLoading}
      onWheel={onWheel}
    />
  );
};

const SummaryLine = (props: { label: string; children: React.ReactNode }) => {
  const className = [
    "bg-blue-20",
    "w-full",
    "flex",
    "flex-row",
    "justify-between",
    "text-sm",
    "py-1",
    "px-2",
    "rounded-sm",
  ].join(" ");

  return (
    <div
      className={className}
      style={{ boxShadow: "inset 2px 2px 1px 0 rgba(66, 91, 255, 0.22)" }}
    >
      <div>{props.label}</div>
      <div>{props.children}</div>
    </div>
  );
};

const CategoryAverages = () => {
  const {
    currentSummary,
    fetchSummaries,
    isLoading,
    numberOfMonths,
    setNumberOfMonths,
    spentOrDeposited,
  } = useCategoryAveragesContext();

  if (currentSummary) {
    return (
      <div
        className={`w-72 py-4 px-2 ${backgroundFill("blue", "extra-light")} rounded-lg flex flex-col gap-1`}
      >
        <SummaryLine label="Average Budgeted">
          <AmountSpan amount={currentSummary.budgetedAverage} />
        </SummaryLine>
        <SummaryLine label={`Average ${spentOrDeposited}`}>
          <AmountSpan amount={currentSummary.transactionsTotalAverage} />
        </SummaryLine>
        <SummaryLine label="months">
          <MonthsInput
            isLoading={isLoading}
            fetchSummaries={fetchSummaries}
            limit={numberOfMonths}
            setNumberOfMonths={setNumberOfMonths}
          />
        </SummaryLine>
        <MonthlyDataChart data={currentSummary.data} />
      </div>
    );
  } else {
    return null;
  }
};

const SummaryUpdateButton = () => {
  const { isLoading, fetchSummaries } = useCategoryAveragesContext();

  const className = [
    "bg-blue-300",
    "hover:bg-blue-400",
    "text-white",
    "py-2",
    "px-4",
    "font-semibold",
    "shadow-sm",
    "rounded",
    isLoading ? "opacity-50 cursor-not-allowed" : "",
  ].join(" ");

  return (
    <div>
      <button
        type="button"
        onClick={fetchSummaries}
        className={className}
        disabled={isLoading}
      >
        Show Averages
      </button>
    </div>
  );
};

type TCategoryAverageComponentProps<
  T extends GenericCategory = GenericCategory,
> = {
  month: number;
  year: number;
  category: T;
};

type TSummaryData = Record<string, TBudgetCategorySummary>;

const CategoryAverageContext =
  createContext<TCategoryAverageComponentProps | null>(null);

type TCategoryAverageContext<T extends GenericCategory = GenericCategory> =
  TCategoryAverageComponentProps<T> & {
    addSummaryData: (props: {
      key: string;
      data: TBudgetCategorySummary;
    }) => void;
    currentSummary: null | TBudgetCategorySummary;
    isHidden: boolean;
    isLoading: boolean;
    fetchSummaries: () => void;
    month: number;
    numberOfMonths: number;
    hideAverages: () => void;
    setIsLoading: (b: boolean) => void;
    setNumberOfMonths: (s: number) => void;
    spentOrDeposited: string;
    summaryData: TSummaryData;
    year: number;
  };

const useCategoryAveragesContext = <
  T extends GenericCategory = GenericCategory,
>(): TCategoryAverageContext<T> => {
  const context = useContext(CategoryAverageContext);
  if (!context) {
    throw new Error(
      "useCategoryAveragesContext must be used within a Category Average Provider",
    );
  }
  return context as TCategoryAverageContext<T>;
};

const CategoryAveragesProvider = <T extends GenericCategory>(props: {
  category: T;
  month: number;
  year: number;
  children: React.ReactNode;
}) => {
  const { children, category, month, year } = props;

  const [summaryData, setSummaryData] = useState<TSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSummaryData = (props: {
    key: string;
    data: TBudgetCategorySummary;
  }) => {
    setSummaryData((prev) => ({
      ...(prev ?? {}),
      [props.key]: props.data,
    }));
  };

  const spentOrDeposited = category.isExpense ? "Spent" : "Deposited";
  const currentSummary = summaryData?.[category.key] ?? null;

  const limit = currentSummary?.limit ?? 3;

  const [numberOfMonths, setNumberOfMonths] = useState<number>(limit);

  const fetchSummaries = () =>
    getSummaryData({
      limit: numberOfMonths,
      setIsLoading,
      addSummaryData,
      setNumberOfMonths,
      categoryKey: category.key,
      month,
      year,
    });

  const value = {
    addSummaryData,
    category,
    currentSummary,
    fetchSummaries,
    hideAverages: () => setSummaryData(null),
    isHidden: !currentSummary,
    isLoading,
    month,
    numberOfMonths,
    setIsLoading,
    setNumberOfMonths,
    spentOrDeposited,
    summaryData,
    year,
  };

  return (
    <CategoryAverageContext.Provider
      value={value as TCategoryAverageComponentProps<T>}
    >
      {children}
    </CategoryAverageContext.Provider>
  );
};

export {
  SummaryUpdateButton,
  CategoryAverages,
  useCategoryAveragesContext,
  CategoryAveragesProvider,
};
