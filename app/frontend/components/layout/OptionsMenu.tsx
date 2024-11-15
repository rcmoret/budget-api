import { useContext } from "react";
import { ActionAnchorTag } from "@/components/common/Link";
import { Cell } from "@/components/common/Cell";
import { Point } from "../common/Symbol";
import { Row } from "@/components/common/Row";
import { AppConfigContext } from "@/components/layout/Provider";
import { InertiaLink } from "@inertiajs/inertia-react";
import { DateFormatter } from "@/lib/DateFormatter";
import { UrlBuilder } from "@/lib/UrlBuilder";

const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full leading-8">
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

const SetUpLink = ({ month, year, isSetUp }: { month: number, year: number, isSetUp: boolean }) => {
  if (!!isSetUp) { return }

  return (
    <InertiaLink href={`/budget/${month}/${year}/set-up`}>
      <MenuItem>
        Set up {DateFormatter({ month, year, format: "monthYear" })}
      </MenuItem>
    </InertiaLink>

  )
}

const OptionsMenu = ({ namespace }: { namespace: string }) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

  if (!appConfig.showConfigMenu) return null

  const { isSetUp, month, year } = appConfig.budget.data

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
  const toggleMultiItemForm = () => setAppConfig({
    ...appConfig,
    budget: { ...appConfig.budget, multiItemForm: { ...appConfig.budget.multiItemForm, display: !appConfig.budget.multiItemForm.display } }
  })
  const isBudget = namespace === "budget"

  return (
    <Row styling={{
      padding: "px-2 py-3",
      flexAlign: "justify-between",
      flexWrap: "flex-wrap",
      backgroundColor: "bg-slate-300",
      fontSize: "text-sm"
    }}>
      <Cell styling={{ width: "w-full md:w-3/12"}}>
        <InertiaLink href="">
          <MenuItem>
            Manage Budget Categories
          </MenuItem>
        </InertiaLink>
        <InertiaLink href="/accounts/manage">
          <MenuItem>
            Manage Accounts
          </MenuItem>
        </InertiaLink>
      </Cell>
      <Cell styling={{ width: "w-full md:w-3/12"}}>
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
      <Cell styling={{ width: "w-full md:w-3/12"}}>
        <OptionalMenuItem
          isVisible={isBudget}
          onClick={toggleMultiItemForm}
          copy={appConfig.budget.multiItemForm.display ? "Hide Multi-Item Form" : "Show Multi-Item Form"}
        />
      </Cell>
      <Cell styling={{ width: "w-full md:w-3/12"}}>
        <SetUpLink month={month} year={year} isSetUp={isSetUp} />
      </Cell>
    </Row>
  )
}

export { OptionsMenu }
