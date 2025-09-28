import { ModeledTransaction } from "@/lib/models/transaction";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Button } from "@/components/common/Button";
import { TransactionForm } from "@/pages/accounts/transactions/form";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { useContext } from "react";
import { AppConfigContext } from "@/components/layout/Provider";

type ComponentProps = {
  index: number;
  isCashFlow?: boolean;
  isFormShown: boolean;
  closeForm: () => void;
  openForm: () => void;
  month: number;
  year: number;
}

const AddNewComponent = (props: ComponentProps) => {
  const {
    index,
    isFormShown,
    closeForm,
    openForm,
    month,
    year
  } = props

  const { appConfig } = useContext(AppConfigContext)
  const { isCashFlow, key: accountKey, slug: accountSlug } = appConfig.account
  const isEven = props.index % 2 === 0

  const bgColor = isEven ? "bg-sky-50" : "bg-sky-100"

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
      shortClearanceDate: null,
      updatedAt: ""
    }

    const onSuccess = () => {
      closeForm()
      openForm()
    }

    return (
      <TransactionForm
        index={index}
        transaction={{...transaction, balance: 0 }}
        onSuccess={onSuccess}
        closeForm={closeForm}
        month={month}
        year={year}
        isNew={true}
      />
    )

  } else {
    return (
      <Row
        styling={{
          backgroundColor: bgColor,
          flexAlign: "justify-start",
          flexWrap: "flex-wrap",
          padding: "p-4",
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
            <Button
              type="button"
              onClick={openForm}
              styling={{ color: "text-blue-300", fontWeight: "font-semibold" }}
            >
              Add new
            </Button>
          </Cell>
        </div>
      </Row>
    )
  }
}

export { AddNewComponent }
