import { createContext, useContext, ReactNode } from "react";
import { FinalizeCategoryFormItem } from "@/lib/hooks/useFinalizeEventsForm";

type TItemContext = {
  index: number;
  item: FinalizeCategoryFormItem; 
  setItemEventKey: (eventKey: string) => void;
  setRolloverAmountForItem: (rolloverAmount: string) => void;
  setRolloverNoneForItem: () => void;
}

const ItemContext = createContext<TItemContext | null>(null);

const ItemProvider = (props: {
  index: number;
  item: FinalizeCategoryFormItem;
  setRolloverAmountForItem: (props: { itemKey: string; rolloverAmount: string; }) => void;
  setItemEventKey: (props: { itemKey: string; eventKey: string; }) => void;
  setRolloverNoneForItem: (props: { itemKey: string }) => void;
  children: ReactNode;
}) => {
  const { item } = props

  const itemKey = item.key

  const setRolloverAmountForItem = (rolloverAmount: string) => {
    // From the category hook
    props.setRolloverAmountForItem({ itemKey, rolloverAmount })
  }

  const setItemEventKey = (eventKey: string) => {
    // From the category hook
    props.setItemEventKey({ itemKey, eventKey })
  }

  const setRolloverNoneForItem = () => {
    // From the category hook
    props.setRolloverNoneForItem({ itemKey })
  }

  const value = {
    index: props.index,
    item,
    setItemEventKey,
    setRolloverAmountForItem,
    setRolloverNoneForItem
  }

  return (
    <ItemContext.Provider value={value}>
      {props.children}
    </ItemContext.Provider>
  );
};

const useItem = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItem must be used within a CategoryProvider");
  }
  return context;
};

export  { useItem, ItemProvider }
