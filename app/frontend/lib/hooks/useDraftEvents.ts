import { useEffect, useState } from "react";
import { BudgetItem } from "@/types/budget";
import { DraftItem } from "@/pages/budget/index";
import { inputAmount, TInputAmount } from "@/components/common/AmountInput";
import { router, useForm } from '@inertiajs/react'
import { UrlBuilder } from "@/lib/UrlBuilder";
import { generateKeyIdentifier } from "../KeyIdentifier";
import { buildQueryParams } from "../redirect_params";
import { CreateEventProps, AdjustEventProps } from "./useEventsForm";

export type DraftChange = {
  budgetCategoryKey: string,
  budgetItemKey: string,
  amount: TInputAmount;
}

type TChangeForm = {
  changes: DraftChange[];
  post: () => void;
  addChange: (change: DraftChange) => void;
  removeChange: (key: string) => void;
  updateChange: (key: string, amount: string) => void;
  processing: boolean
}

type HookProps = {
  items: BudgetItem[];
  draft?: {
    items: Array<DraftItem>;
    discretionary: {
      amount: number,
      overUnderBudget: number,
    }
  }
  month: number | string;
  year: number | string;
}

interface MergedItem extends BudgetItem {
  draftItem?: DraftItem;
  change?: DraftChange;
}

const mergeItems = (props: {
  items: BudgetItem[];
  draftItems: DraftItem[];
  changes: DraftChange[];
}): MergedItem[] => {
  const { draftItems, changes } = props

  return props.items.map((item) => {
    const draftItem =  (draftItems.find((i) => i.key === item.key))
    const change = changes.find((change) => change.budgetItemKey === item.key)

    if (!!draftItem && !!change) {
      return { ...item, draftItem, change }
    } else {
      return item
    }
  })
}

const useDraftEvents = (props: HookProps) => {
  const { month, year } = props
  const [_changes, setChanges] = useState<null|DraftChange[]>(null)

  const changes: DraftChange[] = _changes || []

  const draftItems: Array<DraftItem> = props.draft?.items || []
  const newItems = draftItems.filter((item) => item.isNewItem)

  const items = mergeItems({
    items: props.items, 
    draftItems,
    changes
  })

  const { transform, setData: setFormData, data, ...form } = useForm({ items })

  const postChanges = () => {
    const url = UrlBuilder({ name: "BudgetEdit", month, year })
    const payload = {
      changes: changes.map((change) => ({ ...change, amount: change.amount.cents }))
    }

    router.post(
      url,
      payload,
      {
        onSuccess: (page) => {
          setFormData({
            items: mergeItems({
              items: page.props.items as BudgetItem[],
              // @ts-ignore
              draftItems: page.props.draft.items,
              changes,
            })
          })
        },
      }
    )
  }

  useEffect(() => {
    if (_changes === null) { return }

    postChanges()
  }, [changes])

  const addChange = (change: DraftChange) => {
    setChanges([...changes, change])
  }

  const removeChange = (key: string) => {
    setChanges(
      changes.filter((change) => change.budgetItemKey !== key)
    )
  }

  const updateChange = (key: string, amount: string) => {
    setChanges(
      changes.map((change) => {
        if (change.budgetItemKey === key) {
          return { ...change, amount: inputAmount({ display: amount }) }
        } else {
          return change
        }
      })
    )
  }

  const eventsUrl= UrlBuilder({ name: "BudgetItemEvents",
    month,
    year,
    queryParams: buildQueryParams(["budget", month, year]),
  })

  const itemToEvent = (item: DraftItem): CreateEventProps|AdjustEventProps  => {
    if (item.isNewItem) {
      const eventType = changes.length === 1 ? "item_create" : "multi_item_adjust_create"

      return {
        key: generateKeyIdentifier(),
        amount: inputAmount({ cents: item.amount }),
        budgetItemKey: item.key,
        budgetCategoryKey: item.budgetCategoryKey,
        month,
        year,
        eventType,
      }
    } else {
      const eventType = changes.length === 1 ? "item_adjust" : "multi_item_adjust"

      return {
        eventType,
        key: generateKeyIdentifier(),
        amount: inputAmount({ cents: item.amount }),
        budgetItemKey: item.key,
      }
    }

  }

  // @ts-ignore
  transform((data) => {
    // @ts-ignore
    const events = [...data.items.map((i) => i.draftItem), ...newItems].reduce((acc, item) => {
      if (item) {
        const event = itemToEvent(item)

        return [
          ...acc,
          { ...event, amount: event.amount.cents }
        ]
      } else {
        return acc
      }
    }, [])
    return { events }
  })

  const post = () => form.post(eventsUrl, { onSuccess: () => setChanges([]) })

  return {
    addChange,
    changes,
    discretionary: props.draft?.discretionary,
    draftItems,
    newItems,
    items,
    post,
    processing: form.processing,
    removeChange,
    updateChange,
  }
}

export { TChangeForm, useDraftEvents, MergedItem }
