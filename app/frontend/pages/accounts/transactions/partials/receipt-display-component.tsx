import { ActionIconButton } from "@/lib/theme/buttons/action-button";
import {
  CaretComponent,
  DetailWrapper,
  SummaryWithDetailsProvider,
} from "@/lib/theme/summary-with-details";
import { Icon } from "@/components/common/Icon";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { router } from "@inertiajs/react";
import { useMonthYearContext } from "@/components/layout/Provider";
import { useTransactionContext } from "../context-provider";
import { borderClasses } from "@/lib/theme/colors/borders";
import { dateParse } from "@/lib/DateFormatter";
import { textBlue, textCharcoal } from "@/lib/theme/colors/text";

const ReceiptDisplayComponent = () => {
  return (
    <SummaryWithDetailsProvider description="transaction receipt">
      <ReceiptComponent />
    </SummaryWithDetailsProvider>
  );
};

const ImgPreview = () => {
  const { transaction } = useTransactionContext();

  if (!transaction.receiptUrl) {
    return null;
  }

  return (
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
  );
};

const PdfPreview = () => {
  const { transaction } = useTransactionContext();

  if (!transaction.receiptUrl) {
    return null;
  }

  return (
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
  );
};

const ReceiptComponent = () => {
  const { transaction } = useTransactionContext();
  const { month, year } = useMonthYearContext();
  // const { showDetail } = useSummaryWithDetailsContext();

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
      month,
      year,
    ]);

    const deleteUrl = UrlBuilder({
      name: "TransactionDeleteReceipt",
      accountSlug: transaction.accountSlug,
      key: transaction.key,
      queryParams,
    });

    router.delete(deleteUrl);
  };

  const borderClassName = borderClasses("gray");

  return (
    <div
      className={`flex flex-col gap-2 p-2 ${borderClassName} rounded bg-transparent w-full md:w-1/3`}
    >
      <summary className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <CaretComponent />
          <span className={textCharcoal}>
            <Icon name={isPdf ? "file-pdf" : "file-image"} />
          </span>
          <span className={`text-sm ${textCharcoal}`}>
            Receipt uploaded at{" "}
            {dateParse(String(transaction.receiptUploadedAt))}
          </span>
        </div>
      </summary>

      <DetailWrapper>
        {isImage && <ImgPreview />}
        {isPdf && <PdfPreview />}
        <div className="flex flex-row gap-4 justify-end items-center">
          <a
            href={transaction.receiptUrl}
            download
            className={`${textBlue} hover:text-blue-400`}
          >
            <Icon name="download" />
          </a>
          <ActionIconButton
            onClick={handleDelete}
            color="red"
            icon="trash"
            title="delete receipt"
          />
        </div>
      </DetailWrapper>
    </div>
  );
};

export { ReceiptDisplayComponent };
