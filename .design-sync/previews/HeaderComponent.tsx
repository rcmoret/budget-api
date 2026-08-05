import { HeaderComponent, NeighborLinks } from "@budget/design-system";

export const WithTitle = () => (
  <div className="w-[32rem]"><HeaderComponent title="Accounts" /></div>
);

export const WithChildren = () => (
  <div className="w-[32rem]"><HeaderComponent>February 2026</HeaderComponent></div>
);

export const WithRightColumn = () => (
  <div className="w-[32rem] flex items-center justify-between gap-4">
    <HeaderComponent
      title="Budget"
      rightColumnComponent={
        <NeighborLinks
          previousMonth={{ href: "/budget/2026/01", label: "January" }}
          nextMonth={{ href: "/budget/2026/03", label: "March" }}
        />
      }
    />
  </div>
);

export const DefaultTitle = () => (
  <div className="w-[32rem]"><HeaderComponent /></div>
);
