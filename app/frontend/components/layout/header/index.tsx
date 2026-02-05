import { AccountBudgetSummary, SelectedAccount } from "@/types/budget";
import { ActionIconButton } from "@/lib/theme/buttons/action-button";
import { Button } from "@/components/common/Button";
import { Cell } from "@/components/common/Cell";
import { DiscretionaryData } from "types/budget";
import { HeaderButtons } from "./buttons";
import { HeaderLinks } from "./links";
import { Icon } from "@/components/common/Icon";
import { Row } from "@/components/common/Row";
import { Summary } from "@/components/layout/BudgetSummary";
import { outlineColor } from "@/lib/theme/colors";
import { useAppConfigContext } from "@/components/layout/Provider";

type BudgetIndexPageData = {
  name: "budget/index";
};

export type BudgetFinalizePageData = {
  name: "budget/finalize";
  month: number;
  year: number;
  discretionary: DiscretionaryData;
};

type BudgetSetUpPageData = {
  name: "budget/set-up";
  month: number;
  year: number;
};

export type PageData =
  | BudgetIndexPageData
  | BudgetFinalizePageData
  | BudgetSetUpPageData;

type HeaderProps = {
  metadata: {
    namespace: string;
    prevSelectedAccountPath: string | undefined;
    page?: PageData;
  };
  data: AccountBudgetSummary | undefined;
  selectedAccount: SelectedAccount | undefined;
};

const Header = ({ metadata, data, selectedAccount }: HeaderProps) => {
  const { namespace } = metadata;
  let accountPath = "";
  if (metadata.prevSelectedAccountPath) {
    accountPath = metadata.prevSelectedAccountPath;
  }
  const { appConfig, setAppConfig } = useAppConfigContext();
  const toggleConfigMenu = () =>
    setAppConfig({
      ...appConfig,
      showConfigMenu: !appConfig.showConfigMenu,
    });

  return (
    <Row
      styling={{
        backgroundColor: "bg-white",
        padding: "p-2",
        top: "top-0",
      }}
    >
      <Row
        styling={{
          border: `outline outline-2 ${outlineColor("gray")}`,
          padding: "py-1 px-2",
          shadow: "shadow-md",
          flexAlign: "justify-between",
          flexWrap: "flex-wrap",
          rounded: "rounded",
        }}
      >
        <Cell
          styling={{
            padding: "p-1",
            width: "w-full sm:w-6/12",
          }}
        >
          <Cell styling={{ width: "md:w-8/12 w-full" }}>
            <HeaderButtons namespace={namespace} accountPath={accountPath} />
          </Cell>
        </Cell>
        <Cell
          styling={{
            display: "flex",
            flexAlign: "justify-end",
            flexDirection: "flex-row-reverse",
            padding: "p-1",
            width: "w-full sm:w-6/12",
          }}
        >
          <Cell
            styling={{
              width: "lg:w-4/12 w-2/12",
              textAlign: "text-right",
              padding: "pr-4 py-4",
            }}
          >
            <ActionIconButton
              title="Configurations"
              onClick={toggleConfigMenu}
              icon="bars"
              color="black"
            />
          </Cell>
          <Cell styling={{ width: "lg:w-8/12 w-full" }}>
            <Summary
              metadata={metadata}
              data={data}
              selectedAccount={selectedAccount}
            />
          </Cell>
        </Cell>
        <HeaderLinks />
      </Row>
    </Row>
  );
};

export { Header };
