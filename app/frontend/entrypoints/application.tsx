import "vite/modulepreload-polyfill";
import "@/css/main.css";

import { createInertiaApp, usePage } from "@inertiajs/react";
import { createRoot, type Root } from "react-dom/client";
import type { ReactNode } from "react";
import { PageProps } from "@/types/page_props";
import { useInitAppConfigStore } from "@/lib/app-stores/app-config-store";
import { useInitTheme } from "@/lib/app-stores/theme-store";
import { initNavigationLinks } from "@/layout/account-navigation-store";
import { useInitNotificationStore } from "@/lib/app-stores/notification-store";

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => {
  const { props } = usePage<{ pageData: PageProps }>();
  const { pageData } = props;
  const { accountLinks, appRoutes, metadata, notifications, redirectSegments } =
    pageData;

  useInitAppConfigStore({
    appRoutes,
    metadata,
    redirectSegments,
  });
  useInitTheme();
  initNavigationLinks(accountLinks);
  useInitNotificationStore(notifications);

  return <>{children}</>;
};

// Server-rendered pages (e.g. Devise) share this entry point but have no
// Inertia root, so skip mounting when there's no page payload to resolve.
if (document.getElementById("app")?.dataset.page) {
  createInertiaApp({
    resolve: (name) => {
      const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
      const page = (pages[`../pages/${name}.tsx`] ??
        pages[`../pages/${name}/index.tsx`]) as any;

      page.default.layout =
        page.default.layout ||
        ((pageEl: ReactNode) => (
          <ApplicationLayout>{pageEl}</ApplicationLayout>
        ));

      return page;
    },
    setup({ el, App, props }) {
      // Reuse the existing root across Vite HMR re-runs instead of calling
      // createRoot() on the same element more than once.
      const container = el as HTMLElement & { _reactRoot?: Root };
      container._reactRoot ??= createRoot(container);
      container._reactRoot.render(<App {...props} />);
    },
  });
}
