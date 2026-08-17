import { RichTextEditor } from "@/components/rich-text-editor";
import { useEditStore } from "./store";

const Notes = () => {
  const notes = useEditStore((s) => s.notes);
  const setNotes = useEditStore((s) => s.setNotes);

  return (
    <div className="grid gap-1">
      <label htmlFor="edit-month-notes">Notes</label>
      <RichTextEditor id="edit-month-notes" value={notes} onChange={setNotes} />
    </div>
  );
};

export { Notes };
