type OptionalProps = {
  queryParams?: string;
  anchor?: string;
};

type AccountShowProps = {
  name: "AccountShow";
  key: string;
} & OptionalProps;

type AccountIndexProps = {
  name: "AccountIndex";
} & OptionalProps;

type AccountTransactions = {
  name: "AccountTransactions";
  accountSlug: string;
  month: number | string;
  year: number | string;
} & OptionalProps;

type AccountTransferProps = {
  name: "AccountTransfer";
} & OptionalProps;

type BudgetEditProps = {
  name: "BudgetEdit";
  month: number | string;
  year: number | string;
} & OptionalProps;

type BudgetFinalizePostProps = {
  name: "BudgetFinalize";
  month: number | string;
  year: number | string;
} & OptionalProps;

type BudgetItemDetailsProps = {
  name: "BudgetItemDetails";
  key: string;
} & OptionalProps;

type BudgetItemEventsProps = {
  name: "BudgetItemEvents";
  month: number | string;
  year: number | string;
} & OptionalProps;

type BudgetSetupProps = {
  name: "BudgetSetUp";
  month: number | string;
  year: number | string;
} & OptionalProps;

type BudgetSetupPutProps = {
  name: "BudgetSetupPut";
  month: number | string;
  year: number | string;
  categorySlug: string;
} & OptionalProps;

type BudgetSetupRemoveEventProps = {
  name: "BudgetSetupRemoveEvent";
  month: number | string;
  year: number | string;
  categorySlug: string;
  key: string;
} & OptionalProps;

type BudgetShowProps = {
  name: "BudgetShow";
  month: number | string;
  year: number | string;
} & OptionalProps;

type CategoryCreateEventsProps = {
  name: "CategoryCreateEvents";
  month: number | string;
  year: number | string;
} & OptionalProps;

type CategoryIndexProps = {
  name: "CategoryIndex";
} & OptionalProps;

type CategorySummaryProps = {
  name: "CategorySummary";
  key: string;
  limit?: number;
} & OptionalProps;

export type CategoryShowProps = {
  name: "CategoryShow";
  key: string;
} & OptionalProps;

type TransactionDeleteReceiptProps = {
  name: "TransactionDeleteReceipt";
  accountSlug: string;
  key: string;
} & OptionalProps;

type TransactionIndexProps = {
  name: "TransactionIndex";
  accountSlug: string;
} & OptionalProps;

type TransactionShowProps = {
  name: "TransactionShow";
  accountSlug: string;
  key: string;
} & OptionalProps;

type PortfolioIndexProps = {
  name: "PortfolioIndex";
  email: string;
} & OptionalProps;

type PortfolioCreateItemProps = {
  name: "PortfolioCreateItem";
} & OptionalProps;

type PortfolioUpdateItemProps = {
  name: "PortfolioUpdateItem";
  key: string;
} & OptionalProps;

type PortfolioUpdateAboutProps = {
  name: "PortfolioUpdateAbout";
} & OptionalProps;

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
  | TransactionDeleteReceiptProps
  | TransactionIndexProps
  | TransactionShowProps
  | PortfolioIndexProps
  | PortfolioCreateItemProps
  | PortfolioUpdateItemProps
  | PortfolioUpdateAboutProps;

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
    case "TransactionDeleteReceipt":
      return build(
        `/account/${props.accountSlug}/transaction/${props.key}/receipt`,
      );
    case "TransactionIndex":
      return build(`/account/${props.accountSlug}/transaction`);
    case "TransactionShow":
      return build(`/account/${props.accountSlug}/transaction/${props.key}`);
    case "PortfolioIndex":
      return build(`/portfolio/items?email=${props.email}`);
    case "PortfolioCreateItem":
      return build("/portfolio/item");
    case "PortfolioUpdateItem":
      return build(`/portfolio/item/${props.key}`);
    case "PortfolioUpdateAbout":
      return build("/portfolio/about");
  }
};

export { UrlBuilder };
