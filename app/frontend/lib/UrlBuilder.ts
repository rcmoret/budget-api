type AccountShowProps = {
  name: "AccountShow";
  key: string;
  queryParams?: string;
}

type AccountIndexProps = {
  name: "AccountIndex";
  queryParams?: string;
}

type AccountTransferProps = {
  name: "AccountTransfer";
  queryParams?: string;
}

type BudgetEditProps ={
  name: "BudgetEdit",
  month: number | string;
  year: number | string;
  queryParams?: string;
}

type BudgetItemEventsProps = {
  name: "BudgetItemEvents";
  month: number | string;
  year: number | string;
  queryParams?: string;
}

type BudgetSetUpProps = {
  name: "BudgetSetUp";
  month: number | string;
  year: number | string;
  queryParams?: string;
}

type BudgetShowProps = {
  name: "BudgetShow";
  month: number | string;
  year: number | string;
  queryParams?: string;
}

type CategoryIndexProps = {
  name: "CategoryIndex"
  queryParams?: string;
}

type CategorySummaryProps = {
  name: "CategorySummary"
  key: string;
  limit?: number;
  queryParams?: string;
}

export type CategoryShowProps = {
  name: "CategoryShow";
  key: string;
  queryParams?: string;
}

type TransactionIndexProps = {
  name: "TransactionIndex";
  accountSlug: string;
  queryParams?: string;
}

type TransactionShowProps = {
  name: "TransactionShow";
  accountSlug: string;
  key: string;
  queryParams?: string;
}

type UrlBuilderProps =
  | AccountIndexProps
  | AccountShowProps
  | AccountTransferProps
  | BudgetEditProps
  | BudgetItemEventsProps
  | BudgetSetUpProps
  | BudgetShowProps
  | CategoryIndexProps
  | CategoryShowProps
  | CategorySummaryProps
  | TransactionIndexProps
  | TransactionShowProps

const UrlBuilder = (props: UrlBuilderProps) => {
  const { name, queryParams } = props

  const appendQueryParams = (url: string) => {
    if (!!queryParams) {
      return `${url}?${queryParams}`
    }
    return url
  }

  switch (name) {
    case "AccountIndex":
      return appendQueryParams("/accounts");
    case "AccountShow":
      return appendQueryParams(`/account/${props.key}`);
    case "AccountTransfer":
      return appendQueryParams("/accounts/transfer");
    case "BudgetEdit":
      return appendQueryParams(`/budget/${props.month}/${props.year}`);
    case "BudgetItemEvents":
      return appendQueryParams(`/budget/events/${props.month}/${props.year}`);
    case "BudgetSetUp":
      return appendQueryParams(`/budget/${props.month}/${props.year}/set-up`);
    case "BudgetShow":
      return appendQueryParams(`/budget/${props.month}/${props.year}`);
    case "CategoryIndex":
      return appendQueryParams("/budget/categories");
    case "CategorySummary":
      return appendQueryParams(`/data/budget/category/${props.key}/recent-summaries/${props.limit || ""}`);
    case "CategoryShow":
      return appendQueryParams(`/budget/category/${props.key}`);
    case "TransactionIndex":
      return appendQueryParams(`/account/${props.accountSlug}/transaction`);
    case "TransactionShow":
      return appendQueryParams(`/account/${props.accountSlug}/transaction/${props.key}`);
  }
}

export { UrlBuilder }
