import { Link } from "@inertiajs/react";
import { useAccountMenuContext } from ".";
import { useAppRoutes } from "@/lib/app-stores/app-config-store";

const AccountLinkToggleButton = () => {
  const { isMenuOpen, toggleMenuOpen } = useAccountMenuContext();

  const className = [
    "px-1",
    "transition-all",
    "duration-400",
    "text-sm",
    ...(isMenuOpen ? ["rotate-90"] : []),
  ].join(" ");

  return (
    <button
      aria-label="Toggle accounts menu"
      aria-haspopup="true"
      className={className}
      aria-expanded={isMenuOpen}
      onClick={toggleMenuOpen}
    >
      &#10095;
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
