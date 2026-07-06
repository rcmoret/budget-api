import { CardRow } from "@/components/card";
import { useBudgetItemContext } from "./context-provider";
import { Pill } from "@/components/pill";

const AccrualPill = () => {
  const { item } = useBudgetItemContext();

  if (!item.isAccrual) { return null }

  const isMature = item.isMature

  const themeOption = isMature ? "secondary" : "accent"
  const description = isMature ? "Mature Accrual" : "Accrual"

  return (
    <CardRow>
      <Pill themeOption={themeOption}>
        {description}
      </Pill>
    </CardRow>
  )
}

export { AccrualPill }
