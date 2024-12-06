import { AmountSpan } from "@/components/common/AmountSpan";
import { Button } from "@/components/common/Button";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { dateParse } from "@/lib/DateFormatter";
import { TransactionContainer } from "@/pages/accounts/transactions/container";
import {
  BudgetItemAmounts,
  BudgetItemsDescription,
  CaretComponent,
  ClearanceDateComponent,
  DescriptionComponent,
  DeleteIcon,
} from "@/pages/accounts/transactions/common";
import { useToggle } from "@/lib/hooks/useToogle";
import { TransactionWithBalance } from "@/pages/accounts/transactions";

const TransactionShow = (props: {
  transaction: TransactionWithBalance;
  showFormFn: (key: string) => void;
}) => {
  const [isDetailShown, toggleDetailView] = useToggle(false);
  const { transaction, showFormFn } = props;
  const {
    key,
    isBudgetExclusion,
    checkNumber,
    description,
    details,
    isPending,
    notes,
    transferKey,
  } = transaction;
  const clearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate));
  const shortClearanceDate = isPending
    ? "Pending"
    : dateParse(String(transaction.clearanceDate), {
        format: "m/d/yy",
      });

  let noteLines: string[] = [];
  const notesNeedAttn = !!notes?.startsWith("!!!");
  if (notes) {
    noteLines = notes.replace(/^!!!\s/, "").split("<br>");
  }
  const toggleForm = () => showFormFn(key)

  return (
    <TransactionContainer
      keyComponent={<div className="hidden">{key}</div>}
      caretComponent={
        <CaretComponent
          details={details}
          isDetailShown={isDetailShown}
          toggleFn={toggleDetailView}
        />
      }
      clearanceDateComponent={
        <ClearanceDateComponent
          clearanceDate={clearanceDate}
          shortClearanceDate={shortClearanceDate}
          toggleForm={toggleForm}
        />
      }
      descriptionComponent={<DescriptionComponent
        transaction={transaction}
        isDetailShown={isDetailShown}
        toggleForm={toggleForm}
      />}
      transactionAmountComponent={
        <BudgetItemAmounts
          details={details}
          amount={transaction.amount}
          isDetailShown={isDetailShown}
          toggleForm={toggleForm}
        />
      }
      balanceCompnent={
        <AmountSpan amount={transaction.balance} negativeColor="text-red-400" />
      }
    >
      <Cell
        styling={{
          display: "flex",
          width: "w-full md:w-4/12",
          flexAlign: "justify-start",
          flexWrap: "flex-wrap",
        }}
      >
        {!!description && details.length === 1 && !isDetailShown && (
          <div className="md:ml-4 w-full md:w-unset">
            <BudgetItemsDescription details={details} />
          </div>
        )}
        {isBudgetExclusion && (
          <div className="md:ml-4 md:max-w-2/12 w-full italic">
            budget exclusion
          </div>
        )}
        {checkNumber && (
          <div className="md:ml-4">
            <Icon name="money-check" /> {checkNumber}
          </div>
        )}
        {transferKey && (
          <div className="md:ml-4 w-full md:max-w-2/12 italic">
            <span className="hidden">{transferKey}</span>
            transfer
          </div>
        )}
        {!!noteLines.length && (
          <Notes noteLines={noteLines} notesNeedAttn={notesNeedAttn} />
        )}
      </Cell>
      <Cell
        styling={{
          width: "md:w-[14%] w-full",
          flexAlign: "md:justify-start justify-end",
          margin: "md:mr-4",
        }}
      >
        <div className="w-full flex flex-row-reverse">
          <DeleteIcon
            transaction={transaction}
          />
          <Button
            type="button"
            onClick={toggleForm}
            styling={{ color: "text-blue-300" }}
          >
            <div className="mr-2">
              <Icon name="edit" />
            </div>
          </Button>
        </div>
      </Cell>
    </TransactionContainer>
  );
};

const Notes = (props: { noteLines: string[]; notesNeedAttn: boolean }) => {
  const className = [
    "md:ml-2",
    "w-full",
    "md:max-w-4/12",
    "md:pl-2",
    "pr-2",
    ...(props.notesNeedAttn ? ["bg-teal-400", "text-white", "rounded"] : []),
  ].join(" ");

  return (
    <div className={className}>
      {props.noteLines.map((noteLine: string, index: number) => (
        <div key={index} className="w-full">
          {index === 0 && <Icon name="sticky-note" />} {noteLine}
        </div>
      ))}
    </div>
  );
};

export { TransactionShow };
