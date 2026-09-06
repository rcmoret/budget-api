import { LeftColumn } from "@/layout/left-column";
import { Notifications } from "./notifications";
import { RightColumnWrapper } from "@/components/right-column-bordered";
import { Collapse } from "@/components/collapse";
import { Icon } from "@/components/icon";
import { useToggle } from "@/utils/hooks/useToogle";

type LayoutProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  rightColumn: React.ReactNode;
  mainComponentClassNames?: Array<string>;
  mainId: string;
  secondaryPanelLabel?: string;
};

const SecondaryPanel = (props: {
  label: string;
  rightColumn: React.ReactNode;
}) => {
  const [isOpen, toggleOpen] = useToggle(false);

  if (!props.rightColumn) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggleOpen}
        className="md:hidden sticky bottom-0 z-10 flex items-center justify-between px-3 py-3 bg-base-200 rounded-field font-semibold text-sm"
      >
        <span>{props.label}</span>
        <span
          className={[
            "inline-block transition-transform",
            isOpen ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <Icon name="caret-down" />
        </span>
      </button>
      <Collapse open={isOpen} className="md:grid-rows-[minmax(0,1fr)]">
        <RightColumnWrapper>{props.rightColumn}</RightColumnWrapper>
      </Collapse>
    </>
  );
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
    secondaryPanelLabel = "Details & filters",
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
    "grid-cols-[1fr_auto]",
    "md:grid-cols-subgrid",
    "sticky",
    "top-0",
    "z-10",
    "bg-base-100",
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
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <div className="grid-page-split">
          {header && <header className={pageHeaderClassName}>{header}</header>}
          <main className={mainComponentClassName} id={mainId}>
            {children}
          </main>
          <aside className="flex flex-col gap-2 py-4">
            <Notifications />
            <SecondaryPanel label={secondaryPanelLabel} rightColumn={rightColumn} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export { PageComponent, HeaderComponent };
