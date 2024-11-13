import { ModeledTransaction } from "@/lib/models/transaction";
import { StripedRow } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Button } from "@/components/common/Button";
import { TransactionForm } from "@/pages/accounts/transactions/form";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { useContext } from "react";
import { AppConfigContext } from "@/components/layout/Provider";

type ComponentProps = {
  isCashFlow?: boolean;
  isFormShown: boolean;
  closeForm: () => void;
  openForm: () => void;
}

const AddNewComponent = (props: ComponentProps) => {
  const {
    isFormShown,
    closeForm,
    openForm
  } = props

  const { appConfig } = useContext(AppConfigContext)
  const { isCashFlow, key: accountKey, slug: accountSlug } = appConfig.account

  if (isFormShown) {
    const transaction: ModeledTransaction = {
      key: generateKeyIdentifier(),
      accountKey,
      accountSlug,
      amount: 0,
      checkNumber: "",
      clearanceDate: null,
      description: "",
      details: [
        {
          key: generateKeyIdentifier(),
          amount: 0,
          budgetItemKey: null,
          budgetCategoryName: "",
          iconClassName: null
        }
      ],
      isBudgetExclusion: !isCashFlow,
      isCleared: false,
      isPending: false,
      notes: "",
      updatedAt: ""
    }

    return (
      <TransactionForm
        transaction={transaction}
        closeForm={closeForm}
        isNew={true}
      />
    )

  } else {
    return (
      <StripedRow
        styling={{
          flexAlign: "justify-start",
          flexWrap: "flex-wrap",
          padding: "p-2",
          margin: "mt-1",
        }}
      >
        <div className="flex w-full sm:w-6/12">
          <Cell
            styling={{
              width: "w-full",
              flexAlign: "justify-start",
              display: "flex",
            }}
          >
            <div className="w-[6%]">
            </div>
            <Button
              type="button"
              onClick={openForm}
              styling={{ color: "text-blue-400", fontWeight: "font-semibold" }}
            >
              Add new
            </Button>
          </Cell>
        </div>
      </StripedRow>
    )
  }
}

export { AddNewComponent }
