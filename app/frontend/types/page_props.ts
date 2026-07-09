type AppRoutesType = {
  accountMenuRoute: string;
  budgetDashboardRoute: string;
  createBudgetEventsRoute: string;
  currentRoute: string;
  manageAccountsRoute: string;
  manageBudgetCategoriesRoute: string;
  userSignOutRoute: string;
};

type RouteName = keyof AppRoutesType;

type AccountLinkType = {
  name: string;
  slug: string;
  href: string;
  balance: number;
};

type Metadata = {
  budgetEventsRoute: string;
  namespace: string;
  pageName: string;
  userKey: string;
};

type NotificationsCollectionType = {
  alerts: Array<string>;
  info: Array<string>;
  notices: Array<string>;
  warnings: Array<string>;
};

type RedirectSegmentsType = Array<string>;

type PageProps = {
  accountLinks: Array<AccountLinkType>;
  appRoutes: AppRoutesType;
  metadata: Metadata;
  notifications: NotificationsCollectionType;
  redirectSegments: RedirectSegmentsType;
};

export type {
  AppRoutesType,
  AccountLinkType,
  NotificationsCollectionType,
  Metadata,
  PageProps,
  RouteName,
};
