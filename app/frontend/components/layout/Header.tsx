import { useContext } from "react";
import { HeaderButtons } from "./HeaderButtons";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Summary } from "@/components/layout/BudgetSummary";
import { Icon } from "@/components/common/Icon";
import { ActionAnchorTag } from "@/components/common/Link";
import { AppConfigContext } from "@/components/layout/Provider";
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
    <Row styling={{ backgroundColor: "bg-white", flexAlign: "justify-between", flexWrap: "flex-wrap"}}>
      <Cell
        styling={{
          bgColor: "bg-gradient-to-l from-slate-200 to-slate-400",
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
          bgColor: "sm:bg-gradient-to-r from-slate-200 to-slate-400 bg-gradient-to-l",
          display: "flex",
          flexAlign: "justify-end",
          flexDirection: "flex-row-reverse",
          padding: "p-1",
          width: "w-full sm:w-6/12"
        }}
      >
        <Cell styling={{ width: "lg:w-4/12 w-2/12", textAlign: "text-right", padding: "pr-4 py-4" }}>
          <ActionAnchorTag title="Configurations" onClick={toggleConfigMenu}>
            <Icon name="bars" />
          </ActionAnchorTag>
        </Cell>
        <Cell styling={{width: "lg:w-8/12 w-full"}}>
          <Summary metadata={metadata} data={data} selectedAccount={selectedAccount} />
        </Cell>
      </Cell>
    </Row>
  )
}

export { Header }
