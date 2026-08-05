import { ToggleSlider } from "@budget/design-system";

export const States = () => (
  <div className="flex items-center gap-6">
    <div className="flex flex-col items-center gap-1">
      <ToggleSlider toggleValue={false} onClick={() => {}} ariaLabel="Off" />
      <span className="text-xs opacity-70">off</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <ToggleSlider toggleValue onClick={() => {}} ariaLabel="On" />
      <span className="text-xs opacity-70">on</span>
    </div>
  </div>
);

export const ReadOnly = () => (
  <div className="flex items-center gap-6">
    <ToggleSlider toggleValue={false} />
    <ToggleSlider toggleValue />
  </div>
);

export const InSettingsRow = () => (
  <div className="flex items-center gap-2 w-72 px-3 py-2 rounded bg-base-200">
    <span className="mr-auto text-sm">Show accruals</span>
    <ToggleSlider toggleValue onClick={() => {}} ariaLabel="Show accruals" />
  </div>
);
