import { IconButton, Pencil, TrashIcon, Icon } from "@budget/design-system";

export const WithPencil = () => (
  <IconButton title="Edit item" onClick={() => {}}><Pencil /></IconButton>
);

export const WithTrash = () => (
  <IconButton title="Delete item" onClick={() => {}}><TrashIcon /></IconButton>
);

export const Row = () => (
  <div className="flex items-center gap-2 w-72 px-3 py-2 rounded bg-base-200">
    <span className="mr-auto">Groceries</span>
    <IconButton title="Edit item" onClick={() => {}}><Pencil /></IconButton>
    <IconButton title="Add event" onClick={() => {}}><Icon name="plus" /></IconButton>
    <IconButton title="Delete item" onClick={() => {}}><TrashIcon /></IconButton>
  </div>
);
