import { KeyIdentifier } from "@/components/key-identifier"
import { useTransactionContext } from "../context-provider"

const SupplementalInfo = () => {
  const { transaction } = useTransactionContext()
  const { key } = transaction

  if (key === "initial") return null

  return (
    <div className="col-span-full flex justify-end">
      <KeyIdentifier identifier={key} />
    </div>
  )
}

export { SupplementalInfo }
