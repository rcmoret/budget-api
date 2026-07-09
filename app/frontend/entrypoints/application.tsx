import "vite/modulepreload-polyfill";
import "@/css/main.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { PageLayout } from "@/layout";
import type { ReactNode } from "react";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
    const page = (pages[`../pages/${name}.tsx`] ??
      pages[`../pages/${name}/index.tsx`]) as any;

    page.default.layout =
      page.default.layout ||
      ((pageEl: ReactNode) => <PageLayout>{pageEl}</PageLayout>);

    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
