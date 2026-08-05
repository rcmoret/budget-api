import { RightColumnWrapper, BudgetSummaryComponent } from "@budget/design-system";

export const WithContent = () => (
  <div className="w-80">
    <RightColumnWrapper>
      <BudgetSummaryComponent
        label="February 2026"
        values={[
          { key: "income", label: "Income", amount: { cents: 482500, display: "$4,825.00" } },
          { key: "spent", label: "Spent", amount: { cents: -359450, display: "-$3,594.50" } },
        ]}
      />
    </RightColumnWrapper>
  </div>
);

export const Empty = () => (
  <div className="w-80">
    <div className="text-sm opacity-70 mb-1">no children — renders nothing at all</div>
    <RightColumnWrapper>{null}</RightColumnWrapper>
  </div>
);
