import { CardRow } from "@/components/card";
import { useBudgetItemContext } from "./context-provider";
import { Pill } from "@/components/pill";

const ClearedItemPill = () => {
  const { item } = useBudgetItemContext();

  if (!item.isCleared) {
    return null;
  }

  return (
    <CardRow>
      <Pill themeOption="info">cleared item</Pill>
    </CardRow>
  );
};

const AccrualPill = () => {
  const { item } = useBudgetItemContext();

  if (!item.isAccrual) {
    return null;
  }

  const isMature = item.isMature;

  const themeOption = isMature ? "notice" : "warning";
  const description = isMature ? "Mature Accrual" : "Accrual";

  return (
    <CardRow>
      <Pill themeOption={themeOption}>{description}</Pill>
    </CardRow>
  );
};

export { AccrualPill, ClearedItemPill };
