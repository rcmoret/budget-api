import { PublicShell } from "@budget/design-system";

// Client shell for server-rendered, non-Inertia pages (Devise). It initialises
// the logged-out-safe stores and renders the flash notifications it is given.
export const WithFlashes = () => (
  <div className="w-96">
    <PublicShell
      notifications={{
        alerts: ["Invalid email or password."],
        info: [],
        notices: ["Check your email to confirm your account."],
        warnings: [],
      }}
    />
  </div>
);
