import { ModeledTransaction } from "@/lib/models/transaction";
import { StripedRow } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Button } from "@/components/common/Button";
import { TransactionForm } from "@/pages/accounts/transactions/form";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";

type ComponentProps = {
  accountKey: string;
  accountSlug: string;
  isFormShown: boolean;
  closeForm: () => void;
  openForm: () => void;
}

const AddNewComponent = (props: ComponentProps) => {
  const {
    accountKey,
    accountSlug,
    isFormShown,
    closeForm,
    openForm
  } = props

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
      isBudgetExclusion: false,
      isCleared: false,
      isPending: false,
      notes: "",
      updatedAt: ""
    }

    return (
      <TransactionForm
        transaction={transaction}
        closeForm={closeForm}
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
