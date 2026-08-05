// Design-system barrel for /design-sync. This is the entry the converter
// bundles into `window.BudgetDS` — it defines the public surface the
// claude.ai/design agent builds with.
//
// Two source-level name collisions are resolved here (both originals stay in
// active use in the app; the bundle can only expose one export per name):
//   RadioInput  -> selectable.tsx  (controlled: checked/onChange)
//   FormRadioInput <- radio.tsx    (uncontrolled: name/defaultChecked)
//   CloseButton -> close-button.tsx (round red cancel, .cancel-cta)
//   CtaCloseButton <- cta/index.tsx
//
// Adding a component to the design system = adding it here AND to
// `componentSrcMap` in .design-sync/config.json (which is what produces its
// card, .d.ts and .prompt.md).

/* ── content & data display ─────────────────────────────────────────────── */
export { AmountSpan } from "../app/frontend/components/amount-span";
export { BudgetSummaryComponent } from "../app/frontend/components/budget-summary";
export { BudgetMonthSummary } from "../app/frontend/components/budget-month";
export { GroupLabel } from "../app/frontend/components/group-label";
export { KeyIdentifier } from "../app/frontend/components/key-identifier";
export { Pill } from "../app/frontend/components/pill";

/* ── structure ──────────────────────────────────────────────────────────── */
export { Collapse } from "../app/frontend/components/collapse";
export { RightColumnWrapper } from "../app/frontend/components/right-column-bordered";

/* ── actions ────────────────────────────────────────────────────────────── */
export { CloseButton } from "../app/frontend/components/close-button";
export {
  CheckMarkButton,
  IconButton,
  CloseButton as CtaCloseButton,
} from "../app/frontend/components/cta";

/* ── form controls ──────────────────────────────────────────────────────── */
export { RadioInput as FormRadioInput } from "../app/frontend/components/radio";
export {
  RadioInput,
  SelectableGroup,
  SelectableInput,
} from "../app/frontend/components/selectable";
export { ToggleSlider } from "../app/frontend/components/slider";
export { ThemedSelect } from "../app/frontend/components/themed-select";
export {
  AdjustmentInput,
  GenericAmountInput,
  TotalInput,
} from "../app/frontend/components/adjustment-input";
export { AdjustmentInputsProvider } from "../app/frontend/components/adjustment-input/context-provider";

/* ── cards ──────────────────────────────────────────────────────────────── */
export {
  ActiveItemCard,
  ArchivedItemCard,
  ArchivedAtRow,
  ArchiveIcon,
  UnarchiveIcon,
  CardLabel,
  CardRow,
  CloseFormButton,
  EditButton,
} from "../app/frontend/components/card";

/* ── icons ──────────────────────────────────────────────────────────────── */
export { Icon, GreenCheck } from "../app/frontend/components/icon";
export { Pencil } from "../app/frontend/components/icons/pencil";
export { TrashIcon } from "../app/frontend/components/icons/trash";

/* ── navigation ─────────────────────────────────────────────────────────── */
export { NeighborLinks } from "../app/frontend/components/neighbor-links";

/* ── app shell (Inertia/store-coupled — importable, previews may be floor
      cards where a static render can't supply the router/page context) ───── */
export { PageComponent, HeaderComponent } from "../app/frontend/layout/index";
export { PublicShell } from "../app/frontend/layout/public-shell";
export { LeftColumn } from "../app/frontend/layout/left-column";
export { AppConfigItems } from "../app/frontend/layout/left-column/config-items";
export { MenuItems } from "../app/frontend/layout/left-column/menu-item";
export { AccountMenuComponent } from "../app/frontend/layout/left-column/account-menu-item";
export { IndividualAccountLinks } from "../app/frontend/layout/left-column/account-menu-item/dropdown-account-links";
export { PrimaryAccountLink } from "../app/frontend/layout/left-column/account-menu-item/primary-link";
export { Notifications } from "../app/frontend/layout/notifications";

/* ── forms (Inertia-coupled) ────────────────────────────────────────────── */
export {
  CreateEventSelectComponent,
  CreateEventSelectProvider,
} from "../app/frontend/components/create-event-form";
