import { createContext, useContext, ReactNode } from "react";
import {
  FinalizeCategoryEvent,
  FinalizeCategoryFormItem,
  FinalizeFormCategory,
  UpdateCategoryProps,
  decorate as redecorate,
} from "@/lib/hooks/useFinalizeEventsForm"

type TCategoryContext = {
  category: FinalizeFormCategory;
  effectiveEvents: FinalizeCategoryEvent[];
  effectItems: FinalizeCategoryFormItem[];
  rolloverAmountFor: (eventKey: string) => number;
  setItemEventKey: (p: { eventKey: string; itemKey: string }) => void;
  setRolloverAmountForItem: (props: { itemKey: string; rolloverAmount: string; }) => void;
  setRolloverNoneForItem: (props: { itemKey: string; }) => void;
}

const CategoryContext = createContext<TCategoryContext | null>(null);

const CategoryProvider = (props: {
  category: FinalizeFormCategory;
  setCategory: (p: UpdateCategoryProps & { key: string; }) => void;
  children: ReactNode;
}) => {

  const { category } = props

  const setCategory = (updateProps: UpdateCategoryProps) => {
    props.setCategory({
      key: category.key,
      ...updateProps
    })
  }

  const setItemEventKey = (props: { eventKey: string, itemKey: string }) => {
    const { eventKey, itemKey } = props

    const items = category.items.map((item) => {
      if (item.key !== itemKey) { return item }

      return redecorate({
        item,
        isExpense: category.isExpense,
        rolloverAmount: item.rolloverAmount.display || "",
        eventKey
      })
    })

    setCategory({ items })
  }

  const setRolloverAmountForItem = (props: { itemKey: string, rolloverAmount: string; }) => {
    const { itemKey } = props

    const items = category.items.map((item) => {
      if (item.key !== itemKey) { return item }

      return redecorate({
        item,
        eventKey: item.eventKey,
        isExpense: category.isExpense,
        rolloverAmount: props.rolloverAmount
      })
    })

    setCategory({ items })
  }

  const setRolloverNoneForItem = (props: { itemKey: string; }) => {
    const { itemKey } = props

    const items = category.items.map((item) => {
      if (item.key !== itemKey) { return item }

      return redecorate({
        item,
        isExpense: category.isExpense,
        rolloverAmount: "0",
        eventKey: category.events.length > 1 ? "" : item.eventKey
      })
    })

    setCategory({ items })
  }

  const singleMatched = category.items.length === 1 &&
    category.events.length === 1

  const eventKeys = category.items.map((item) => item.eventKey)

  const effectiveEvents = category.events.filter(({ key }) => {
    return singleMatched || eventKeys.includes(key)
  })

  const effectItems = category.items.filter((item) => {
    return !item.needsReview && !!item.rolloverAmount.cents
  })

  const rolloverAmountFor = (eventKey: string) => {
    return effectItems.reduce((sum, item) => {
      if (item.eventKey === eventKey) {
        return sum + (item.rolloverAmount.cents || 0)
      } else {
        return sum
      }
    }, 0)
  }

  const value = {
    category,
    effectiveEvents,
    effectItems,
    rolloverAmountFor,
    setItemEventKey,
    setRolloverAmountForItem,
    setRolloverNoneForItem,
  }

  return (
    <CategoryContext.Provider value={value}>
      {props.children}
    </CategoryContext.Provider>
  );
};

const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export { useCategory, CategoryProvider }
