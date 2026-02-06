import { ActionIconButton } from "../buttons/action-button";
import { useToggle } from "@/lib/hooks/useToogle";
import { useContext, createContext } from "react";

type SummaryWithDetailsContextValue = {
  description: string;
  showDetail: boolean;
  toggleShowDetail: () => void;
};

type SummaryWithDetailsProviderProps = {
  children: React.ReactNode;
  description: string;
  initialState?: "shown" | "hidden";
};

const SummaryWithDetailsContext =
  createContext<SummaryWithDetailsContextValue | null>(null);

const CaretComponent = () => {
  const { description, showDetail, toggleShowDetail } =
    useSummaryWithDetailsContext();

  const icon = showDetail ? "caret-down" : "caret-right";
  const title = showDetail
    ? `Hide ${description} details`
    : `Show ${description} details`;

  return (
    <ActionIconButton
      icon={icon}
      color="blue"
      title={title}
      onClick={toggleShowDetail}
    />
  );
};

const DetailWrapper = (props: { children: React.ReactNode }) => {
  const { showDetail } = useSummaryWithDetailsContext();

  return (
    <details className={showDetail ? "" : "hidden"}>{props.children}</details>
  );
};

const SummaryWithDetailsProvider = (
  props: SummaryWithDetailsProviderProps & { children: React.ReactNode },
) => {
  const [showDetail, toggleShowDetail] = useToggle(
    props.initialState === "shown",
  );

  const value: SummaryWithDetailsContextValue = {
    description: props.description,
    showDetail,
    toggleShowDetail,
  };

  return (
    <SummaryWithDetailsContext.Provider value={value}>
      {props.children}
    </SummaryWithDetailsContext.Provider>
  );
};

// Define a hook that will provide the context values
const useSummaryWithDetailsContext = (): SummaryWithDetailsContextValue => {
  const context = useContext(SummaryWithDetailsContext);
  if (!context) {
    throw new Error(
      "useSummaryWithDetailsContext must be used within a SummaryWithDetails Provider",
    );
  }

  return context;
};

// always export:
//   * SummaryWithDetailsProvider
//   * useSummaryWithDetailsContext
// optionally export:
//   * type SummaryWithDetailsProviderProps
// rarely export:
//   * type SummaryWithDetailsContextValue

export {
  CaretComponent,
  DetailWrapper,
  SummaryWithDetailsProvider,
  useSummaryWithDetailsContext,
};
