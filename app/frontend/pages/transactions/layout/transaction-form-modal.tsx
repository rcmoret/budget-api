import { TransactionContext } from "../context-provider";
import { TransactionFormProvider } from "../form/context-provider";
import { FormComponent } from "../form";
import { useActiveTransactionForm } from "../store";
import { useVisualViewport } from "@/utils/hooks/useVisualViewport";

const TransactionFormModal = () => {
  const activeForm = useActiveTransactionForm();
  const viewport = useVisualViewport();

  if (!activeForm.isOpen) return null;

  const { isNew, objectKey, transaction, toggleForm } = activeForm;
  const contextValue = {
    isFormShown: true,
    isNew,
    objectKey,
    transaction,
    toggleForm,
  };

  // See useVisualViewport: anchors the sheet to the space actually visible
  // above the on-screen keyboard instead of the full (keyboard-oblivious)
  // layout viewport that `inset: 0` and `dvh`/`vh` fall back to.
  const modalStyle: React.CSSProperties | undefined = viewport
    ? { top: viewport.offsetTop, bottom: "auto", height: viewport.height }
    : undefined;
  const boxStyle: React.CSSProperties | undefined = viewport
    ? { maxHeight: `${viewport.height - 48}px` }
    : undefined;

  return (
    <div className="modal modal-open modal-bottom" style={modalStyle}>
      <div className="modal-box transaction-form-modal-box" style={boxStyle}>
        <TransactionContext.Provider value={contextValue}>
          <TransactionFormProvider>
            <FormComponent />
          </TransactionFormProvider>
        </TransactionContext.Provider>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close transaction form"
        onClick={toggleForm}
      />
    </div>
  );
};

export { TransactionFormModal };
