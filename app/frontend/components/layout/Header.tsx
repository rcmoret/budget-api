import { useContext } from "react";
import { HeaderButtons } from "./HeaderButtons";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Summary } from "@/components/layout/BudgetSummary";
import { Icon } from "@/components/common/Icon";
import { ActionAnchorTag } from "@/components/common/Link";
import { AppConfigContext, TAppConfig } from "@/components/layout/Provider";
import { Point } from "../common/Symbol";

const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full">
    <Point>
      <span className="text-blue-600">{children}</span>
    </Point>
  </div>
)

const OptionalMenuItem = ({ isVisible, onClick, copy }: { isVisible: boolean; onClick: () => void, copy: string }) => {
  if (!isVisible) return

  return (
    <ActionAnchorTag onClick={onClick}>
      <MenuItem>
        {copy}
      </MenuItem>
    </ActionAnchorTag>
  )
}

type OptionsMenuProps = {
 appConfig: TAppConfig;
 setAppConfig: (props: TAppConfig) => void; 
 namespace: string;
}
const OptionsMenu = ({ appConfig, setAppConfig, namespace }: OptionsMenuProps) => {
  const toggleAccruals = () => setAppConfig({
    ...appConfig,
    budget: { ...appConfig.budget, showAccruals: !appConfig.budget.showAccruals }
  })
  const toggleClearedMonthly = () => setAppConfig({
    ...appConfig,
    budget: { ...appConfig.budget, showClearedMonthly: !appConfig.budget.showClearedMonthly }
  })
  const toggleDeletedItems = () => setAppConfig({
    ...appConfig,
    budget: { ...appConfig.budget, showDeletedItems: !appConfig.budget.showDeletedItems }
  })
  const isBudget = namespace === "budget"

  return (
    <Row styling={{ padding: "px-2 py-3", flexWrap: "flex-wrap"}}>
      <Cell styling={{ width: "w-full md:w-6/12"}}>
        <ActionAnchorTag onClick={toggleAccruals}>
          <MenuItem>
            {appConfig.budget.showAccruals ? "Hide" : "Show"} Accruals
          </MenuItem>
        </ActionAnchorTag>
        <OptionalMenuItem
          isVisible={isBudget}
          onClick={toggleClearedMonthly}
          copy={appConfig.budget.showClearedMonthly ? "Hide Cleared Monthly Items" : "Show Cleared Monthly Items"}
        />
        <OptionalMenuItem
          isVisible={isBudget}
          onClick={toggleDeletedItems}
          copy={appConfig.budget.showDeletedItems ? "Hide Deleted Items" : "Show Deleted Items"}
        />
      </Cell>
      <Cell styling={{ width: "w-full md:w-6/12"}}>
        <MenuItem>
          Manage Budget Categories
        </MenuItem>
        <MenuItem>
          Manage Accounts
        </MenuItem>
      </Cell>
    </Row>
  )
}

const Header = ({ children }: any) => {
  const { namespace } = children.props.metadata;
  let accountPath = ""
  if (children.props.metadata.prevSelectedAccountPath) {
    accountPath = children.props.metadata.prevSelectedAccountPath
  }
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const toggleConfigMenu = () => setAppConfig({
      ...appConfig,
      showConfigMenu: !appConfig.showConfigMenu
  })

  return (
    <div class="bg-slate-400 w-11/12 mx-auto h-dvh">
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
          <Cell styling={{width: "lg:w-4/12 w-2/12", textAlign: "text-right", padding: "pr-4 py-4"}}>
            <ActionAnchorTag title="Configurations" onClick={toggleConfigMenu}>
              <Icon name="bars" />
            </ActionAnchorTag>
          </Cell>
          <Cell styling={{width: "lg:w-8/12 w-full"}}>
            <Summary {...children.props} />
          </Cell>
        </Cell>
        {appConfig.showConfigMenu && <OptionsMenu appConfig={appConfig} setAppConfig={setAppConfig} namespace={namespace}/>}
      </Row>
    </div>
  )
}

export { Header }
