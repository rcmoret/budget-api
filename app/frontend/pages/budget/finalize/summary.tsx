import { AmountSpan } from "@/components/common/AmountSpan";
import { DateFormatter } from "@/lib/DateFormatter";
import { useFinalizeFormContext } from "./form_context";

const SummaryLineItem = (props: { label: string; children: React.ReactNode }) => {
  const { label } = props

  return (
    <div className="flex flex-row justify-between">
      {label}
      {" "}
      {props.children}
    </div>
  )
}

const Summary = () => {
  const { base, extraAmount } = useFinalizeFormContext()
  return (
    <div className="flex flex-col bg-yellow-100 p-2 gap-2 w-96 rounded">
      <div className="text-lg flex flex-row justify-between border-b border-yellow-400">
        <div>Final Review</div>
        <div>{DateFormatter({ month: base.month, year: base.year, format: "monthYear" })}</div>
      </div>
      <SummaryLineItem label="Remaining/Disretionary:">
        <AmountSpan
          amount={base.discretionary.amount}
          zeroColor="text-black"
          color="text-green-600"
          negativeColor="text-red-400"
        />
      </SummaryLineItem>
      <SummaryLineItem label="Extra From Items:">
        <AmountSpan
          amount={extraAmount}
          zeroColor="text-black"
          negativeColor="text-green-600"
          color="text-red-400"
          absolute={true}
        />
      </SummaryLineItem>
    </div>
  )
}

export { Summary }
