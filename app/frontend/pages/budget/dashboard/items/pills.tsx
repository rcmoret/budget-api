import { CardRow } from "@/components/card";
import { useBudgetItemContext } from "./context-provider";
import { Pill } from "@/components/pill";
import { MatureAccrualPill, NonMatureAccrualPill } from "@/components/accrual-pill";

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

  return (
    <CardRow>
      {isMature ? <MatureAccrualPill /> : <NonMatureAccrualPill month={item.month} year={item.year} slug={item.budgetCategorySlug} />}
    </CardRow>
  );
};

export { AccrualPill, ClearedItemPill };
