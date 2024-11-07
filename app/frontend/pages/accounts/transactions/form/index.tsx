import React, { useContext } from "react";
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
import { UrlBuilder, CategoryShowProps } from "@/lib/UrlBuilder";

type InputProps = {
  name: string;
  value: string | number;
}

const ClearanceDateComponent = (props: {
  clearanceDate: string,
  updateFormData: (props: InputProps) => void
}) => {
  const { clearanceDate, updateFormData } = props

  const onChange = (input: Date | null) => {
    updateFormData({
      name: "transaction[clearanceDate]",
      value: (input?.toISOString() || "")
    })
  }

  return (
    <div className="mr-4">
      <Label label="Clearance Date" />
      <DatePicker
        selected={parseIsoDate(clearanceDate)}
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
        name="transaction[description]"
        onChange={onChange}
        style={{ width: "90%" }}
      />
    </div>
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
  closeForm: () => void;
}) => {
  const { appConfig } = useContext(AppConfigContext)
  const { transaction, closeForm } = props;
  const {
    key,
    accountSlug,
    clearanceDate,
    description,
  } = transaction

  const details: Array<TFormDetail> = transaction.details.map((detail) => {
    return {
      key: detail.key,
      budgetItemKey: detail.budgetItemKey,
      amount: inputAmount({ cents: detail.amount }),
      _destroy: false
    }
  })
  const { data, setData, transform, processing, put } = useForm({
    clearanceDate,
    description,
    details,
  })

  // @ts-ignore
  transform((data) => {
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
    value: string
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
      <div className="w-full flex flex-row">
        <div className="hidden">{key}</div>
        <div className="mr-4">
          <ActionAnchorTag onClick={closeForm}>
            <Icon name="times-circle" />
          </ActionAnchorTag>
        </div>
        <ClearanceDateComponent
          clearanceDate={String(data.clearanceDate)}
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
