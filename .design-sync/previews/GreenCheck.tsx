import { GreenCheck } from "@budget/design-system";

export const Default = () => (
  <div className="w-8"><GreenCheck /></div>
);

export const InRow = () => (
  <div className="flex items-center gap-2 w-72 px-3 py-2 rounded bg-base-200">
    <span className="mr-auto">Rent</span>
    <div className="w-8"><GreenCheck /></div>
  </div>
);
