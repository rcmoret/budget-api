import { CtaCloseButton } from "@budget/design-system";

// NOTE: this variant applies `.cancel` rather than `.cancel-cta`, and
// `.cancel` is not defined in ctas.css — so it renders with the base
// .round-cta shape and no red fill. Prefer CloseButton for a real cancel.
export const Default = () => (
  <CtaCloseButton title="Cancel" ariaLabel="Cancel" onClick={() => {}} />
);

export const Disabled = () => (
  <CtaCloseButton title="Cancel" ariaLabel="Cancel" disabled onClick={() => {}} />
);
