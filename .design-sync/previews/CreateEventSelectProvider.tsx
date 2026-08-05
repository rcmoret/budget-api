import {
  CreateEventSelectProvider,
  CreateEventSelectComponent,
} from "@budget/design-system";

// The provider renders no markup itself — it owns the fetched event list, the
// amount field, validation errors and the submit handler. Events are fetched
// lazily on focus, so the select sits in its "initialized" state here.
export const WrappingTheSelect = () => (
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
