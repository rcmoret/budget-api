import { BudgetCategory } from "@/types/budget"
import { Point } from "@/components/common/Symbol"
import { Icon } from "@/components/common/Icon"
import { AmountSpan } from "@/components/common/AmountSpan";
import { useToggle } from "@/lib/hooks/useToogle";
import { Button, SubmitButton } from "@/components/common/Button";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params"
import { CategoryForm } from "@/pages/budget/categories/Form";
import { IconName } from "@/components/common/Icon"

const AccrualComponent = (props: { category: BudgetCategory }) => {
  const { isAccrual, maturityIntervals } = props.category

  if (!isAccrual) { return null }

  return (
    <div className="w-full flex flex-col gap-2">
      <div>
        Accrual
      </div>
      <MaturityIntervalComponent maturityIntervals={maturityIntervals || []} />
    </div>
  )
}

const MaturityIntervalComponent = (props: {
  maturityIntervals: Array<{ month: number; year: number; }>
}) => {
  const [showList, toggleShowList] = useToggle(false)

  const caretClass = showList ? "caret-down" : "caret-right"
  const { maturityIntervals }= props

  if (!maturityIntervals.length) { return null }

  return (
    <div className="w-full">
      <Button
        type="button"
        onClick={toggleShowList}
        >
        <Icon name={caretClass} />
      </Button>
      {" "}
      Maturity Intervals
      {showList && <MaturityIntervalListComponent maturityIntervals={maturityIntervals} />}
    </div>
  )
}

const MaturityIntervalListComponent = (props: {
  maturityIntervals: Array<{ month: number; year: number; }>
}) => {
  const maturityIntervals = props.maturityIntervals.sort((mi1, mi2) => {
    if (mi1.year === mi2.year) {
      return mi1.month - mi2.month
    } else {
      return mi1.year - mi2.year
    }
  })

  return (
    <div className="w-full">
    {maturityIntervals.map((interval) => {
      return (
        <div>{interval.month}/{interval.year}</div>
      )
    })}
    </div>
  )
}

const PerDayComponent = (props: { category: BudgetCategory }) => {
  const { category } = props

  if (category.isMonthly) { return null }

  return (
    <div>
      <div>Per Day Calculations</div>
      <div>{category.isPerDiemEnabled ? "Enabled" : "Disabled"}</div>
    </div>
  )
}

type TIcon = {
  key: string;
  name: string;
  className: IconName;
}

const CardWrapper = (props: {
  category: BudgetCategory;
  isFormShown: boolean;
  icons: Array<TIcon>;
  setShowFormKey: (key: string | null) => void;
}) => {
  const { category, isFormShown, setShowFormKey } = props
  const closeForm = () => setShowFormKey(null)

  if (isFormShown) {
    return (
      <CategoryForm
        category={category}
        closeForm={closeForm}
        icons={props.icons}
      />
    )
  } else {
    return (
      <Card
        category={category}
        openForm={() => setShowFormKey(category.key)}
      />
    )
  }
}

const ArchiveComponent = ({ category }: { category: BudgetCategory }) => {
  if (!category.isArchived) { return null }
  const { processing, put } = useForm({
    category: { archivedAt: null }
  })

  const formUrl = UrlBuilder({
    name: "CategoryShow",
    key: category.key,
    queryParams: buildQueryParams(["budget", "categories"])
  })

  const onSubmit = () => put(formUrl)

  return (
    <div className="w-full flex justify-between">
      <div>
        Archived at: {category.archivedAt || ""}
      </div>
      <div>
        <form>
          <SubmitButton
            onSubmit={onSubmit}
            isEnabled={!processing}
            styling={{}}
          >
            <Icon name="angle-double-right" />
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}

const ArchiveButton = ({ category }: { category: BudgetCategory }) => {
  const { processing, put, transform } = useForm({
    category: { archivedAt: new Date () }
  })

  const formUrl = UrlBuilder({
    name: "CategoryShow",
    key: category.key,
    queryParams: buildQueryParams(["budget", "categories"])
  })

  const onSubmit = () => put(formUrl)

  if (category.isArchived) { return null }

  return (
    <form>
      <SubmitButton
        onSubmit={onSubmit}
        isEnabled={!processing}
        styling={{}}
      >
        <Icon name="trash" />
      </SubmitButton>
    </form>
  )
}

const Card = (props: {
  category: BudgetCategory;
  openForm: () => void;
}) => {
  const { category, openForm } = props

  const {
    name,
    defaultAmount,
    iconClassName,
    isAccrual,
    isExpense,
    isMonthly,
  } = category

  return (
    <div className="w-96 flex flex-row flex-wrap justify-between border-b border-gray-400 pb-2">
      <div className="w-full flex flex-row justify-between">
        <div className="w-6/12">
          <Point>
            {name}
          </Point>
          {" "}
          <Icon name={iconClassName} />
        </div>
        <div className="w-6/12 text-right text-blue-300 flex justify-end gap-2">
          <Button
          type="button"
          onClick={openForm}
          >
            <Icon name="edit" />
          </Button>
          <ArchiveButton category={category} />
        </div>
      </div>
      <ArchiveComponent category={category} />
      <div className="w-6/12">
        {isExpense ? "Expense" : "Revenue"}
      </div>
      <div className="w-6/12 text-right">
        {isMonthly ? "Monthly" : "Day to Day"}
      </div>
      <div className="w-6/12">
        {!!defaultAmount &&
          <span>
            Default:
            {" "}
            <AmountSpan amount={defaultAmount} />
          </span>}
      </div>
      <div className="w-6/12 text-right text-sm">
        <PerDayComponent category={category} />
      </div>
      {isAccrual && <AccrualComponent category={category} />}
    </div>
  )
}

export { CardWrapper, TIcon }
