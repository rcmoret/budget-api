import { AppConfigItems } from "@budget/design-system";

// AppConfigItems is styled for the dark left column (text-primary-content is
// near-white), so it must sit on a primary surface to be legible.
export const InLeftColumn = () => (
  <div className="w-64 py-4 rounded bg-primary">
    <AppConfigItems />
  </div>
);
