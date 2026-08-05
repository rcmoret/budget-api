import { TrashIcon, IconButton } from "@budget/design-system";

// The SVG hardcodes width/height="24px", so it does not scale with its
// container — colour is the only axis that varies.
export const Default = () => (
  <span className="text-base-content"><TrashIcon /></span>
);

export const Tinted = () => (
  <div className="flex items-center gap-4">
    <span className="text-primary"><TrashIcon /></span>
    <span className="text-secondary"><TrashIcon /></span>
    <span className="text-error"><TrashIcon /></span>
  </div>
);

export const InIconButton = () => (
  <IconButton title="Row action" onClick={() => {}}><TrashIcon /></IconButton>
);
