import { useContext, useEffect, useState } from "react";
import { useSetUpEventsForm, ResponseSetUpCategory, SetUpCategory } from "@/lib/hooks/useSetUpEventsForm";
import { dayToDayItems, expenseItems, monthlyItems, revenueItems } from "@/lib/models/budget-items";
import { isCreate, isDelete } from "@/lib/hooks/useEventsForm";
import { ActionAnchorTag } from "@/components/common/Link";
import { AmountInput, inputAmount, TInputAmount } from "@/components/common/AmountInput";
import Select, { SingleValue } from "react-select";
import { Button, SubmitButton } from "@/components/common/Button";
import { SummaryComponent } from "@/pages/budget/set_up/Summary";
import { CategoryComponent } from "@/pages/budget/set_up/Category";
import { AppConfigContext } from "@/components/layout/Provider";
import { Point } from "@/components/common/Symbol";
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
    "py-1",
    "px-1",
    "text-xs",
    "bg-gray-400",
    "text-gray-800"
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
    isSelected ? "border-blue-300" : "border-gray-400",
    isSelected ? "" : "bg-gray-300"
  ].join(" ")

  if (isSelected) {
    return (
      <div className={`${className} w-3/12`}>
        <div className="text-lg">
          {title}s
        </div>
        <TabBubble incompleteCount={incompleteCount} />
      </div>
    )
  } else {
    return (
      <div className="w-3/12">
        <ActionAnchorTag onClick={onClick}>
          <div className={className}>
            <div className="gray-700 text-lg">
              {title}
            </div>
            <TabBubble incompleteCount={incompleteCount} />
          </div>
        </ActionAnchorTag>
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
              classes={["h-9"]}
            />
          </div>
        </div>
        <div>
          <Button
            type="button"
            onClick={addItem}
            isDisabled={!isButtonEnabled}
            styling={{
              backgroundColor: "bg-blue-300",
              color: "text-white",
              rounded: "rounded",
              
            }}
            disabledStyling={{ 
              backgroundColor: "bg-gray-300",
              color: "text-white",
              rounded: "rounded",
              cursor: "cursor-not-allowed"
            }}>
            <div className="p-2">
              Add Item
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
    <div className="w-full flex flex-row flex-wrap">
      <div className="flex flex-row flex-wrap gap-2 w-full mb-6">
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
          <div className="w-8/12 flex flex-col gap-2 border-t border-gray-500">
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
          <div className="w-3/12 flex flex-col">
            <div>
              <SummaryComponent
                revenueCategories={revenueCategories}
                monthlyCategories={monthlyExpenseCategories}
                dayToDayCategories={dayToDayExpenseCategories}
                totalBudgeted={totalBudgeted}
              />
            </div>
            <div>
              <SubmitButton
                styling={{
                  backgroundColor: "bg-blue-400",
                  color: "text-white",
                  border: "border border-blue-500",
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
                <div className="px-1 py-2">
                  Create Budget
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
