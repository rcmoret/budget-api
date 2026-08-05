import { ArchiveIcon, CardLabel, CardRow } from "@budget/design-system";

export const Default = () => <ArchiveIcon title="Archive account" onClick={() => {}} />;

export const InCardLabel = () => (
  <div className="w-80">
    <CardLabel label="Old Savings">
      <ArchiveIcon title="Archive account" onClick={() => {}} />
    </CardLabel>
  </div>
);

export const InCardRow = () => (
  <div className="w-80 px-3 py-2 rounded bg-base-200">
    <CardRow>
      <span className="mr-auto text-sm">Archive this account</span>
      <ArchiveIcon title="Archive account" onClick={() => {}} />
    </CardRow>
  </div>
);
