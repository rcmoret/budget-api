import { Pill } from "@budget/design-system";

export const Kinds = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Pill themeOption="notice">Cleared</Pill>
    <Pill themeOption="info">Scheduled</Pill>
    <Pill themeOption="warning">Pending</Pill>
    <Pill themeOption="alert">Overdue</Pill>
  </div>
);

export const InContext = () => (
  <div className="flex items-center justify-between gap-3 w-72 px-3 py-2 rounded bg-base-200">
    <span>Rent</span>
    <Pill themeOption="notice">Cleared</Pill>
  </div>
);
