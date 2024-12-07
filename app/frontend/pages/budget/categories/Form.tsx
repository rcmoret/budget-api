import { UrlBuilder } from "@/lib/UrlBuilder";
import { BudgetCategory } from "@/types/budget"
import { useForm } from "@inertiajs/react";
import { buildQueryParams } from "@/lib/redirect_params"
import { AmountInput, inputAmount } from "@/components/common/AmountInput";
import { Button, SubmitButton } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { TIcon } from "@/pages/budget/categories/Card"
import Select, { SingleValue } from "react-select";

const AccrualFormComponent = (props: {
  value: boolean;
  handleAccrualChange: () => void;
}) => {
  return (
    <div className="w-full">
      <div>Accrual?</div>
      <input
        type="checkbox"
        checked={props.value}
        onChange={props.handleAccrualChange}
        name="isAccrual"
      />
    </div>
  )
}

const PerDayCalculationsFormComponent = (props: {
  value: boolean;
  handlePerDiemChange: () => void;
}) => {
  return (
    <div className="w-full">
      <div>Per Day Calculations?</div>
      <input
        type="checkbox"
        checked={props.value}
        onChange={props.handlePerDiemChange}
        name="isPerDiemEnabled"
      />
    </div>
  )
}
const MonthlyFormComponent = (props: {
  value: boolean | null;
  updateMonthly: (value: boolean) => void;
}) => {
  const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) => {
    if (ev.target.name === "isMonthly[false]" && ev.target.value === "on") {
      props.updateMonthly(false)
    }
    if (ev.target.name === "isMonthly[true]" && ev.target.value === "on") {
      props.updateMonthly(true)
    }
  }

  let checked = ""
  if (props.value !== null) {
    checked = !props.value ? "monthly" : "day-to-day"
  }

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-6/12">
        <div>Day to Day</div>
        <div>
          <input
            type="radio"
            name="isMonthly[false]"
            checked={checked === "monthly"}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="w-6/12 text-right">
        <div>Monthly</div>
        <div>
          <input
            type="radio"
            name="isMonthly[true]"
            checked={checked === "day-to-day"}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

const ExpenseFormComponent = (props: {
  value: boolean | null;
  updateExpense: (value: boolean) => void;
}) => {

  const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) => {
    if (ev.target.name === "isExpense[false]" && ev.target.value === "on") {
      props.updateExpense(false)
    }
    if (ev.target.name === "isExpense[true]" && ev.target.value === "on") {
      props.updateExpense(true)
    }
  }

  let checked = ""
  if (props.value !== null) {
    checked = !props.value ? "revenue" : "expense"
  }

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-6/12">
        <div>Revenue</div>
        <div>
          <input
            type="radio"
            name="isExpense[false]"
            checked={checked === "revenue"}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="w-6/12 text-right">
        <div>Expense</div>
        <div>
          <input
            type="radio"
            name="isExpense[true]"
            checked={checked === "expense"}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

export type NewBudgetCategory = {
  key: string;
  name: string;
  slug: string;
  archivedAt: null;
  defaultAmount?: number;
  iconKey: string | null;
  isAccrual: boolean;
  isArchived: false;
  isExpense: boolean | null;
  isMonthly: boolean | null;
  isPerDiemEnabled: boolean;
}

const CategoryForm = (props: {
  category: BudgetCategory | NewBudgetCategory;
  closeForm: () => void;
  icons: Array<TIcon>;
  isNew?: boolean;
}) => {
  const { category, closeForm } = props
  const isNew = !!props.isNew
  const {
    key,
    name,
    slug,
    defaultAmount,
    iconKey,
    isAccrual,
    isExpense,
    isPerDiemEnabled,
    isMonthly,
  } = category

  const { data, setData, processing, transform, post, put } = useForm({
    key,
    name,
    slug,
    defaultAmount: inputAmount({ cents: defaultAmount }),
    iconKey,
    isAccrual,
    isExpense,
    isMonthly,
    isPerDiemEnabled,
  })

  const iconOptions = props.icons.map((icon) => {
    return { label: icon.name, value: icon.key }
  }).sort((i1, i2) => i1.label < i2.label ? -1 : 1)

  const selectedIcon = iconOptions.find((icon) => icon.value === data.iconKey) || { label: "", value: "" }

  const onIconSelectChange = (ev: SingleValue<{ label: string; value: string; }>) => {
    setData({ ...data, iconKey: String(ev?.value) })
  }

  // @ts-ignore
  transform(() => {
    const newAttributes = {
      key: data.key,
      expense: data.isExpense,
      monthly: data.isMonthly
    }

    return {
      category: {
        name: data.name,
        slug: data.slug,
        defaultAmount: data.defaultAmount.cents,
        iconKey: data.iconKey,
        ...(isNew ? newAttributes : {}),
        ...(data.isExpense ? { accrual: data.isAccrual } : {}),
        ...(!data.isMonthly ? { isPerDiemEnabled: data.isPerDiemEnabled } : {}),
      }
    }
  })

  const postCreate = () => {
    const formUrl = UrlBuilder({
      name: "CategoryIndex",
      queryParams: buildQueryParams(["budget", "categories"])
    })
    post(formUrl, { onSuccess: closeForm })
  }

  const putUpdate = () => {
    const formUrl = UrlBuilder({
      name: "CategoryShow",
      key: category.key,
      queryParams: buildQueryParams(["budget", "categories"])
    })
    put(formUrl, { onSuccess: closeForm })
  }

  const onSubmit = isNew ? postCreate : putUpdate

  const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) => {
    setData({ ...data, [ev.target.name]: ev.target.value })
  }

  const handleAmountChange = (amount: string) => {
    const amountTuple = inputAmount({ display: amount })
    setData({ ...data, defaultAmount: amountTuple })
  }

  const handleAccrualChange = () => {
    setData({ ...data, isAccrual: !data.isAccrual })
  }

  const handlePerDiemChange = () => {
    setData({ ...data, isPerDiemEnabled: !data.isPerDiemEnabled })
  }

  const updateExpense = (value: boolean) => {
    setData({ ...data, isExpense: value })
  }

  const updateMonthly = (value: boolean) => {
    setData({ ...data, isMonthly: value })
  }
  const iconClassName = props.icons.find((icon) => icon.key === selectedIcon.value)?.className

  return (
    <div className="w-96 flex flex-row flex-wrap justify-between border-b border-gray-400 pb-2">
      <form onSubmit={onSubmit}>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row flex-wrap justify-between">
            <div className="w-6/12">Name</div>
            <div className="w-6/12 text-right">
              <Button
                type="button"
                onClick={closeForm}
                styling={{ "color": "text-blue-300" }}
              >
                <Icon name="times-circle" />
              </Button>
            </div>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChange}
              className="border border-gray-300 rounded"
            />
          </div>
          <div className="w-full flex flex-row justify-between flex-wrap">
            <div className="w-full">
              Icon
            </div>
            <div className="w-8/12">
              <Select
                options={iconOptions}
                value={selectedIcon}
                onChange={onIconSelectChange}
              />
            </div>
            <div className="w-4/12 text-right">
            {!!iconClassName &&
              <Icon name={iconClassName} />}
            </div>
          </div>
          <div className="w-full">
            <div>Slug</div>
            <input
              type="text"
              name="slug"
              value={data.slug}
              onChange={onChange}
              className="border border-gray-300 rounded"
            />
          </div>
          {isNew && <ExpenseFormComponent
            value={data.isExpense}
            updateExpense={updateExpense}
          />}
          {isNew && <MonthlyFormComponent
            value={data.isMonthly}
            updateMonthly={updateMonthly}
          />}
          <div className="w-full">
            <div>Default Amount</div>
            <AmountInput
              name="defaultAmount"
              amount={data.defaultAmount}
              onChange={handleAmountChange}
            />
          </div>
          {data.isExpense !== null && data.isExpense && <AccrualFormComponent
            value={data.isAccrual}
            handleAccrualChange={handleAccrualChange}
          />}
          {data.isMonthly !== null && !data.isMonthly && <PerDayCalculationsFormComponent
            value={data.isPerDiemEnabled}
            handlePerDiemChange={handlePerDiemChange}
          />}
          <div className="w-full">
            <SubmitButton
              onSubmit={onSubmit}
              isEnabled={!processing}
              styling={{
                backgroundColor: "bg-green-700",
                color: "text-white",
                rounded: "rounded",
                padding: "px-2 py-1"
              }}
            >
              <div className="flex flex-row gap-2">
                <div>{isNew ? "CREATE" : "UPDATE"}</div>
                <div className="text-chartreuse-300"><Icon name="check-circle" /></div>
              </div>
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  )
}

export { CategoryForm }
