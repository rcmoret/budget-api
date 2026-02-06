import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { useTransactionContext } from "@/pages/accounts/transactions/context-provider";

const Notes = () => {
  const {
    transaction: { notes },
  } = useTransactionContext();

  let noteLines: string[] = [];
  const notesNeedAttn = !!notes?.startsWith("!!!");

  if (notes) {
    noteLines = notes.replace(/^!!!\s/, "").split("<br>");
  }

  const className = [
    "md:ml-2",
    "w-full",
    "md:max-w-4/12",
    "md:pl-2",
    "pr-2",
    ...(notesNeedAttn ? ["bg-teal-400", "text-white", "rounded"] : []),
  ].join(" ");

  return (
    <div className={className}>
      {noteLines.map((noteLine: string, index: number) => (
        <div key={index} className="w-full">
          {index === 0 && <Icon name="sticky-note" />} {noteLine}
        </div>
      ))}
    </div>
  );
};

const EntryDetailsComponent = () => {
  const {
    transaction: { checkNumber, isBudgetExclusion, transferKey, notes },
  } = useTransactionContext();

  const hasNotes = !!notes;

  return (
    <Cell
      styling={{
        display: "flex",
        width: "w-full md:w-2/12",
        flexAlign: "justify-start",
        flexWrap: "flex-wrap",
      }}
    >
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
      {hasNotes && <Notes />}
    </Cell>
  );
};

export { EntryDetailsComponent };
