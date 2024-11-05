type BudgetItemEventsProps = {
  name: "BudgetItemEvents";
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
  | BudgetItemEventsProps
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
    case "BudgetItemEvents":
      return appendQueryParams(`/budget/events/${props.month}/${props.year}`);
    case "BudgetShow":
      return appendQueryParams(`/budget/${props.month}/${props.year}`);
    case "CategoryShow":
      return appendQueryParams(`/budget/category/${props.key}`);
    case "TransactionShow":
      return appendQueryParams(`/account/${props.accountSlug}/transaction/${props.key}`);
  }
}

export { UrlBuilder }
