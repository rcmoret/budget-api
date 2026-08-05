import { CheckMarkButton, CloseButton } from "@budget/design-system";

// .round-cta only paints a background for [type=submit] (success token) and
// .cancel-cta, so a plain button variant is intentionally unfilled.
export const Submit = () => (
  <CheckMarkButton type="submit" title="Save" ariaLabel="Save changes" />
);

export const Plain = () => (
  <CheckMarkButton title="Confirm" ariaLabel="Confirm" onClick={() => {}} />
);

export const Disabled = () => (
  <CheckMarkButton type="submit" title="Save" ariaLabel="Save changes" disabled />
);

export const ConfirmCancelPair = () => (
  <div className="flex items-center gap-2">
    <CheckMarkButton type="submit" title="Save" ariaLabel="Save changes" />
    <CloseButton title="Cancel" ariaLabel="Cancel" onClick={() => {}} />
  </div>
);
