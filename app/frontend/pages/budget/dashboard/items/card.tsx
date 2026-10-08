import { ActiveItemCard, CardLabel, CardRow } from "@/components/card";
import { ItemContextProvider, useBudgetItemContext } from "./context-provider";
import { BudgetItem } from "@/types/budget";
import { AmountSpan } from "@/components/amount-span";
import { Icon } from "@/components/icon";
import { VariableItemCard } from "./variable-item-card";
import { ItemCompositionDetails } from "./previous-current-budget-indicator";
import { AccrualPill, ClearedItemPill } from "./pills";
import { BottomRow } from "./bottom-row";
import {
  useAdjustmentInputsContext,
  AdjustmentInputsProvider,
} from "@/components/adjustment-input/context-provider";
import { TotalInput } from "@/components/adjustment-input";
import { Link } from "@inertiajs/react";
import { KeyIdentifier } from "@/components/key-identifier";
import { Collapse } from "@/components/collapse";
import { useToggle } from "@/utils/hooks/useToogle";
import { Pill } from "@/components/pill";

const itemsPath = (item: BudgetItem) =>
  `/budget/${item.month}/${item.year}/items/${item.budgetCategorySlug}`;

type CollapseState = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

// A collapsible card's name toggles it open and closed; otherwise it's plain
// text. The link to the category's items page is the arrow beside it.
const ItemName = (props: { collapse: CollapseState | null }) => {
  const { item } = useBudgetItemContext();
  const { collapse } = props;

  if (collapse) {
    return (
      <button
        type="button"
        onClick={collapse.toggleExpanded}
        className="cursor-pointer hover:underline truncate min-w-0"
        aria-expanded={collapse.isExpanded}
      >
        {item.name}
      </button>
    );
  } else {
    return <div className="truncate min-w-0">{item.name}</div>;
  }
};

const ItemsLinkArrow = () => {
  const { item } = useBudgetItemContext();
  const label = `View ${item.name}`;

  return (
    <Link
      href={itemsPath(item)}
      title={label}
      aria-label={label}
      className="shrink-0 text-sm text-base-content/66 hover:text-base-content"
    >
      <Icon name="arrow-right" />
    </Link>
  );
};

const LabelMain = (props: {
  linkToItems: boolean;
  collapse: CollapseState | null;
}) => {
  const { item } = useBudgetItemContext();

  return (
    <div className="flex flex-row gap-2 items-center min-w-0">
      <ItemName collapse={props.collapse} />
      <div className="shrink-0">
        <Icon name={item.iconClassName} />
      </div>
      {props.linkToItems && <ItemsLinkArrow />}
    </div>
  );
};

const BudgetItemCardLabel = (props: {
  linkToItems: boolean;
  collapse: CollapseState | null;
  showKey: boolean;
}) => {
  const { item } = useBudgetItemContext();

  return (
    <CardLabel
      label={
        <LabelMain linkToItems={props.linkToItems} collapse={props.collapse} />
      }
    >
      <div className="flex items-center gap-2">
        {/* A cleared fixed item always has $0.00 remaining, so the cleared
            pill takes the amount's place. */}
        {item.isCleared && item.isFixed ? (
          <Pill themeOption="info">cleared item</Pill>
        ) : (
          <AmountSpan
            amount={item.remaining.cents}
            colorize="none"
            absolute={true}
          />
        )}
        {/* At md and up the key identifier sits in the bottom row. */}
        {props.showKey && (
          <div className="md:hidden flex">
            <KeyIdentifier
              identifier={item.key}
              className="text-base-content/66"
            />
          </div>
        )}
      </div>
    </CardLabel>
  );
};

const FixedItemCard = () => {
  const { editingTotal, totalInputId } = useAdjustmentInputsContext();

  if (!editingTotal) return null;

  return (
    <CardRow minHeight="lg">
      <label htmlFor={totalInputId}>Budgeted</label>
      <div>
        <TotalInput />
      </div>
    </CardRow>
  );
};

const InnerCard = () => {
  const { item } = useBudgetItemContext();

  if (item.isVariable) {
    return <VariableItemCard />;
  } else {
    return <FixedItemCard />;
  }
};

// `children` renders below the item's details, above the pills and bottom
// row.
// `linkToItems` adds an arrow linking to the item's category items page. It
// also makes variable items collapsible, starting with their budgeted/spent
// rows hidden.
// `showDetails` renders the previously/currently budgeted breakdown, the key
// identifier and the edit/delete buttons.
const BudgetItemCard = (props: {
  item: BudgetItem;
  children?: React.ReactNode;
  linkToItems?: boolean;
  showDetails?: boolean;
}) => {
  const { item, children, linkToItems = false, showDetails = false } = props;
  const [isExpanded, toggleExpanded] = useToggle(false);

  const isCollapsible = linkToItems && !item.isFixed;
  const isCollapsed = isCollapsible && !isExpanded;
  const collapse = isCollapsible ? { isExpanded, toggleExpanded } : null;

  // A cleared fixed item's pill sits in the label row instead of the body.
  const hasPills = (item.isCleared && !item.isFixed) || item.isAccrual;

  // A fixed (or collapsed variable) item with no pills, details or children
  // has an empty body, so the card collapses to its label row: drop the
  // label's bottom border and the gap above the body. The body stays
  // rendered so a collapsed item's rows can still animate open.
  const isSingleLine =
    (item.isFixed || isCollapsed) && !hasPills && !showDetails && !children;

  // With details shown, the pills sit just above the bottom row, set off by
  // a divider.
  const pills = (
    <>
      <ClearedItemPill />
      <AccrualPill />
    </>
  );

  // The label row already has a bottom border, so the first section in the
  // card body (e.g. transactions on a fixed item) drops its top border.
  const firstSectionClasses = [
    "[&>*:last-child>*:first-child]:border-t-0",
    "[&>*:last-child>*:first-child]:pt-0",
    "[&>*:last-child>*:first-child]:mt-0",
  ];

  const singleLineClasses = [
    "gap-0!",
    "[&>*:first-child]:border-b-0",
    "[&>*:first-child]:pb-0",
  ];

  return (
    <AdjustmentInputsProvider objectKey={item.objectKey}>
      <ItemContextProvider item={item}>
        <ActiveItemCard
          key={item.objectKey}
          id={item.objectKey}
          label={
            <BudgetItemCardLabel
              linkToItems={linkToItems}
              collapse={collapse}
              showKey={showDetails}
            />
          }
          additionalClasses={[
            ...(isSingleLine ? singleLineClasses : []),
            ...firstSectionClasses,
          ]}
        >
          {isCollapsible ? (
            <Collapse open={isExpanded}>
              <InnerCard />
            </Collapse>
          ) : (
            <InnerCard />
          )}
          {!showDetails && pills}
          {showDetails && <ItemCompositionDetails />}
          {children}
          {showDetails && hasPills && (
            <div className="flex flex-col gap-1 border-t border-primary/20 pt-2 mt-2">
              {pills}
            </div>
          )}
          {showDetails && <BottomRow />}
        </ActiveItemCard>
      </ItemContextProvider>
    </AdjustmentInputsProvider>
  );
};

export { BudgetItemCard };
