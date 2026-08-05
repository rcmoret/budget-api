import { NeighborLinks } from "@budget/design-system";

export const MonthPager = () => (
  <div className="w-80">
    <NeighborLinks
      previousMonth={{ href: "/budget/2026/01", label: "January" }}
      nextMonth={{ href: "/budget/2026/03", label: "March" }}
    />
  </div>
);

export const YearBoundary = () => (
  <div className="w-80">
    <NeighborLinks
      previousMonth={{ href: "/budget/2025/12", label: "December 2025" }}
      nextMonth={{ href: "/budget/2026/02", label: "February 2026" }}
    />
  </div>
);
