import { KeyIdentifier } from "@/components/key-identifier";
import { useTransactionContext } from "../context-provider";
import { IconButton } from "@/components/cta";
import { Pencil } from "@/components/icons/pencil";
import { CloseButton } from "@/components/close-button";

const EditButton = () => {
  const { toggleForm } = useTransactionContext();
  return (
    <IconButton onClick={toggleForm} title="Edit item">
      <Pencil />
    </IconButton>
  );
};

const CloseFormButton = () => {
  const { toggleForm } = useTransactionContext();
  return (
    <CloseButton
      onClick={toggleForm}
      ariaLabel="close transaction form"
      title="close transaction form"
    />
  );
};

const SupplementalInfo = () => {
  const { transaction, isFormShown } = useTransactionContext();
  const { key } = transaction;

  if (key === "initial") return null;

  return (
    <div className="col-span-full flex justify-between items-center">
      <KeyIdentifier identifier={key} />
      {isFormShown ? <CloseFormButton /> : <EditButton />}
    </div>
  );
};

export { SupplementalInfo };
