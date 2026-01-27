type AccountShowProps = {
  name: "AccountShow";
  key: string;
  queryParams?: string;
  anchor?: string;
};

type AccountIndexProps = {
  name: "AccountIndex";
  queryParams?: string;
  anchor?: string;
};

type AccountTransactions = {
  name: "AccountTransactions";
  accountSlug: string;
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type AccountTransferProps = {
  name: "AccountTransfer";
  queryParams?: string;
  anchor?: string;
};

type BudgetEditProps = {
  name: "BudgetEdit";
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type BudgetFinalizePostProps = {
  name: "BudgetFinalize";
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type BudgetItemDetailsProps = {
  name: "BudgetItemDetails";
  queryParams?: string;
  key: string;
  anchor?: string;
};

type BudgetItemEventsProps = {
  name: "BudgetItemEvents";
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type BudgetSetupProps = {
  name: "BudgetSetUp";
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type BudgetSetupPutProps = {
  name: "BudgetSetupPut";
  month: number | string;
  year: number | string;
  categorySlug: string;
  queryParams?: string;
};

type BudgetSetupRemoveEventProps = {
  name: "BudgetSetupRemoveEvent";
  month: number | string;
  year: number | string;
  categorySlug: string;
  key: string;
  queryParams?: string;
};

type BudgetShowProps = {
  name: "BudgetShow";
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type CategoryCreateEventsProps = {
  name: "CategoryCreateEvents";
  month: number | string;
  year: number | string;
  queryParams?: string;
  anchor?: string;
};

type CategoryIndexProps = {
  name: "CategoryIndex";
  queryParams?: string;
  anchor?: string;
};

type CategorySummaryProps = {
  name: "CategorySummary";
  key: string;
  limit?: number;
  queryParams?: string;
  anchor?: string;
};

export type CategoryShowProps = {
  name: "CategoryShow";
  key: string;
  queryParams?: string;
  anchor?: string;
};

type TransactionIndexProps = {
  name: "TransactionIndex";
  accountSlug: string;
  queryParams?: string;
  anchor?: string;
};

type TransactionShowProps = {
  name: "TransactionShow";
  accountSlug: string;
  key: string;
  queryParams?: string;
  anchor?: string;
};

type UrlBuilderProps =
  | AccountIndexProps
  | AccountShowProps
  | AccountTransactions
  | AccountTransferProps
  | BudgetEditProps
  | BudgetFinalizePostProps
  | BudgetItemDetailsProps
  | BudgetItemEventsProps
  | BudgetSetupProps
  | BudgetSetupPutProps
  | BudgetSetupRemoveEventProps
  | BudgetShowProps
  | CategoryCreateEventsProps
  | CategoryIndexProps
  | CategoryShowProps
  | CategorySummaryProps
  | TransactionIndexProps
  | TransactionShowProps;

const UrlBuilder = (props: UrlBuilderProps) => {
  const { name, anchor, queryParams } = props;

  const build = (base: string): string => {
    if (!anchor && !queryParams) {
      return base;
    }
    if (!!anchor && !!queryParams) {
      return `${base}#${anchor}?${queryParams}`;
    }
    if (!!anchor && !queryParams) {
      return `${base}#${anchor}`;
    }
    if (!anchor && !!queryParams) {
      return `${base}?${queryParams}`;
    }
    return "";
  };

  switch (name) {
    case "AccountIndex":
      return build("/accounts");
    case "AccountShow":
      return build(`/account/${props.key}`);
    case "AccountTransactions":
      return build(
        `/account/${props.accountSlug}/transactions/${props.month}/${props.year}`,
      );
    case "AccountTransfer":
      return build("/accounts/transfer");
    case "BudgetEdit":
      return build(`/budget/${props.month}/${props.year}`);
    case "BudgetFinalize":
      return build(`/budget/${props.month}/${props.year}/finalize`);
    case "BudgetItemDetails":
      return build(`/data/budget/item/${props.key}/events`);
    case "BudgetItemEvents":
      return build(`/budget/events/${props.month}/${props.year}`);
    case "BudgetSetUp":
      return build(`/budget/${props.month}/${props.year}/set-up`);
    case "BudgetSetupPut":
      return build(
        `/budget/${props.month}/${props.year}/set-up/${props.categorySlug}`,
      );
    case "BudgetSetupRemoveEvent":
      return build(
        `/budget/${props.month}/${props.year}/set-up/${props.categorySlug}/${props.key}`,
      );
    case "BudgetShow":
      return build(`/budget/${props.month}/${props.year}`);
    case "CategoryCreateEvents":
      return build(
        `/data/budget/categories/${props.month}/${props.year}/create_events`,
      );
    case "CategoryIndex":
      return build("/budget/categories");
    case "CategorySummary":
      return build(
        `/data/budget/category/${props.key}/recent-summaries/${props.limit || ""}`,
      );
    case "CategoryShow":
      return build(`/budget/category/${props.key}`);
    case "TransactionIndex":
      return build(`/account/${props.accountSlug}/transaction`);
    case "TransactionShow":
      return build(`/account/${props.accountSlug}/transaction/${props.key}`);
  }
};

export { UrlBuilder };
