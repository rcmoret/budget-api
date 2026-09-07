import { useForm } from "@inertiajs/react";
import { Pill, pillClassName as getClassName } from "./pill";
import { getRedirectQueryParams } from "@/lib/app-stores/app-config-store";

const nonMaturePillClassName = `${getClassName("warning")} cursor-pointer`

const MatureAccrualPill = () => {
  return (
    <Pill themeOption="notice">Mature</Pill>
  )
}

const NonMatureAccrualPill = (props: { month: string | number, year: string | number; slug: string; }) => {
  const { month, year, slug } = props
  const { put } = useForm({
    category: {
      maturityIntervals: [
        { month, year }
      ]
    }
  })

  const redirectParams = getRedirectQueryParams();

  const addMaturityInterval = (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    put(`/budget/category/${slug}?${redirectParams}`)
  }

  return (
    <form onSubmit={addMaturityInterval}>
      <button title="mark this item as maturing" type="submit" className={nonMaturePillClassName}>
        Accrual
      </button>
    </form>
  )
}

export { MatureAccrualPill, NonMatureAccrualPill }
