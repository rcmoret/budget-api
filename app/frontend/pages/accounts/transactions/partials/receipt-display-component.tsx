import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { router } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { useTransactionContext } from "../context-provider";
import { buildQueryParams } from "@/lib/redirect_params";
import { useAppConfigContext } from "@/components/layout/Provider";

const ReceiptDisplayComponent = () => {
  const { transaction } = useTransactionContext();
  const { appConfig } = useAppConfigContext();

  if (!transaction.receiptUrl) {
    return null;
  }

  const isPdf = transaction.receiptContentType === "application/pdf";
  const isImage = transaction.receiptContentType?.startsWith("image/");

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this receipt?")) {
      return;
    }

    const queryParams = buildQueryParams([
      "account",
      transaction.accountSlug,
      "transactions",
      appConfig.budget.data.month,
      appConfig.budget.data.year,
    ]);

    const deleteUrl = UrlBuilder({
      name: "TransactionDeleteReceipt",
      accountSlug: transaction.accountSlug,
      key: transaction.key,
      queryParams,
    });

    router.delete(deleteUrl);
  };

  return (
    <div className="flex flex-col gap-2 p-2 border border-gray-300 rounded bg-white">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-gray-600">
            <Icon name={isPdf ? "file-pdf" : "file-image"} />
          </span>
          <span className="text-sm text-gray-600">
            {transaction.receiptFilename}
          </span>
        </div>

        <div className="flex flex-row gap-2">
          <a
            href={transaction.receiptUrl}
            download
            className="text-blue-600 hover:text-blue-800"
          >
            <Icon name="download" />
          </a>
          <Button type="button" onClick={handleDelete}>
            <span className="text-red-600">
              <Icon name="trash" />
            </span>
          </Button>
        </div>
      </div>

      {isImage && (
        <div className="mt-2">
          <a
            href={transaction.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={transaction.receiptUrl}
              alt="Receipt"
              className="max-w-48 max-h-48 border border-gray-300 rounded cursor-pointer hover:opacity-80"
            />
          </a>
        </div>
      )}

      {isPdf && (
        <div className="text-sm text-gray-600">
          <a
            href={transaction.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View PDF
          </a>
        </div>
      )}
    </div>
  );
};

export { ReceiptDisplayComponent };
