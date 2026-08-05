import { MenuItems } from "@budget/design-system";

// Styled for the dark left column — text-primary-content is near-white, so it
// needs a primary surface to be legible.
export const Group = () => (
  <div className="w-64 bg-primary p-2 rounded text-primary-content">
    <MenuItems label="Budget">
      <div className="px-2">Dashboard</div>
      <div className="px-2">Categories</div>
      <div className="px-2">Events</div>
    </MenuItems>
  </div>
);

export const TwoGroups = () => (
  <div className="w-64 bg-primary p-2 rounded text-primary-content">
    <MenuItems label="Budget">
      <div className="px-2">Dashboard</div>
      <div className="px-2">Categories</div>
    </MenuItems>
    <MenuItems label="Manage">
      <div className="px-2">Accounts</div>
      <div className="px-2">Profile</div>
    </MenuItems>
  </div>
);
