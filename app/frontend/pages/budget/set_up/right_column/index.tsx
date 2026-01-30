import { useForm, Link } from "@inertiajs/react";
import { SubmitButton } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { useSetupEventsFormContext } from "@/pages/budget/set_up";
import { CategoryShow } from "@/pages/budget/set_up/categories";
import { EventShow } from "@/pages/budget/set_up/events";
import { Point } from "@/components/common/Symbol";
import { BudgetSummary } from "@/pages/budget/set_up/right_column/budget-summary";
import { CircleNavButtons } from "@/components/common/NavCircles";
import { AccrualComponent } from "./accrual-component";
import { EventCard } from "./event-card";
import {
  CategoryAverages,
  CategoryAveragesProvider,
  SummaryUpdateButton,
  useCategoryAveragesContext,
} from "@/components/common/budget/category-chart";
import { DateFormatter } from "@/lib/DateFormatter";
import { UrlBuilder } from "@/lib/UrlBuilder";

const CategoryAveragesContainer = () => {
  const { isHidden } = useCategoryAveragesContext();

  if (isHidden) {
    return <SummaryUpdateButton />;
  } else {
    return <CategoryAverages />;
  }
};

const SubmitChangeButton = () => {
  const {
    metadata: { month, year, isSubmittable },
  } = useSetupEventsFormContext();
  const { post, processing } = useForm();

  if (!isSubmittable) {
    return null;
  }

  const onSubmit = () => {
    const url = UrlBuilder({ name: "BudgetSetUp", month, year });
    post(url);
  };

  return (
    <SubmitButton
      onSubmit={onSubmit}
      isEnabled={!processing}
      styling={{
        color: "text-white",
        shadow: "shadow-md",
        backgroundColor: "bg-green-500",
        hoverColor: "hover:bg-green-600",
        fontWeight: "font-semibold",
        rounded: "rounded",
        padding: "px-4 py-2",
        display: "flex",
        gap: "gap-2",
      }}
      disabledStyling={{
        color: "text-black",
        backgroundColor: "bg-gray-300",
        hoverColor: "hover:bg-gray-300",
        cursor: "cursor-not-allowed",
      }}
    >
      Setup {DateFormatter({ month, year, format: "shortMonthYear" })}
      <div className={processing ? "text-gray-300" : "text-chartreuse-200"}>
        <Icon name="check-circle" />
      </div>
    </SubmitButton>
  );
};

const AddNewButton = () => {
  const { budgetCategory: category, metadata } = useSetupEventsFormContext();

  const className = [
    "bg-green-400",
    "text-white",
    "py-1",
    "px-3",
    "rounded-xl",
    "text-sm",
  ].join(" ");

  if (category.isMonthly) {
    return (
      <div className={className}>
        <Link
          href={`/budget/${metadata.month}/${metadata.year}/set-up/${category.slug}/new-event`}
          method="post"
          as="button"
        >
          <div className="flex flex-row gap-2 font-semibold items-center">
            <div className="text-xs">
              <Icon name="plus" />
            </div>
            Add Item
          </div>
        </Link>
      </div>
    );
  } else {
    return null;
  }
};

const RightColumn = () => {
  const {
    budgetCategory: category,
    changePreviousCategory,
    changeNextCategory,
    metadata,
  } = useSetupEventsFormContext();

  // Build a fall back component I guess
  if (!category) {
    return null;
  }

  return (
    <div style={{ width: "650px" }}>
      <div className="w-full flex flex-row justify-between items-center">
        <BudgetSummary />
        <SubmitChangeButton />
      </div>
      <div
        style={{ boxShadow: "inset 0px 3px 6px 0px rgba(56, 92, 56, 0.4)" }}
        className="my-2 p-4 border-gray-200 rounded-lg"
      >
        <CategoryShow category={category}>
          <div className="w-full flex flex-row justify-between px-4 text-lg mb-4 mt-2">
            <Point>{category.name}</Point>
            <AddNewButton />
          </div>
          {category.events.map((event, index) => (
            <EventShow event={event} key={event.budgetItemKey} index={index}>
              <EventCard />
            </EventShow>
          ))}
          <div className="flex flex-row-reverse justify-between">
            <CategoryAveragesProvider
              category={category}
              month={metadata.month}
              year={metadata.year}
            >
              <CategoryAveragesContainer />
            </CategoryAveragesProvider>
            {category.isAccrual && <AccrualComponent />}
          </div>
        </CategoryShow>
      </div>
      <CircleNavButtons
        leftButtonHandler={changePreviousCategory}
        rightButtonHandler={changeNextCategory}
      />
      <div>
        <Link
          href={`/budget/${metadata.month}/${metadata.year}/set-up`}
          as="button"
          method="delete"
        >
          Refresh Data
        </Link>
      </div>
    </div>
  );
};

export { RightColumn };
