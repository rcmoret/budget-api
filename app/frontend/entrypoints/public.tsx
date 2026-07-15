import "vite/modulepreload-polyfill";
import "@/css/main.css";

import { createRoot, type Root } from "react-dom/client";
import { PublicShell } from "@/layout/public-shell";
import { NotificationsCollectionType } from "@/types/page_props";

const emptyNotifications: NotificationsCollectionType = {
  alerts: [],
  info: [],
  notices: [],
  warnings: [],
};

type PublicPageData = {
  notifications: NotificationsCollectionType;
};

// Server-rendered pages hand data to the client through a JSON script tag
// (#public-page-data) instead of Inertia's page props.
const readPublicPageData = (): PublicPageData => {
  const el = document.getElementById("public-page-data");
  if (!el?.textContent) return { notifications: emptyNotifications };
  try {
    return JSON.parse(el.textContent) as PublicPageData;
  } catch {
    return { notifications: emptyNotifications };
  }
};

const mount = document.getElementById("public-shell") as
  | (HTMLElement & { _reactRoot?: Root })
  | null;

if (mount) {
  const { notifications } = readPublicPageData();
  // Reuse the existing root across Vite HMR re-runs instead of calling
  // createRoot() on the same element more than once.
  mount._reactRoot ??= createRoot(mount);
  mount._reactRoot.render(<PublicShell notifications={notifications} />);
}
