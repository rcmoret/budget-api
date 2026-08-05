import { UnarchiveIcon, CardRow } from "@budget/design-system";

export const Default = () => <UnarchiveIcon title="Restore account" onClick={() => {}} />;

export const InCardRow = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <CardRow>
      <span className="mr-auto text-sm">Restore this account</span>
      <UnarchiveIcon title="Restore account" onClick={() => {}} />
    </CardRow>
  </div>
);
