import { useContext, useEffect, useState } from "react";
import { useSetUpEventsForm, ResponseSetUpCategory, SetUpCategory } from "@/lib/hooks/useSetUpEventsForm";
import { dayToDayItems, expenseItems, monthlyItems, revenueItems } from "@/lib/models/budget-items";
import { isCreate, isDelete } from "@/lib/hooks/useEventsForm";
import { AmountInput, inputAmount, TInputAmount } from "@/components/common/AmountInput";
import Select, { SingleValue } from "react-select";
import { Button, SubmitButton } from "@/components/common/Button";
import { SummaryComponent } from "@/pages/budget/set_up/Summary";
import { CategoryComponent } from "@/pages/budget/set_up/Category";
import { AppConfigContext } from "@/components/layout/Provider";
import { Point } from "@/components/common/Symbol";
import { Icon } from "@/components/common/Icon";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";

type TabName = "revenues" | "monthlyExpenses" | "dayToDayExpense"

type GroupTabComponentProps = {
  title: string;
  isSelected: boolean;
  incompleteCount: number;
  onClick: () => void;
}

// type TUpdateEventProps = { categoryKey: string, eventKey: string, amount: TInputAmount }

const TabBubble = ({ incompleteCount }: { incompleteCount: number }) => {
  const className = [
    "grid min-h-[32px]",
    "min-w-[32px]",
    "place-items-center",
    "rounded-full",
    "p-1",
    "text-sm",
    "bg-gray-400",
    "text-white",
    "font-extrabold"
  ].join(" ")

  return (
    <div className={className}>
      {incompleteCount}
    </div>
  )
}

const GroupTabComponent = ({ title, isSelected, incompleteCount, onClick }: GroupTabComponentProps) => {
  const className = [
    "flex",
    "flex-row",
    "justify-center",
    "gap-2",
    "p-2",
    "border",
    "rounded-lg",
    "text-lg",
    isSelected ? "border-blue-300" : "border-gray-300",
    isSelected ? "" : "bg-gray-100"
  ].join(" ")

  if (isSelected) {
    return (
      <div className={` w-3/12`}>
        <div className={className}>
          <div>
            {title}s
          </div>
          <TabBubble incompleteCount={incompleteCount} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="w-3/12">
        <Button type="button" onClick={onClick} styling={{ width: "w-full" }}>
          <div className={`w-full ${className}`}>
            <div className="gray-700">
              {title}
            </div>
            <TabBubble incompleteCount={incompleteCount} />
          </div>
        </Button>
      </div>
    )
  }
}

const AddItemComponent = (props: {
  addCreateEvent: (_: { key: string, amount: TInputAmount }) => void;
  collectionName: string;
  categories: Array<SetUpCategory>
}) => {
  const [key, setKey] = useState<string | null>(null)
  const [amount, setAmount] = useState<TInputAmount>(inputAmount({ display: "" }))
  const { categories, addCreateEvent, collectionName } = props
  const options = categories.map((category) => {
    return { value: category.key, label: category.name }
  })
  const value = options.find((option) => option.value === key) || { label: "", value: null }
  const onChange = (ev:  SingleValue<{ value: string; label: string; } | { label: string; value: null; }>) => {
    setKey(String(ev?.value))
  }
  const handleAmountChange = (amt: string) => {
    setAmount(inputAmount({ display: amt }))
  }

  const isButtonEnabled = !!key && (!!amount.cents && !!amount.display)

  const addItem = () => {
    if (!isButtonEnabled) { return }

    addCreateEvent({ key, amount })
    setKey(null)
    setAmount(inputAmount({ display: "" }))
  }

  if (!categories.length) {
    return null
  }

  return (
    <div className="w-8/12 flex flex-row items-end flex-wrap my-4 gap-4 border border-gray-300 rounded p-2">
      <div className="w-full text-sm text-gray-700">
        <Point>
          Add a {collectionName} Item
        </Point>
      </div>
      <div className="w-3/12">
        <div className="text-sm text-gray-700">
          Category
        </div>
        <div className="h-9">
          <Select
            options={options}
            onChange={onChange}
            value={value}
          />
        </div>
      </div>
      <div className="w-4/12 flex gap-4 items-end">
        <div>
          <div className="text-sm text-gray-700">
            Amount
          </div>
          <div>
            <AmountInput
              name="set-up-create-event"
              amount={amount}
              onChange={handleAmountChange}
              classes={["h-input-lg", "border", "border-gray-300"]}
            />
          </div>
        </div>
        <div>
          <Button
            type="button"
            onClick={addItem}
            isDisabled={!isButtonEnabled}
            styling={{
              fontWeight: "font-semibold",
              backgroundColor: "bg-blue-300",
              color: "text-white",
              rounded: "rounded",
            }}
            disabledStyling={{ 
              backgroundColor: "bg-gray-400",
              border: "border border-gray-500",
              cursor: "cursor-not-allowed"
            }}>
            <div className="p-2">
              Add Item
              {" "}
              <span className={`text-xs ${isButtonEnabled ? "text-sky-200" : "text-gray-500"}`}>
                <Icon name="plus" />
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

type ComponentProps = {
  categories: Array<ResponseSetUpCategory>;
  month: number;
  year: number;
  errors?: Array<{
    [key:string]: {
      amount?: string[];
      category?: string[];
      budgetItem?: string[];
    }
  }>
}

const SetUpComponent = (props: ComponentProps) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const [viewTab, setViewTab] = useState<TabName>("revenues")
  const { month, year } = props

  useEffect(() => {
    setAppConfig({
      ...appConfig,
      budget: {
        ...appConfig.budget,
        data: { ...appConfig.budget.data, month, year }
      }
    })
  }, [])


  const {
    addCreateEvent,
    categories,
    isSubmittable,
    removeEvent,
    removeItem,
    post,
    totalBudgeted,
    updateCategory,
    updateEvent
  } = useSetUpEventsForm(props)

  const withItems = (category: SetUpCategory) => !!category.events.filter((ev) => !isDelete(ev)).length
  const revenueCategories = categories.filter(revenueItems)
  const monthlyExpenseCategories = categories.filter(expenseItems).filter(monthlyItems)
  const dayToDayExpenseCategories = categories.filter(expenseItems).filter(dayToDayItems)

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault()
    const formUrl = UrlBuilder({
      name: "BudgetSetUp",
      month,
      year,
      queryParams: buildQueryParams(["budget", month, year])
    })
    post(formUrl)
  }

  const categoryMap = {
    revenues: {
      collection: revenueCategories,
      incompleteCount: revenueCategories.reduce((sum, category) => {
        if (!category.events.length) {
          return sum
        }
        return category.events.filter((event) => isCreate(event) && !event.amount.cents, 0).length + sum
      }, 0),
      title: "Revenue",
    },
    monthlyExpenses: {
      collection: monthlyExpenseCategories,
      incompleteCount: monthlyExpenseCategories.reduce((sum, category) => {
        if (!category.events.length) {
          return sum
        }
        return category.events.filter((event) => isCreate(event) && !event.amount.cents, 0).length + sum
      }, 0),
      title: "Monthly Expense"
    },
    dayToDayExpense: {
      collection: dayToDayExpenseCategories,
      incompleteCount: dayToDayExpenseCategories.reduce((sum, category) => {
        if (!category.events.length) {
          return sum
        }
        return category.events.filter((event) => isCreate(event) && !event.amount.cents, 0).length + sum
      }, 0),
      title: "Day to Day Expense"
    }
  }

  const currentCategories = categoryMap[viewTab]
  const availableCategories = currentCategories.collection.filter((category) => {
    return category.isMonthly || !category.events.filter((ev) => !isDelete(ev)).length
  })

  return (
    <div className="w-full flex flex-row flex-wrap px-2">
      <div className="flex flex-row flex-wrap gap-2 w-full my-4">
        {Object.entries(categoryMap).map(([key, data]) => {
          return (
            <GroupTabComponent
              key={key}
              title={data.title}
              isSelected={viewTab === key}
              onClick={() => setViewTab(key as TabName)}
              incompleteCount={data.incompleteCount}
            />
          )
        })}
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full flex flex-wrap flex-row gap-4">
          <div className="w-8/12 flex flex-col gap-2 overflow-y-auto max-h-96">
            {currentCategories.collection.filter(withItems).map((category) => {
              return (
                <CategoryComponent
                  key={category.key}
                  category={category}
                  removeEvent={removeEvent}
                  removeItem={removeItem}
                  updateCategory={updateCategory}
                  updateEvent={updateEvent}
                />
              )
            })}
          </div>
          <div className="w-3/12 flex flex-col gap-4">
            <div>
              <SummaryComponent
                revenueCategories={revenueCategories}
                monthlyCategories={monthlyExpenseCategories}
                dayToDayCategories={dayToDayExpenseCategories}
                totalBudgeted={totalBudgeted}
              />
            </div>
            <div className="self-end">
              <SubmitButton
                styling={{
                  backgroundColor: "bg-green-600",
                  color: "text-white",
                  fontWeight: "font-semibold",
                  border: "border border-chartreuse-300",
                  rounded: "rounded"
                }}
                disabledStyling={{
                  backgroundColor: "bg-gray-400",
                  border: "border border-gray-500",
                  cursor: "cursor-not-allowed"
                }}
                isEnabled={isSubmittable}
                onSubmit={onSubmit}
              >
                <div className="flex flex-row px-1 py-2 gap-2">
                  <div>
                    Create Budget
                  </div>
                  <div className={isSubmittable ? "text-chartreuse-300" : "text-gray-500"}>
                    <Icon name="check-circle" />
                  </div>
                </div>
              </SubmitButton>
            </div>
          </div>
        </div>
      </div>
      <AddItemComponent
        categories={availableCategories}
        addCreateEvent={addCreateEvent}
        collectionName={currentCategories.title}
      />
    </div>
  )
}

export default SetUpComponent;
