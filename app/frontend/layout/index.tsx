import { usePage } from "@inertiajs/react";
import { useInitAppConfigStore } from "@/layout/app-config-store";
import { LeftColumn } from "@/layout/left-column";
import { Notifications } from "./notifications";
import { initNavigationLinks } from "./account-navigation-store";
import { PageProps } from "@/types/page_props";

const pageHeadingClassName = [
  "text-2xl",
  "text-content",
  "font-medium",
  "tracking-wide",
].join(" ");

type LayoutProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  rightColumn: React.ReactNode;
  mainComponentClassNames?: Array<string>;
  mainId: string;
};

const PageComponent = (props: LayoutProps) => {
  const { notifications } = usePage<PageProps>().props;
  const { mainComponentClassNames = [] } = props;

  const pageHeaderClassName = [
    "grid-page-header",
    "grid",
    "sticky",
    "top-0",
    "z-10",
    "bg-base-100",
    "grid-cols-subgrid",
    "shadow-lg",
    "col-span-full",
    "items-center",
    "min-h-20",
    "border-b-2",
    "border-secondary",
  ].join(" ");

  return (
    <div className="grid-page-split">
      {props.header && (
        <header className={pageHeaderClassName}>{props.header}</header>
      )}
      <MainComponent classNames={mainComponentClassNames} id={props.mainId}>
        {props.children}
      </MainComponent>
      <aside className="flex flex-col gap-2 py-4 overflow-y-scroll">
        <Notifications notifications={notifications} />
        {props.rightColumn}
      </aside>
    </div>
  );
};

const MainComponent = (props: {
  id: string;
  classNames: Array<string>;
  children: React.ReactNode;
}) => {
  const mainComponentClassName = [
    "grid",
    "gap-2",
    "pt-4",
    "overflow-y-scroll",
    "scrollbar-gutter-stable",
    "with-scroll-fixes",
    ...props.classNames,
  ].join(" ");

  return (
    <main className={mainComponentClassName} id={props.id}>
      {props.children}
    </main>
  );
};

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { props } = usePage<PageProps>();

  useInitAppConfigStore({
    appRoutes: props.appRoutes,
    metadata: props.metadata,
    redirectSegments: props.redirectSegments,
  });
  initNavigationLinks(props.accountLinks);

  return (
    <div className="flex flex-row items-start">
      <LeftColumn />
      <div className="flex-1 flex flex-col min-h-screen">{children}</div>
    </div>
  );
};

export { PageLayout, PageComponent, pageHeadingClassName };
