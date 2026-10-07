import { HeaderComponent, PageComponent } from "@frontend/layout";
import { BudgetCategoryItemsIndex, CategoryBudgetItem } from "@/types/budget";
import { DiscretionaryDetails } from "@/types/budget/discretionary";
import { initBudgetMonthStore, getBudgetMonth } from "../month-store";
import {
  initNeighborLinksStore,
  getNeighborLinks,
} from "../neighbor-links-store";
import { useInitAdjustmentStore } from "@/lib/adjustment-amount-store";
import { useNeighborLinksKeyBoardHandlers } from "@/utils/hooks/neighbors-keyboard-nav";
import { NeighborLinks } from "@/components/neighbor-links";
import { CategoryItemsGroup } from "./group";
import { RightColumn } from "./right-column";

const CategoryItemsNeighborLinks = () => {
  const { previous, next } = getNeighborLinks();

  return <NeighborLinks nextMonth={next} previousMonth={previous} />;
};

// Item names are their category's name
const Header = (props: { categoryName: string }) => {
  const budgetMonth = getBudgetMonth();

  return (
    <HeaderComponent rightColumnComponent={<CategoryItemsNeighborLinks />}>
      {props.categoryName} &middot; {budgetMonth.monthName} {budgetMonth.year}
    </HeaderComponent>
  );
};

const CategoryItemsComponent = (props: {
  items: Array<CategoryBudgetItem>;
  discretionary: DiscretionaryDetails;
}) => {
  const { items, discretionary } = props;

  useNeighborLinksKeyBoardHandlers();

  return (
    <PageComponent
      header={<Header categoryName={items[0]?.name ?? ""} />}
      mainId="budget-category-items"
      mainComponentClassNames={["w-full"]}
      rightColumn={<RightColumn discretionary={discretionary} />}
      secondaryPanelLabel="Month details"
    >
      <CategoryItemsGroup items={items} />
    </PageComponent>
  );
};

const BudgetCategoryItems = (props: BudgetCategoryItemsIndex) => {
  const { items, budgetMonth, discretionary } = props;

  initBudgetMonthStore({ budgetMonth });
  initNeighborLinksStore({
    previous: {
      href: budgetMonth.previousMonth.href,
      label: budgetMonth.previousMonth.monthName,
    },
    next: {
      href: budgetMonth.nextMonth.href,
      label: budgetMonth.nextMonth.monthName,
    },
  });
  useInitAdjustmentStore();

  return <CategoryItemsComponent items={items} discretionary={discretionary} />;
};

export default BudgetCategoryItems;
