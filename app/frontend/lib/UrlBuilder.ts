type AccountShowProps = {
  name: "AccountShow";
  key: string;
  queryParams?: string;
}

type AccountIndexProps = {
  name: "AccountIndex";
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

export type CategoryShowProps = {
  name: "CategoryShow";
  key: string;
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
  | BudgetItemEventsProps
  | BudgetSetUpProps
  | BudgetShowProps
  | CategoryShowProps
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
      return appendQueryParams(`/accounts`);
    case "AccountShow":
      return appendQueryParams(`/account/${props.key}`);
    case "BudgetItemEvents":
      return appendQueryParams(`/budget/events/${props.month}/${props.year}`);
    case "BudgetSetUp":
      return appendQueryParams(`/budget/${props.month}/${props.year}/set-up`);
    case "BudgetShow":
      return appendQueryParams(`/budget/${props.month}/${props.year}`);
    case "CategoryShow":
      return appendQueryParams(`/budget/category/${props.key}`);
    case "TransactionShow":
      return appendQueryParams(`/account/${props.accountSlug}/transaction/${props.key}`);
  }
}

export { UrlBuilder }
