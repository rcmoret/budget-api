import { createContext, useContext } from "react";

// "toggle" - standalone toggle buttons (aria-pressed)
// "radio" - one of many mutually exclusive options (role="radio", aria-checked)
// "option" - one of many in a listbox (role="option", aria-selected)
type SelectionRole = "toggle" | "radio" | "option";

type StatureOption = "default" | "slim" | "xl";
type ColorOption = "chartreuse";

type ThemeOptions = {
  color?: ColorOption;
  stature?: StatureOption;
  showMarker?: boolean;
};

type SelectionContextValue = {
  role: SelectionRole;
  theme?: ThemeOptions;
};

const CompletionMarker = (props: { isSelected: boolean }) => {
  if (props.isSelected) {
    return <div className="font-semibold text-green-500">&#9679;</div>;
  } else {
    return <div className="text-gray-600">&#9675;</div>;
  }
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("SelectableOption must be used within a SelectionGroup");
  }
  return context;
};

// Theme configuration
type ThemeSelectionOptions = {
  selected: string;
  unselected: string;
};

const statureOptions: Record<StatureOption, ThemeSelectionOptions> = {
  default: {
    selected: "p-4 h-12",
    unselected: "px-4 py-2",
  },
  slim: {
    selected: "p-2",
    unselected: "p-2",
  },
  xl: {
    selected: "p-4 h-16 text-3xl",
    unselected: "p-4 h-16 text-3xl",
  },
};

const colorOptions: Record<ColorOption, ThemeSelectionOptions> = {
  chartreuse: {
    selected: ["bg-chartreuse-100", "ring-2", "ring-chartreuse-300"].join(" "),
    unselected: [
      "hover:ring-2",
      "hover:ring-chartreuse-300",
      "hover:bg-chartreuse-50",
      "hover:text-chartreuse-900",
    ].join(" "),
  },
};

const focusClasses = [
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-blue-500",
];

/**
 * Container component that provides selection semantics and shared theme.
 * Renders the appropriate container element based on role:
 * - "toggle" -> div
 * - "radio" -> div with role="radiogroup"
 * - "option" -> div with role="listbox"
 */
const SelectionGroup = (props: {
  role: SelectionRole;
  children: React.ReactNode;
  optionTheme?: ThemeOptions;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-multiselectable"?: boolean; // Only applies to "option" role
  className?: string;
}) => {
  const { role, children, optionTheme: theme, className } = props;

  const value: SelectionContextValue = {
    role,
    theme,
  };

  return (
    <SelectionContext.Provider value={value}>
      <div className={className}>{children}</div>
    </SelectionContext.Provider>
  );
};

type InnerButtonProps = {
  "aria-label"?: string;
  buttonClassName: string;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  role: "radio" | "option" | "toggle";
};

const InnerButton = (props: InnerButtonProps) => {
  const {
    "aria-label": ariaLabel,
    buttonClassName,
    isSelected,
    onClick,
    role,
  } = props;

  if (role === "toggle") {
    return (
      <button
        type="button"
        aria-checked={isSelected}
        aria-label={ariaLabel}
        className={buttonClassName}
        onClick={onClick}
        role="radio"
      >
        {props.children}
      </button>
    );
  }

  if (role === "option") {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        aria-selected={isSelected}
        className={buttonClassName}
        onClick={onClick}
        role="option"
      >
        {props.children}
      </button>
    );
  }

  // else toggle
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={buttonClassName}
      onClick={onClick}
      role="option"
    >
      {props.children}
    </button>
  );
};

/**
 * A selectable option button that automatically uses the correct
 * ARIA attributes based on the parent SelectionGroup's role.
 */
const SelectableOption = (props: {
  "aria-label"?: string;
  isSelected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const { role, theme } = useSelectionContext();

  const statureClasses = statureOptions[theme?.stature ?? "default"];
  const colorClass = colorOptions[theme?.color ?? "chartreuse"];
  const showMarker = theme?.showMarker ?? true;
  const { isSelected } = props;

  const sharedClasses = [
    "w-full",
    "flex",
    "flex-row",
    "text-gray-900",
    "justify-between",
    "items-center",
    "rounded",
    "transition-colors",
    ...focusClasses,
  ];

  const selectedClasses = [
    "font-semibold",
    statureClasses.selected,
    colorClass.selected,
  ];

  const unselectedClasses = [
    "bg-white",
    "text-gray-700",
    "ring-1",
    "ring-gray-200",
    statureClasses.unselected,
    colorClass.unselected,
  ];

  const buttonClassName = [
    ...sharedClasses,
    ...(isSelected ? selectedClasses : unselectedClasses),
  ].join(" ");

  return (
    <div className="w-full">
      <InnerButton
        aria-label={props["aria-label"]}
        buttonClassName={buttonClassName}
        isSelected={isSelected}
        onClick={props.onClick}
        role={role}
      >
        <div className="flex flex-row justify-between w-full items-center">
          {props.children}
          {showMarker && <CompletionMarker isSelected={isSelected} />}
        </div>
      </InnerButton>
    </div>
  );
};

export { SelectionGroup, SelectableOption, colorOptions };
export type { SelectionRole, ThemeOptions };
