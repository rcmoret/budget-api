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
  const { transaction, isFormShown, isNew } = useTransactionContext();
  const { key } = transaction;

  if (key === "initial") return null;

  // A new transaction has no key yet — just offer a way to collapse the
  // form back down.
  if (isNew) {
    return (
      <div className="col-span-full flex justify-end items-center">
        <CloseFormButton />
      </div>
    );
  }

  return (
    <div className="col-span-full flex justify-between items-center">
      <KeyIdentifier identifier={key} />
      {isFormShown ? <CloseFormButton /> : <EditButton />}
    </div>
  );
};

export { SupplementalInfo };
