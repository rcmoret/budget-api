import { useContext } from "react";
import { HeaderButtons } from "./HeaderButtons";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Summary } from "@/components/layout/BudgetSummary";
import { Icon } from "@/components/common/Icon";
import { AppConfigContext } from "@/components/layout/Provider";
import { Button } from "@/components/common/Button";
import { AccountBudgetSummary, SelectedAccount } from "@/types/budget";

type BudgetIndexPageData = {
  name: "budget/index";
}

export type BudgetFinalizePageData = {
  name: "budget/finalize";
  month: number;
  year: number;
}

type BudgetSetUpPageData = {
  name: "budget/set-up";
  month: number;
  year: number;
}

export type PageData = BudgetIndexPageData | BudgetFinalizePageData | BudgetSetUpPageData

type HeaderProps = {
  metadata: {
    namespace: string;
    prevSelectedAccountPath: string | undefined;
    page?: PageData;
  };
  data: AccountBudgetSummary | undefined;
  selectedAccount: SelectedAccount | undefined;
}

const Header = ({ metadata, data, selectedAccount }: HeaderProps) => {
  const { namespace } = metadata;
  let accountPath = ""
  if (metadata.prevSelectedAccountPath) {
    accountPath = metadata.prevSelectedAccountPath
  }
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const toggleConfigMenu = () => setAppConfig({
      ...appConfig,
      showConfigMenu: !appConfig.showConfigMenu
  })

  return (
    <Row styling={{
      backgroundColor: "bg-gradient-to-l from-gray-50 to-gray-200",
      padding: "p-4",
      position: "sticky",
      top: "top-0"
    }}>
      <Row
        styling={{
          border: "border-2 border-sky-600",
          flexAlign: "justify-between",
          flexWrap: "flex-wrap",
          rounded: "rounded"
        }}
      >
        <Cell
          styling={{
            padding: "p-1",
            width: "w-full sm:w-6/12"
          }}
        >
          <Cell styling={{width: "md:w-8/12 w-full"}}>
            <HeaderButtons namespace={namespace} accountPath={accountPath} />
          </Cell>
        </Cell>
        <Cell
          styling={{
            display: "flex",
            flexAlign: "justify-end",
            flexDirection: "flex-row-reverse",
            padding: "p-1",
            width: "w-full sm:w-6/12"
          }}
        >
          <Cell styling={{ width: "lg:w-4/12 w-2/12", textAlign: "text-right", padding: "pr-4 py-4" }}>
            <Button
              type="button"
              title="Configurations"
              onClick={toggleConfigMenu}
          >
              <Icon name="bars" />
            </Button>
          </Cell>
          <Cell styling={{width: "lg:w-8/12 w-full"}}>
            <Summary metadata={metadata} data={data} selectedAccount={selectedAccount} />
          </Cell>
        </Cell>
      </Row>
    </Row>
  )
}

export { Header }
