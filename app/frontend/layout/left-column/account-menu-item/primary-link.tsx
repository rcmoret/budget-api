import { Link } from "@inertiajs/react";
import { useAccountMenuContext } from ".";
import { useAppRoutes } from "@/layout/app-config-store";

const AccountLinkToggleButton = () => {
  const { isMenuOpen, toggleMenuOpen } = useAccountMenuContext();

  const className = ["px-1", ...(isMenuOpen ? [] : ["-rotate-90"])].join(" ");

  return (
    <button
      aria-label="Toggle accounts menu"
      aria-haspopup="true"
      className={className}
      aria-expanded={isMenuOpen}
      onClick={toggleMenuOpen}
    >
      ▾
    </button>
  );
};

const PrimaryAccountLink = () => {
  const accountItemUrl = useAppRoutes("accountMenuRoute");
  return (
    <div className="flex items-center gap-2">
      <Link href={accountItemUrl}>Accounts</Link>
      <AccountLinkToggleButton />
    </div>
  );
};

export { PrimaryAccountLink };
