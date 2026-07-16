import {
  AdjustmentAmountItem,
  useAdjustmentStore,
} from "@/lib/adjustment-amount-store";
import { createContext, useContext, useState } from "react";

type InputName = "adjustment" | "total" | "both";

type AdjustmentInputsProps = {
  children: React.ReactNode;
  editing?: InputName;
  objectKey: string;
};

type AdjustmentInputContextType = {
  adjustment: AdjustmentAmountItem;
  adjustmentInputId: string;
  editingAdjustment: boolean;
  editingTotal: boolean;
  hasAdjustment: boolean;
  showAdjustmentInput: () => void;
  showTotalInput: () => void;
  totalInputId: string;
  updateItemByAdjustment: (amount: string) => void;
  updateItemByTotal: (amount: string) => void;
};

const emptyAdjustment: AdjustmentAmountItem = {
  objectKey: "",
  initialAmount: 0,
  adjustmentAmount: { cents: 0, display: "" },
  newTotal: { cents: 0, display: "" },
};

const AdjustmentInputContext = createContext<AdjustmentInputContextType | null>(
  null,
);

const AdjustmentInputsProvider = (props: AdjustmentInputsProps) => {
  const { adjustments } = useAdjustmentStore();
  const { children, objectKey, editing = "total" } = props;
  const [editingInput, setEditingInput] = useState<InputName>(editing);
  const {
    updateItemByAmount: updateAdjustment,
    updateItemByTotal: updateTotal,
  } = useAdjustmentStore();
  const adjustment = adjustments.find(
    ({ objectKey: key }) => key === objectKey,
  );

  const hasAdjustment = !!adjustment;
  const updateItemByAdjustment = (amount: string) =>
    updateAdjustment({ objectKey, amount });
  const updateItemByTotal = (amount: string) =>
    updateTotal({ objectKey, amount });
  const isEditing = (type: Omit<InputName, "both">) => {
    if (!hasAdjustment) return false;

    return editingInput === "both" || editingInput === type;
  };

  const value: AdjustmentInputContextType = {
    adjustment: adjustment ?? emptyAdjustment,
    adjustmentInputId: `adjustment-${objectKey}`,
    hasAdjustment,
    editingAdjustment: isEditing("adjustment"),
    editingTotal: isEditing("total"),
    showAdjustmentInput: () => setEditingInput("adjustment"),
    showTotalInput: () => setEditingInput("total"),
    totalInputId: `total-${objectKey}`,
    updateItemByAdjustment,
    updateItemByTotal,
  };

  return (
    <AdjustmentInputContext.Provider value={value}>
      {children}
    </AdjustmentInputContext.Provider>
  );
};

const useAdjustmentInputsContext = () => {
  const context = useContext(AdjustmentInputContext);

  if (context) {
    return context;
  }

  throw new Error(
    "useAdjustmentInputsContext must be used in a AdjustmentInputsProvider",
  );
};

export { AdjustmentInputsProvider, useAdjustmentInputsContext };
