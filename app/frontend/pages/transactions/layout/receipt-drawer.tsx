import { useEffect } from "react";
import { createPortal } from "react-dom";

// A read-only bottom sheet for an already-attached receipt, styled after the
// transaction form's modal. Portaled to <body> so it can be opened from inside
// a transaction card without the card's own box affecting its fixed layout.
const ReceiptDrawer = (props: {
  contentType: null | string;
  filename: null | string;
  onClose: () => void;
  url: string;
}) => {
  const { contentType, filename, onClose, url } = props;

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const label = filename ?? "Receipt";

  return createPortal(
    <div className="modal modal-open modal-bottom" role="dialog" aria-label={label}>
      <div className="modal-box receipt-drawer-box">
        <div className="receipt-drawer-header">
          <span className="truncate">{label}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="link link-secondary text-sm shrink-0"
          >
            Open in new tab
          </a>
          <button
            type="button"
            className="round-cta cancel shrink-0"
            aria-label="Close receipt"
            onClick={onClose}
          >
            <div className="shadow-lg">&#x2718;</div>
          </button>
        </div>
        <div className="receipt-drawer-body">
          <ReceiptContent contentType={contentType} label={label} url={url} />
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close receipt"
        onClick={onClose}
      />
    </div>,
    document.body,
  );
};

const ReceiptContent = (props: {
  contentType: null | string;
  label: string;
  url: string;
}) => {
  const { contentType, label, url } = props;

  if (contentType?.startsWith("image/")) {
    return <img src={url} alt={label} className="receipt-drawer-image" />;
  }

  // The only other type the model accepts is PDF, which the browser's own
  // viewer can render inline.
  if (contentType === "application/pdf") {
    return <iframe src={url} title={label} className="receipt-drawer-pdf" />;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className="link">
      {label}
    </a>
  );
};

export { ReceiptDrawer };
