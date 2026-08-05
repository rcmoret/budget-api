import {
  CreateEventSelectProvider,
  CreateEventSelectComponent,
} from "@budget/design-system";

// Reads its options from CreateEventSelectProvider's context, so it can only be
// previewed inside that provider. Events are fetched lazily on focus, so the
// resting state is the "Add an item" placeholder — one cell only, because the
// provider's `scopes` / `eventContext` props change which events are fetched,
// not how the control looks at rest.
export const Initialized = () => (
  <div className="w-72">
    <CreateEventSelectProvider
      scopes={["monthly"]}
      eventContext="current"
      month={2}
      year={2026}
    >
      <CreateEventSelectComponent aria-label="Add a budget item" />
    </CreateEventSelectProvider>
  </div>
);
