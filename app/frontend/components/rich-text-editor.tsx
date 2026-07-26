import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/cta";

// A doc Tiptap itself would call empty (an editor with nothing typed still
// reports one empty paragraph), so this is the value an untouched field
// starts from rather than `null` — keeps `useEditor`'s `content` option
// dealing in one shape.
const emptyDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

const Toolbar = ({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) => {
  return (
    <div className="flex gap-1" aria-label="notes formatting">
      <IconButton
        title="bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon name="bold" />
      </IconButton>
      <IconButton
        title="italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon name="italic" />
      </IconButton>
      <IconButton
        title="underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icon name="underline" />
      </IconButton>
    </div>
  );
};

// Deliberately narrow: only the marks/nodes "simple text decoration and
// multi-lining" calls for. Headings, lists, blockquotes, code, rules, and
// links stay off so the toolbar never has to grow to explain them.
const extensions = [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    listKeymap: false,
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    link: false,
    strike: false,
  }),
];

type RichTextEditorProps = {
  id?: string;
  value: JSONContent | null;
  onChange: (doc: JSONContent) => void;
};

const RichTextEditor = (props: RichTextEditorProps) => {
  const editor = useEditor({
    extensions,
    content: props.value ?? emptyDoc,
    onUpdate: ({ editor: updated }) => props.onChange(updated.getJSON()),
    editorProps: {
      attributes: {
        ...(props.id ? { id: props.id } : {}),
        class: "focus:outline-none [&_p]:m-0",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="textarea textarea-xs textarea-secondary w-full min-h-20 max-h-40 flex flex-col gap-1 overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  );
};

export { RichTextEditor };
