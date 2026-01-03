import { Cell } from "@/components/common/Cell";
import { Point } from "@/components//common/Symbol";
import { Row } from "@/components/common/Row";
import { useAppConfigContext } from "@/components/layout/Provider";
import { Link as InertiaLink } from "@inertiajs/react";
import { DateFormatter } from "@/lib/DateFormatter";
import { Button } from "@/components//common/Button";
import { AccountSummary } from "@/types/account";
import { byPriority as sortByPriority } from "@/lib/sort_functions";

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

const SetUpLink = ({ isBudget }: { isBudget: boolean }) => {
  const { appConfig } = useAppConfigContext()
  const { isSetUp, month, year } = appConfig.budget.data
  if (!isBudget || !!isSetUp) { return }

  return (
    <InertiaLink href={`/budget/${month}/${year}/set-up`}>
      <MenuItem>
        Set up {DateFormatter({ month, year, format: "monthYear" })}
      </MenuItem>
    </InertiaLink>

  )
}

const FinalizeLink = ({ isBudget }: { isBudget: boolean }) => {
  const { appConfig } = useAppConfigContext()
  const { isSetUp, isClosedOut, month, year } = appConfig.budget.data
  if (!isSetUp || !isBudget || !!isClosedOut) { return }

  return (
    <InertiaLink href={`/budget/${month}/${year}/finalize`}>
      <MenuItem>
        Finalize {DateFormatter({ month, year, format: "monthYear" })}
      </MenuItem>
    </InertiaLink>

  )
}

const AccountLinks = (props: { accounts: AccountSummary[] }) => {
  return (
    <>
      <Point>
        Visit Account:
      </Point>
      {props.accounts.sort(sortByPriority).map((account) => (
        <div className="ml-4">
          <InertiaLink href={`/accounts/${account.slug}`}>
            <Point>
              {account.name}
            </Point>
          </InertiaLink>
        </div>
      ))}
    </>
  )
}

const OptionsMenu = (props: { accounts: AccountSummary[], namespace: string }) => {
  const { accounts, namespace } = props
  const { toggles } = useAppConfigContext()

  const {
    showAccruals,
    toggleAccruals,
    showClearedMonthly,
    toggleClearedMonthly,
    showDeletedItems,
    toggleDeletedItems,
    showOptionsMenu,
    showTransferForm,
    toggleTransferForm
  } = toggles

  if (!showOptionsMenu) return null

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
        {namespace !== "accounts" && <AccountLinks accounts={accounts} />}
        <OptionalMenuItem
          isVisible={!isBudget}
          onClick={toggleTransferForm}
          copy={showTransferForm ? "Hide Transfer Form" : "Show Transfer Form"}
          />
        <div>
          <SetUpLink isBudget={isBudget} />
        </div>
        <div>
          <FinalizeLink isBudget={isBudget} />
        </div>
      </Cell>
      <Cell styling={{ width: "w-full md:w-4/12" }}>
        <div className="w-full text-lg border-b-2 border-yellow-400">
          Config
        </div>
        <div>
          <Button type="button" onClick={toggleAccruals}>
            <MenuItem>
              {showAccruals ? "Hide" : "Show"} Accruals
            </MenuItem>
          </Button>
        </div>
        <OptionalMenuItem
          isVisible={isBudget}
          onClick={toggleClearedMonthly}
          copy={showClearedMonthly ? "Hide Cleared Monthly Items" : "Show Cleared Monthly Items"}
        />
        <OptionalMenuItem
          isVisible={isBudget}
          onClick={toggleDeletedItems}
          copy={showDeletedItems ? "Hide Deleted Items" : "Show Deleted Items"}
        />
      </Cell>
    </Row>
  )
}

export { OptionsMenu }
