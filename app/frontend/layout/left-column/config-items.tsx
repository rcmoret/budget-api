import {
  useIsDarkTheme,
  useShowAccruals,
  useToggleShowAccruals,
  useToggleTheme,
} from "@frontend/layout/app-config-store";
import { ToggleSlider } from "@frontend/components/slider";

const menuLabelClassName = [
  "flex",
  "flex-row",
  "gap-2",
  "text-sm",
  "px-2",
  "list-none",
  "text-primary-content",
  "[&::-webkit-details-marker]:hidden",
].join(" ");

const outerButtonClassName = [
  "w-full",
  "overflow-hidden",
  "not-last:border-b",
  "not-last:border-neutral",
].join(" ");

const innerButtonClassName = [
  "px-2",
  "py-1",
  "flex",
  "flex-row",
  "items-center",
  "justify-between",
  "gap-2",
  "text-xs",
  "text-base-content",
  "w-full",
].join(" ");

const ThemeToggle = () => {
  const isDark = useIsDarkTheme();
  const toggleTheme = useToggleTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={outerButtonClassName}
    >
      <div className={innerButtonClassName}>
        <div>Dark Mode</div>
        <div className="grid items-center">
          <ToggleSlider toggleValue={isDark} ariaLabel="toggle dark mode" />
        </div>
      </div>
    </button>
  );
};

const AppConfigItems = () => {
  const showAccruals = useShowAccruals();
  const toggleShowAccruals = useToggleShowAccruals();

  return (
    <details className="collapse rounded-none pb-4" name="my-accordion-det-1">
      <summary className="list-none [&::-webkit-details-marker]:hidden">
        <div className={menuLabelClassName}>
          <div>&#9965;</div>
          <div>Config Options</div>
        </div>
      </summary>
      <div className="collapse-content w-full px-2 py-1 mt-2 ">
        <div className="bg-base-300 text-base-content rounded">
          <button
            type="button"
            onClick={toggleShowAccruals}
            className={outerButtonClassName}
          >
            <div className={innerButtonClassName}>
              <div>Toggle Accrual Items</div>
              <div className="grid items-center">
                <ToggleSlider
                  toggleValue={showAccruals}
                  ariaLabel="toggle accrual items"
                />
              </div>
            </div>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </details>
  )
}

export { AppConfigItems }
