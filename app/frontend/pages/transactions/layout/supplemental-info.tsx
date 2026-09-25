import { KeyIdentifier } from "@/components/key-identifier";
import { useTransactionContext } from "../context-provider";

const SupplementalInfo = () => {
  const { transaction, isNew } = useTransactionContext();
  const { key } = transaction;

  // A new transaction has no key yet, and the form's own Save/Close row
  // already covers collapsing it back down.
  if (key === "initial" || isNew) return null;

  return (
    <div className="col-span-full flex justify-between items-center">
      <KeyIdentifier identifier={key} />
    </div>
  );
};

export { SupplementalInfo };
