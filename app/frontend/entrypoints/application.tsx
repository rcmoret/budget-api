import "vite/modulepreload-polyfill";
import "@/css/main.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { PageLayout } from "@/layout";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
    return (pages[`../pages/${name}.tsx`] ??
      pages[`../pages/${name}/index.tsx`]) as any;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <PageLayout metadata={props.initialPage.props.metadata}>
        <App {...props} />
      </PageLayout>,
    );
  },
});
