import { useContext } from "react";
import { Cell } from "@/components/common/Cell";
import { Point } from "@/components//common/Symbol";
import { Row } from "@/components/common/Row";
import { AppConfigContext } from "@/components/layout/Provider";
import { Link as InertiaLink } from "@inertiajs/react";
import { DateFormatter } from "@/lib/DateFormatter";
import { Button } from "@/components//common/Button";

const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full leading-8">
    <Point>
      <span className="text-gray-800">{children}</span>
    </Point>
  </div>
)

const OptionalMenuItem = ({ isVisible, onClick, copy }: { isVisible: boolean; onClick: () => void, copy: string }) => {
  if (!isVisible) return

  return (
    <div>
      <Button type="button" onClick={onClick}>
        <MenuItem>
          {copy}
        </MenuItem>
      </Button>
    </div>
  )
}

const SetUpLink = ({ month, year, isBudget, isSetUp }: { month: number, year: number, isBudget: boolean, isSetUp: boolean }) => {
  if (!isBudget || !!isSetUp) { return }

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
  const isBudget = namespace === "budget"

  return (
    <Row styling={{
      rounded: "rounded",
      padding: "px-2 py-3",
      flexAlign: "justify-start",
      flexWrap: "flex-wrap",
      backgroundColor: "bg-yellow-100",
      margin: "mb-4",
      gap: "gap-8",
      fontSize: "text-sm"
    }}>
      <div className="w-full text-2xl">
        Menu / Options
      </div>
      <Cell styling={{ width: "w-full md:w-4/12"}}>
        <div className="w-full text-lg border-b-2 border-yellow-400">
          Pages
        </div>
        <InertiaLink href="/budget/categories">
          <MenuItem>
            Manage Budget Categories
          </MenuItem>
        </InertiaLink>
        <InertiaLink href="/accounts/manage">
          <MenuItem>
            Manage Accounts
          </MenuItem>
        </InertiaLink>
        <InertiaLink href="/">
          <MenuItem>
            Dashboard
          </MenuItem>
        </InertiaLink>
        <div>
          <SetUpLink month={month} year={year} isSetUp={isSetUp} isBudget={isBudget} />
        </div>
      </Cell>
      <Cell styling={{ width: "w-full md:w-4/12" }}>
        <div className="w-full text-lg border-b-2 border-yellow-400">
          Config
        </div>
        <div>
          <Button type="button" onClick={toggleAccruals}>
            <MenuItem>
              {appConfig.budget.showAccruals ? "Hide" : "Show"} Accruals
            </MenuItem>
          </Button>
        </div>
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
    </Row>
  )
}

export { OptionsMenu }
