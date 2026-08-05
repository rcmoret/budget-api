// Preview-only seeding helpers, merged into window.BudgetDS via cfg.extraEntries.
//
// Several components in this design system take no props and read everything
// from a zustand store (IndividualAccountLinks, Notifications, PrimaryAccountLink
// via app routes). With an empty store they render nothing at all, which is why
// they showed the floor card.
//
// These must be re-exported through the BUNDLE rather than imported directly in
// a preview: a relative import from a preview file would be bundled separately
// and create a *second* copy of each store module, so seeding it would have no
// effect on the components inside the bundle. Going through extraEntries keeps
// one shared module instance.
//
// Not part of the design system's component API — an app supplies this state
// from its own page props.
export { initNavigationLinks } from "../app/frontend/layout/account-navigation-store";
export { useAppConfigStore } from "../app/frontend/lib/app-stores/app-config-store";
export { useDispatchNotificationStore } from "../app/frontend/lib/app-stores/notification-store";
export { useBudgetMonthStore } from "../app/frontend/pages/budget/month-store";
