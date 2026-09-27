import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/cta";
import { useTransactionContext } from "../context-provider";
import { useTransactionFormContent } from "./context-provider";

// Mirrors the `receipt` validations on Transaction::Entry — the same content
// types, the same ceiling, and the same wording, so a file the server would
// reject never gets as far as a request. The model stays the authority; this is
// only here to fail fast. Note there is no `image/jpg`: browsers report a .jpg
// as image/jpeg, and the model doesn't accept anything else either.
const ACCEPTED_CONTENT_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024;

const rejectionReason = (file: File): null | string => {
  if (!ACCEPTED_CONTENT_TYPES.includes(file.type)) {
    return "Must be a PNG, JPG, or PDF file";
  }
  if (file.size > MAX_BYTES) return "Must be less than 10MB";

  return null;
};

// An object URL rather than a FileReader data URL: the browser hands it back
// synchronously and nothing has to be read into memory. It does have to be
// revoked, hence the effect over a plain derived value.
const useImagePreviewUrl = (file: null | File): null | string => {
  const [url, setUrl] = useState<null | string>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};

const previewClassName = "max-w-32 max-h-32 rounded border border-secondary";

const ReceiptUpload = () => {
  const { receipt, setReceipt } = useTransactionFormContent();
  const { transaction } = useTransactionContext();
  const [rejection, setRejection] = useState<null | string>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useImagePreviewUrl(receipt);

  // A freshly picked file replaces whatever is attached on save, so the two are
  // never shown at once — clearing the pick brings the attached one back.
  const { receiptUrl, receiptFilename, receiptContentType } = transaction;
  const attached = receipt ? null : receiptUrl;

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const reason = rejectionReason(file);
    setRejection(reason);
    if (reason) {
      // Dropped from the input as well as from the form state, so the control
      // never reads back a filename the form isn't holding.
      ev.target.value = "";
      return;
    }

    setReceipt(file);
  };

  const clearReceipt = () => {
    setReceipt(null);
    setRejection(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid gap-2 justify-items-start">
      <div className="grid grid-cols-[auto_auto] items-center">
        <div className="flex gap-2">
          <label htmlFor="transaction-receipt">Receipt</label>
          <IconButton
            onClick={() => inputRef.current?.click()}
            title={receipt || attached ? "replace receipt" : "attach a receipt"}
          >
            <Icon name="paperclip" />
          </IconButton>
        </div>
        {receipt ? (
          <>
            <span className="text-xs">{receipt.name}</span>
            <button
              type="button"
              aria-label="remove receipt"
              title="remove receipt"
              className="round-cta cta-sm cancel-cta"
              onClick={clearReceipt}
            >
              &#x2718;
            </button>
          </>
        ) : null}
        {/* Already attached, so it has a URL of its own — worth linking, and
              there's no removing it from here: purging runs through the
              transaction's own DELETE .../receipt route. */}
        {attached ? (
          <a
            href={receiptUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="link link-secondary text-xs"
          >
            {receiptFilename}
          </a>
        ) : null}
      </div>
      <div>
        {rejection ? (
          <span className="text-error text-xs">{rejection}</span>
        ) : null}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Receipt preview"
            className={previewClassName}
          />
        ) : null}
        {attached && receiptContentType?.startsWith("image/") ? (
          <img
            src={receiptUrl ?? undefined}
            alt="Current receipt"
            className={previewClassName}
          />
        ) : null}
        <input
          ref={inputRef}
          id="transaction-receipt"
          type="file"
          accept={ACCEPTED_CONTENT_TYPES.join(",")}
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export { ReceiptUpload };
