import { LeftColumn } from "@/layout/left-column";
import { Notifications } from "./notifications";
import { RightColumnWrapper } from "@/components/right-column-bordered";

type LayoutProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  rightColumn: React.ReactNode;
  mainComponentClassNames?: Array<string>;
  mainId: string;
};

const HeaderComponent = (props: {
  children?: React.ReactNode;
  rightColumnComponent?: React.ReactNode;
  title?: string;
}) => {
  const title = props.children ?? props.title ?? "Budget Application";
  return (
    <>
      <h1>{title}</h1>
      {props.rightColumnComponent}
    </>
  );
};

const PageComponent = (props: LayoutProps) => {
  const {
    children,
    header,
    mainComponentClassNames = [],
    mainId,
    rightColumn,
  } = props;
  const mainComponentClassName = [
    "grid",
    "gap-2",
    "pt-4",
    "overflow-y-scroll",
    "scrollbar-gutter-stable",
    "with-scroll-fixes",
    ...mainComponentClassNames,
  ].join(" ");

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
    <div className="flex flex-row items-start">
      <LeftColumn />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="grid-page-split">
          {header && <header className={pageHeaderClassName}>{header}</header>}
          <main className={mainComponentClassName} id={mainId}>
            {children}
          </main>
          <aside className="flex flex-col gap-2 py-4 overflow-y-scroll">
            <Notifications />
            <RightColumnWrapper>{rightColumn}</RightColumnWrapper>
          </aside>
        </div>
      </div>
    </div>
  );
};

export { PageComponent, HeaderComponent };
