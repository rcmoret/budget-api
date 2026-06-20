import { useInitAppConfigStore } from "@/layout/app-config-store";
import { LeftColumn } from "@/layout/left-column";
import { Notifications } from "./notifications";

const pageHeadingClassName = [
  "text-2xl",
  "text-content",
  "font-medium",
  "tracking-wide",
].join(" ");

//  removed these from header class
// "md:flex",
// "md:flex-row",
// "md:justify-between",

const pageHeaderClassName = [
  // "grid",
  // "gap-2",
  // "items-center",
  // "py-4",
  // "min-h-20",
  // "border-b",
  // "border-base-200",
].join(" ");

type LayoutProps = {
  metadata: {
    namespace: string;
    pageName: string;
  };
  header?: React.ReactNode;
  children: React.ReactNode;
  rightColumn: React.ReactNode;
  mainComponentClassNames?: Array<string>;
  mainId: string;
};

const PageComponent = (props: LayoutProps) => {
  useInitAppConfigStore(props.metadata.namespace, props.metadata.pageName);

  const { mainComponentClassNames = [] } = props

  const newpageHeaderClassName = [
    "grid",
    "sticky top-0 z-10 bg-base-100 grid-cols-subgrid col-span-full",
    "items-center",
    "min-h-20",
    "border-b-2",
    "border-secondary",
  ].join(" ")

  return (
    <div>
      <div className="grid-page-split">
        {props.header && (
          <div className={newpageHeaderClassName}>{props.header}</div>
        )}
        <MainComponent classNames={mainComponentClassNames} id={props.mainId}>
          {props.children}
        </MainComponent>
        <div className="flex flex-col gap-2 py-4 overflow-y-scroll">
          <Notifications />
          {props.rightColumn}
        </div>
      </div>
    </div>
  );
};

const MainComponent = (props: { id: string; classNames: Array<string>; children: React.ReactNode }) => {
  const mainComponentClassName = [
    "grid",
    "gap-2",
    "pt-4",
    "overflow-y-scroll",
    "scrollbar-gutter-stable",
    ...props.classNames,
  ].join(" ")

  return (
    <main className={mainComponentClassName} id={props.id}>
      {props.children}
    </main>
  )
}

const PageLayout = (props: {
  children: React.ReactNode;
  header: React.ReactNode;
  metadata: {
    namespace: "budget" | "accounts";
  };
}) => {
  return (
    <div className="flex flex-row items-start">
      <LeftColumn />
      <div className="flex-1 flex flex-col min-h-screen">{props.children}</div>
    </div>
  );
};

export { PageLayout, PageComponent, pageHeaderClassName, pageHeadingClassName };
