import { Button } from "@/components/common/Button";
import { dateParse } from "@/lib/DateFormatter";
import { useTransactionContext } from "@/pages/accounts/transactions/context-provider";

type ClearanceDateDisplayProps = {
  clearanceDate: string;
  shortClearanceDate: string;
  onClick?: () => void;
};

const ClearanceDateDisplay = (props: ClearanceDateDisplayProps) => {
  const { clearanceDate, shortClearanceDate, onClick } = props;

  return (
    <div className="w-4/12">
      <Button
        type="button"
        onClick={onClick || (() => {})}
        styling={{ width: "w-full", textAlign: "text-left" }}
      >
        <span className="max-sm:hidden">{clearanceDate}</span>
        <span className="sm:hidden">{shortClearanceDate}</span>
      </Button>
    </div>
  );
};

const ClearanceDateComponent = () => {
  const { transaction, showForm } = useTransactionContext();
  const { isPending } = transaction;

  const clearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate));
  const shortClearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate), {
        format: "m/d/yy",
      });

  return (
    <ClearanceDateDisplay
      clearanceDate={clearanceDate}
      shortClearanceDate={shortClearanceDate}
      onClick={showForm}
    />
  );
};

export { ClearanceDateComponent, ClearanceDateDisplay };
