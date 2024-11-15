import React, { useContext, useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { ModeledTransaction } from "@/lib/models/transaction";
import DatePicker from "react-datepicker";
import { parseISO as parseIsoDate } from "date-fns";
import { AppConfigContext } from "@/components/layout/Provider";
import { Icon } from "@/components/common/Icon";
import { buildQueryParams } from "@/lib/redirect_params"
import { Label } from "@/pages/accounts/transactions/form/Shared";
import { BudgetItemsComponent } from "@/pages/accounts/transactions/form/LineItems";
import { ActionAnchorTag } from "@/components/common/Link";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { Button } from "@/components/common/Button";
import Select, { SingleValue } from "react-select";

type InputProps = {
  name: string;
  value: string | number | boolean;
}

const ClearanceDateComponent = (props: {
  clearanceDate: string | null,
  updateFormData: (props: InputProps) => void
}) => {
  const { updateFormData } = props
  const clearanceDate = !!props.clearanceDate ?
    parseIsoDate(props.clearanceDate) :
    null

  const onChange = (input: Date | null) => {
    updateFormData({
      name: "clearanceDate",
      value: (input?.toISOString().split("T")[0] || "")
    })
  }

  return (
    <div className="mr-4">
      <Label label="Clearance Date" />
      <DatePicker
        selected={clearanceDate}
        onChange={onChange}
      />
    </div>
  )
}

const DescriptionComponent = (props: {
  description: string,
  updateFormData: (props: InputProps) => void
}) => {
  const onChange = (
    ev: React.ChangeEvent & { target: HTMLInputElement },
  ) => {
    props.updateFormData({ name: ev.target.name, value: ev.target.value })
  }

  return (
    <div className="mr-4">
      <Label label="Description">
        <span className="italic text-xs">* optional</span>
      </Label>
      <input
        value={props.description}
        name="description"
        onChange={onChange}
        style={{ width: "90%" }}
      />
    </div>
  )
}

const CheckNumberComponent = (props: {
  updateFormData: (props: InputProps) => void;
  checkNumber: string | null 
}) => {
  const { checkNumber, updateFormData } = props
  const [showInput, setShowInput] = useState<boolean>(!!checkNumber)
  const toggleInput = () => setShowInput(!showInput)
  const onChange = (
    ev: React.ChangeEvent & { target: HTMLInputElement },
  ) => updateFormData({ name: ev.target.name, value: ev.target.value })

  if (showInput) {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <Icon name="money-check" />
        </Button>
        {" "}
        Check Number
        <div>
          <input
            value={checkNumber || ""}
            name="checkNumber"
            onChange={onChange}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <Icon name="money-check" />
        </Button>
      </div>
    )
  }
}

const NotesComponent = (props: {
  updateFormData: (props: InputProps) => void;
  notes: string | null 
}) => {
  const { notes, updateFormData } = props
  const [showInput, setShowInput] = useState<boolean>(!!notes)
  const toggleInput = () => setShowInput(!showInput)
  const onChange = (
    ev: React.ChangeEvent & { target: HTMLTextAreaElement },
  ) => updateFormData({ name: ev.target.name, value: ev.target.value })

  // TODO: add a popover
  // to explain <br>
  // and !!!
  if (showInput) {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <Icon name="sticky-note" />
        </Button>
        {" "}
        Notes
        <div>
          <textarea
            value={notes || ""}
            name="notes"
            onChange={onChange}
            className="border border-gray-400 border-solid rounded w-full"
          />
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <Icon name="sticky-note" />
        </Button>
      </div>
    )
  }
}

const BudgetExclusionComponent = (props: {
  updateFormData: (props: InputProps) => void;
  isBudgetExclusion: boolean;
}) => {
  const { isBudgetExclusion, updateFormData } = props
  const { appConfig } = useContext(AppConfigContext)
  const { isCashFlow } = appConfig.account
  const onChange = () => {
    updateFormData({ name: "isBudgetExclusion", value: !isBudgetExclusion })
  }

  if (isCashFlow) {
    return null
  }

  return (
    <div>
      <div>Budget Exclusion?</div>
      <input
        type="checkbox"
        onChange={onChange}
        checked={isBudgetExclusion}
      />
    </div>
  )
}

const AccountSelectComponent = (props: {
  accountKey: string;
  updateFormData: (props: InputProps) => void;
}) => {
  const { appConfig } = useContext(AppConfigContext)
  const options = appConfig.accounts.map((account) => {
    return { label: account.name, value: account.key }
  })

  const value = options.find((option) => option.value === props.accountKey) || ""
  const onChange = (ev: SingleValue<{ label: string; value: string; }>) => {
    props.updateFormData({ name: "accountKey", value: (ev?.value || "") })
  }

  return (
    <Select
      options={options}
      value={value}
      // @ts-ignore
      onChange={onChange}
    />
  )
}

export type TFormDetail = {
  key: string;
  budgetItemKey: string | null;
  amount: TInputAmount;
  _destroy: boolean;
}

const TransactionForm = (props: {
  transaction: ModeledTransaction;
  isNew?: boolean;
  closeForm: () => void;
}) => {
  const { appConfig } = useContext(AppConfigContext)
  const { transaction, closeForm } = props;
  const {
    key,
    accountKey,
    accountSlug,
    checkNumber,
    clearanceDate,
    description,
    isBudgetExclusion,
    notes,
  } = transaction
  const isNew = !!props.isNew

  const details: Array<TFormDetail> = transaction.details.map((detail) => {
    return {
      key: detail.key,
      budgetItemKey: detail.budgetItemKey,
      amount: inputAmount({ cents: detail.amount }),
      _destroy: false
    }
  })
  const { data, setData, transform, processing, put } = useForm({
    accountKey,
    checkNumber,
    clearanceDate,
    description,
    details,
    isBudgetExclusion,
    notes,
  })

  // @ts-ignore
  transform(() => {
    const { details, ...transaction } = data
    return {
      transaction: {
        ...transaction,
        detailsAttributes: details.map((detail) => {
          if (!detail._destroy) {
            return { key: detail.key, budgetItemKey: detail.budgetItemKey, amount: detail.amount.cents }
          } else {
            return { key: detail.key, _destroy: true }
          }
        })
      }
    }
  })

  const updateFormData = (props: InputProps) => {
    setData({ ...data, [props.name]: props.value })
  }

  const removeDetail = (key: string) => {
    setData({
      ...data,
      details: data.details.map((detail) => {
        return detail.key === key ? { ...detail, _destroy: true } : detail
      })
    })
  }

  const addDetail = () => {
    setData({
      ...data,
      details: [
        ...data.details,
        {
          key: generateKeyIdentifier(),
          amount: inputAmount({ display: "" }),
          budgetItemKey: null,
          _destroy: false
        }
      ],
    })
  }

  const updateDetailItem = (props: {
    index: number,
    value: string | null
  }) => {
    const { value } = props

    setData({
      ...data,
      details: data.details.map((detail, index) => {
        return props.index === index ? { ...detail, budgetItemKey: value } : detail
      })
    })
  }

  const updateDetailAmount = (props: {
    index: number,
    value: TInputAmount
  }) => {
    const { value } = props

    setData({
      ...data,
      details: data.details.map((detail, index) => {
        return props.index === index ? { ...detail, amount: value } : detail
      })
    })
  }

  const formDetails = data.details.filter((detail) => !detail._destroy)

  const queryParams = buildQueryParams([
    "account",
    accountSlug,
    "transactions",
    appConfig.budget.data.month,
    appConfig.budget.data.year,
  ])

  const formUrl = UrlBuilder({
    name: "TransactionShow",
    accountSlug,
    key,
    queryParams
  })

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    put(formUrl, { onSuccess: () => props.closeForm() })
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="w-full flex flex-row gap-2">
        <div className="hidden">{key}</div>
        <div className="mr-4">
          <ActionAnchorTag onClick={closeForm}>
            <Icon name="times-circle" />
          </ActionAnchorTag>
        </div>
        <ClearanceDateComponent
          clearanceDate={data.clearanceDate}
          updateFormData={updateFormData}
        />
        <DescriptionComponent
          description={String(data.description)}
          updateFormData={updateFormData}
        />
        <BudgetItemsComponent
          details={formDetails}
          addDetail={addDetail}
          removeDetail={removeDetail}
          updateDetailAmount={updateDetailAmount}
          updateDetailItem={updateDetailItem}
        />
        <div className="flex flex-col w-2/12">
          <CheckNumberComponent
            checkNumber={data.checkNumber}
            updateFormData={updateFormData}
          />
          <NotesComponent
            notes={data.notes}
            updateFormData={updateFormData}
          />
          <BudgetExclusionComponent
            isBudgetExclusion={data.isBudgetExclusion}
            updateFormData={updateFormData}
          />
          {!isNew &&
            <AccountSelectComponent
              updateFormData={updateFormData}
              accountKey={data.accountKey}
            />}
        </div>
        <div className="text-right">
          <button disabled={processing} type="submit" >
            <span className="text-green-700">
              <Icon name="check-circle" />
            </span>
          </button>
        </div>
      </div>
    </form>
  )
};

export { TransactionForm }
