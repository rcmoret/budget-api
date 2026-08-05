import { CloseButton } from "@budget/design-system";

export const Default = () => (
  <CloseButton title="Cancel" ariaLabel="Cancel edit" onClick={() => {}} />
);

export const Disabled = () => (
  <CloseButton title="Cancel" ariaLabel="Cancel edit" disabled onClick={() => {}} />
);

export const InFormFooter = () => (
  <div className="flex items-center justify-end gap-2 w-72 px-3 py-2 rounded bg-base-200">
    <CloseButton title="Cancel" ariaLabel="Cancel edit" onClick={() => {}} />
  </div>
);
