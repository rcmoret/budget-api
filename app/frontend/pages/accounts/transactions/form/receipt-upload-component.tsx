import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { useTransactionFormContext } from "./context-provider";
import { useState, useRef } from "react";

const ReceiptUploadComponent = () => {
  const { data, updateFormData, transaction } = useTransactionFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasExistingReceipt =
    transaction.receiptUrl && !data.receipt;

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, or PDF file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be less than 10MB");
      return;
    }

    updateFormData({ name: "receipt", value: file });

    // Create preview for images only
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    updateFormData({ name: "receipt", value: null });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <Button type="button" onClick={handleClick}>
          <span className="text-gray-600">
            <Icon name="paperclip" />
          </span>
        </Button>

        {(data.receipt || hasExistingReceipt) && (
          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm text-gray-600">
              {data.receipt
                ? data.receipt.name
                : transaction.receiptFilename}
            </span>
            <Button type="button" onClick={handleRemove}>
              <span className="text-red-600">
                <Icon name="times-circle" />
              </span>
            </Button>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Receipt preview"
            className="max-w-32 max-h-32 border border-gray-300 rounded"
          />
        </div>
      )}

      {hasExistingReceipt && !previewUrl && transaction.receiptContentType?.startsWith("image/") && (
        <div className="mt-2">
          <img
            src={transaction.receiptUrl}
            alt="Current receipt"
            className="max-w-32 max-h-32 border border-gray-300 rounded"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export { ReceiptUploadComponent };
