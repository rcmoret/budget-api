import { useInitAppConfigStore } from "@/layout/app-config-store";
import { LeftColumn } from "@/layout/left-column";
import { Notifications } from "./notifications";

const pageHeadingClassName = [
  "text-2xl",
  "text-content",
  "font-medium",
  "tracking-wide",
].join(" ");

const pageHeaderClassName = [
  "grid",
  "gap-1",
  "md:flex",
  "md:flex-row",
  "md:justify-between",
  "items-center",
  "p-4",
  "min-h-20",
  "border-b",
  "border-base-200",
].join(" ");

type LayoutProps = {
  namespace: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  rightColumn: React.ReactNode;
};

const MainComponent = (props: LayoutProps) => {
  useInitAppConfigStore(props.namespace);

  return (
    <div>
      {props.header && (
        <div className="sticky top-0 z-10 bg-base-100">{props.header}</div>
      )}
      <div className="grid-page-split">
        <div className="flex flex-col gap-2 p-4 overflow-y-auto">
          {props.children}
        </div>
        <div className="flex flex-col gap-2 p-4 overflow-y-auto">
          <Notifications />
          {props.rightColumn}
        </div>
      </div>
    </div>
  );
};

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

export { PageLayout, MainComponent, pageHeaderClassName, pageHeadingClassName };
