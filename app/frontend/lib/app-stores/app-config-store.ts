import { AppRoutesType, Metadata, RouteName } from "@/types/page_props";
import { useEffect } from "react";
import { create } from "zustand";

type AppConfigState = {
  appRoutes: AppRoutesType;
  budgetEventsRoute: string;
  namespace: string;
  pageName: null | string;
  redirectSegments: Array<string>;
  showAccruals: boolean;
  toggleShowAccruals: () => void;
};

const useAppConfigStore = create<AppConfigState>((set) => ({
  namespace: "",
  budgetEventsRoute: "",
  pageName: null,
  appRoutes: {
    accountMenuRoute: "",
    budgetDashboardRoute: "",
    createBudgetEventsRoute: "",
    currentRoute: "",
    manageAccountsRoute: "",
    manageBudgetCategoriesRoute: "",
    userSignOutRoute: "",
  },
  redirectSegments: [],
  showAccruals: false,
  toggleShowAccruals: () => set((s) => ({ showAccruals: !s.showAccruals })),
}));

const useNamespace = () => useAppConfigStore((s) => s.namespace);
const useShowAccruals = () => useAppConfigStore((s) => s.showAccruals);
const useToggleShowAccruals = () =>
  useAppConfigStore((s) => s.toggleShowAccruals);
const getRedirectQueryParams = () => {
  const redirectSegments = useAppConfigStore((s) => s.redirectSegments);

  return redirectSegments
    .map((segment) => {
      return ["redirect[segments][]", segment]
        .map((str) => encodeURIComponent(str))
        .join("=");
    })
    .join("&");
};

const getBudgetEventsRoute = () =>
  useAppConfigStore((s) => s.budgetEventsRoute);
const useAppRoutes = (routeName: RouteName) =>
  useAppConfigStore((s) => s.appRoutes[routeName]);

const useInitAppConfigStore = (props: {
  appRoutes: AppRoutesType;
  metadata: Metadata;
  redirectSegments: Array<string>;
}) => {
  const { budgetEventsRoute, namespace, pageName } = props.metadata;
  const { appRoutes, redirectSegments } = props;

  useEffect(() => {
    useAppConfigStore.setState({
      appRoutes,
      budgetEventsRoute,
      namespace,
      pageName,
      redirectSegments,
    });
  }, [appRoutes, budgetEventsRoute, namespace, pageName, redirectSegments]);
};

export {
  getBudgetEventsRoute,
  getRedirectQueryParams,
  useAppConfigStore,
  useAppRoutes,
  useInitAppConfigStore,
  useNamespace,
  useShowAccruals,
  useToggleShowAccruals,
};
