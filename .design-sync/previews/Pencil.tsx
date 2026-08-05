import { Pencil, IconButton } from "@budget/design-system";

// The SVG hardcodes width/height="24px", so it does not scale with its
// container — colour is the only axis that varies.
export const Default = () => (
  <span className="text-base-content"><Pencil /></span>
);

export const Tinted = () => (
  <div className="flex items-center gap-4">
    <span className="text-primary"><Pencil /></span>
    <span className="text-secondary"><Pencil /></span>
    <span className="text-error"><Pencil /></span>
  </div>
);

export const InIconButton = () => (
  <IconButton title="Row action" onClick={() => {}}><Pencil /></IconButton>
);
