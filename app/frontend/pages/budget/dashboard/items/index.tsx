import React, { useState } from "react";
import axios from "axios";

import { Link } from "@inertiajs/react";
import { AmountInput, TInputAmount } from "@/components/common/AmountInput";
import {
  BudgetItem,
  BudgetItemEvent,
  BudgetItemTransaction,
} from "@/types/budget";
import { Row } from "@/components/common/Row";
import { Cell } from "@/components/common/Cell";
import { Icon } from "@/components/common/Icon";
import { Button, SubmitButton } from "@/components/common/Button";
import { AmountSpan, PercentSpan } from "@/components/common/AmountSpan";
import { Point } from "@/components/common/Symbol";
import { useAppConfigContext } from "@/components/layout/Provider";
import { clearedItems } from "@/lib/models/budget-items";
import { byComparisonDate as sortDetails } from "@/lib/sort_functions";
import { useEventForm } from "@/lib/hooks/useEventsForm";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { inputAmount } from "@/components/common/AmountInput";
import { useToggle } from "@/lib/hooks/useToogle";
import { useBudgetDashboardContext } from "@/pages/budget/dashboard/context_provider";
import { useBudgetDashboardItemContext } from "@/pages/budget/dashboard/items/context_provider";
import { ItemDetailHistory } from "./details";
import { AccrualFormComponent } from "./form";
import {
  CategoryAverages,
  CategoryAveragesProvider,
  useCategoryAveragesContext,
} from "@/components/common/budget/category-chart";
import {
  bgCurrentlyBudgeted,
  bgPreviouslyBudgeted,
} from "@/lib/theme/colors/backgrounds";
import {
  textCurrentlyBudgeted,
  textPreviouslyBudgeted,
} from "@/lib/theme/colors/text";

const PerDayLineItem = (props: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full flex flex-row justify-between">
      <div>{props.title}</div>
      <div>{props.children}</div>
    </div>
  );
};

const PerDayDetails = () => {
  const { item } = useBudgetDashboardItemContext();
  const { appConfig } = useAppConfigContext();
  const budgetedPerDay = item.amount / appConfig.budget.data.totalDays;
  const budgetedPerWeek = budgetedPerDay * 7;
  const remainingPerDay = item.remaining / appConfig.budget.data.daysRemaining;
  const remainingPerWeek = remainingPerDay * 7;
  const percentOfBudget = remainingPerDay / budgetedPerDay - 1;
  let prefix: "" | "+" | "-" = "";
  let label = "";
  let color: "black" | "red" | "green" = "black";
  if (Math.abs(percentOfBudget) < 0.001) {
    // this will get rounded to 100
    label = "Percent of prorated budget";
  } else if (percentOfBudget < 0) {
    label = "Percent behind prorated budget";
    prefix = "-";
    if (percentOfBudget < -0.25) {
      color = "red";
    }
  } else {
    label = "Percent ahead of prorated budget";
    prefix = "+";
    color = "green";
  }

  return (
    <div className="w-full p-2">
      <div className="w-full flex flex-col gap-1 p-2  rounded border border-gray-200">
        <PerDayLineItem title="Budgeted per day">
          <AmountSpan amount={budgetedPerDay} absolute={true} />
        </PerDayLineItem>
        <PerDayLineItem title="Remaining per day">
          <AmountSpan amount={remainingPerDay} absolute={true} />
        </PerDayLineItem>
        <PerDayLineItem title="Budgeted per week">
          <AmountSpan amount={budgetedPerWeek} absolute={true} />
        </PerDayLineItem>
        <PerDayLineItem title="Remaining per week">
          <AmountSpan amount={remainingPerWeek} absolute={true} />
        </PerDayLineItem>
        <PerDayLineItem title={label}>
          <PercentSpan
            prefix={prefix}
            amount={percentOfBudget * 100}
            absolute={true}
            zeroColor={color}
            classes={["font-semibold"]}
          />
        </PerDayLineItem>
      </div>
    </div>
  );
};

type DetailProps = {
  item: BudgetItem;
  showDetails: boolean;
};

const ItemDetails = ({ item, showDetails }: DetailProps) => {
  const { key, isExpense, isPerDiemEnabled, transactionDetails } = item;

  const [events, setEvents] = useState<BudgetItemEvent[]>(item.events);

  if (showDetails && !events.length) {
    const detailsUrl = UrlBuilder({ name: "BudgetItemDetails", key });
    axios
      .get(detailsUrl)
      .then((response) => {
        const { budgetItem } = response.data;
        setEvents(budgetItem.events);
      })
      .catch((error) => {
        console.error("Error fetching summary data:", error);
      });
  }

  let details: Array<BudgetItemEvent | BudgetItemTransaction> = [];
  if (clearedItems(item)) {
    details = events.sort(sortDetails);
  } else {
    details = [...events, ...transactionDetails].sort(sortDetails);
  }

  if (!showDetails) {
    return null;
  }

  return (
    <>
      <Row
        styling={{
          flexDirection: "flex-col",
          padding: "p-2",
          border: "border-t border-gray-500 border-solid",
        }}
      >
        <div>
          <strong>Budget Item Details</strong>
        </div>
        <div className="text-sm font-medium">Key: {key}</div>
      </Row>
      {isPerDiemEnabled ? <PerDayDetails /> : null}
      <ItemDetailHistory details={details} isExpense={isExpense} />
    </>
  );
};

const SummaryUpdateButton = () => {
  const { currentSummary, hideAverages, isLoading, fetchSummaries } =
    useCategoryAveragesContext();

  const isHidden = !currentSummary;

  const className = [
    "text-blue-300",
    "font-semibold",
    "rounded",
    isLoading ? "opacity-50 cursor-not-allowed" : "",
  ].join(" ");

  const onClick = () => {
    if (isHidden) {
      fetchSummaries();
    } else {
      hideAverages();
    }
  };

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={onClick}
        className={className}
        disabled={isLoading && !isHidden}
      >
        {[isHidden ? "Show" : "Hide", "Averages"].join(" ")}
      </button>
    </div>
  );
};

const CategoryAveragesComponent = () => {
  const { appConfig } = useAppConfigContext();
  const { month, year } = appConfig.budget.data;
  const { item } = useBudgetDashboardItemContext();

  return (
    <CategoryAveragesProvider
      category={{ key: item.budgetCategoryKey, isExpense: item.isExpense }}
      month={month}
      year={year}
    >
      <div className="flex flex-col mt-4">
        <CategoryAverages />
        <SummaryUpdateButton />
      </div>
    </CategoryAveragesProvider>
  );
};

const PrevVsCurrentlyBudgetedIndicator = () => {
  const { item } = useBudgetDashboardItemContext();
  const { amount: totalBudgeted, currentlyBudgeted, previouslyBudgeted } = item;

  if (!totalBudgeted || totalBudgeted === currentlyBudgeted) {
    return null;
  }

  const currentlyBudgetedWidth = Math.min(
    Math.abs((100 * currentlyBudgeted) / totalBudgeted),
    100,
  );
  const previouslyBudgetedWidth = Math.min(
    Math.abs((100 * previouslyBudgeted) / totalBudgeted),
    100,
  );
  return (
    <div className="w-full px-4 flex flex-col gap-2 mt-2">
      <div className="w-full gap-0">
        <div className="flex flex-row gap-2 items-center h-4">
          <div className={`text-2xl ${textPreviouslyBudgeted}`}>&bull;</div>
          <div className="text-sm">Previously Budgeted</div>
        </div>
        <div className="flex flex-row gap-2 items-center h-4">
          <div className={`text-2xl ${textCurrentlyBudgeted}`}>&bull;</div>
          <div className="text-sm">Currently Budgeted</div>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-lg flex flex-row">
        <div
          className={`h-2 ${bgPreviouslyBudgeted}`}
          style={{ width: previouslyBudgetedWidth + "%" }}
        ></div>
        <div
          className={`h-2 ${bgCurrentlyBudgeted}`}
          style={{ width: currentlyBudgetedWidth + "%" }}
        ></div>
      </div>
    </div>
  );
};

const ItemContainer = (props: { children?: React.ReactNode }) => {
  const { children } = props;
  const { item, isHidden } = useBudgetDashboardItemContext();
  const [showDetails, toggleDetails] = useToggle(false);

  if (isHidden) {
    return null;
  }

  return (
    <Row
      styling={{
        flexWrap: "flex-wrap",
        backgroundColor: "even:bg-sky-50 odd:sky-muted",
        color: "text-gray-800",
        gap: "gap-px",
        rounded: "rounded",
      }}
    >
      <NameRow showDetails={showDetails} toggleDetails={toggleDetails} />
      {children}
      <PrevVsCurrentlyBudgetedIndicator />
      <CategoryAveragesComponent />
      {item.isAccrual && <AccrualRow item={item} />}
      <ActionableIcons />
      <ItemDetails item={item} showDetails={showDetails} />
    </Row>
  );
};

const DeleteButton = ({ item }: { item: BudgetItem }) => {
  const { appConfig } = useAppConfigContext();
  const { month, year } = appConfig.budget.data;

  const { post, processing } = useEventForm({
    events: [
      {
        key: generateKeyIdentifier(),
        eventType: "item_delete",
        budgetItemKey: item.key,
        amount: { cents: 0, display: "" },
      },
    ],
    month,
    year,
  });

  const onSubmit = () => {
    const formUrl = UrlBuilder({
      name: "BudgetItemEvents",
      month,
      year,
      queryParams: buildQueryParams(["budget", month, year]),
    });
    post(formUrl);
  };

  if (!item.isDeletable) {
    return null;
  }

  return (
    <form onSubmit={onSubmit}>
      <SubmitButton
        isEnabled={!processing}
        onSubmit={onSubmit}
        styling={{ color: "text-blue-300", backgroundColor: "bg-transparent" }}
      >
        <Icon name="trash" />
      </SubmitButton>
    </form>
  );
};

const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      styling={{ color: "text-blue-300" }}
    >
      <Icon name="edit" />
    </Button>
  );
};

const CloseFormButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      styling={{ color: "text-blue-300" }}
    >
      <Icon name="times-circle" />
    </Button>
  );
};

const EditSubmitButton = (props: {
  postEvents: () => void;
  processing: boolean;
}) => {
  return (
    <SubmitButton
      isEnabled={!props.processing}
      onSubmit={props.postEvents}
      disabledStyling={{
        color: "text-gray-600",
      }}
      styling={{
        color: "text-blue-300",
      }}
    >
      <Icon name="check-circle" />
    </SubmitButton>
  );
};

const ActionableIcons = () => {
  const { item } = useBudgetDashboardItemContext();
  const { form } = useBudgetDashboardContext();
  const { post: postEvents, processing } = form;
  const { appConfig } = useAppConfigContext();

  const openForm = () =>
    form.addChange({
      budgetItemKey: item.key,
      budgetCategoryKey: item.budgetCategoryKey,
      updatedAmount: inputAmount({ cents: item.amount }),
      amount: inputAmount({ display: "" }),
    });
  const closeForm = () => form.removeChange(item.key);

  const category =
    appConfig.budget.categories.find((category) => {
      return category.key === item.budgetCategoryKey;
    }) ?? null;
  const href = !!category ? `/budget/category/${category.slug}` : "#";

  const isSubmittable = !!item.draftItem && form.changes.length === 1;

  return (
    <Row
      styling={{
        padding: "p-2",
        flexAlign: "justify-between",
        alignItems: "items-center",
        gap: "gap-2",
      }}
    >
      <div>
        <Link href={href}>
          <span className="text-sm text-blue-300">
            <Icon name="external-arrow" />
          </span>
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        {!!item.draftItem ? (
          <CloseFormButton onClick={closeForm} />
        ) : (
          <EditButton onClick={openForm} />
        )}
        {isSubmittable && (
          <EditSubmitButton postEvents={postEvents} processing={processing} />
        )}

        <DeleteButton item={item} />
      </div>
    </Row>
  );
};

const AccrualRow = ({ item }: { item: BudgetItem }) => {
  const { maturityMonth, maturityYear } = item;
  const { appConfig } = useAppConfigContext();
  const { month, year } = appConfig.budget.data;

  const isMature = month === maturityMonth && year === maturityYear;

  let upcomingMaturityCopy = "";
  if (isMature) {
    upcomingMaturityCopy = "Currently Mature";
  } else if (!!maturityYear && !!maturityMonth) {
    upcomingMaturityCopy = `Maturing: ${maturityMonth}/${maturityYear}`;
  } else {
    upcomingMaturityCopy = "No upcoming maturity date";
  }

  return (
    <Row
      styling={{
        padding: "p-2",
        flexWrap: "flex-wrap",
        flexAlign: "justify-between",
      }}
    >
      <Cell styling={{ width: "w-6/12" }}>
        <span className="italic text-sm">
          <Point>Accruing</Point>
        </span>
      </Cell>
      <Cell styling={{ textAlign: "text-right", width: "w-6/12" }}>
        {upcomingMaturityCopy}
      </Cell>
      {!isMature && (
        <AccrualFormComponent budgetCategoryKey={item.budgetCategoryKey} />
      )}
    </Row>
  );
};

type NameRowProps = {
  showDetails: boolean;
  toggleDetails: () => void;
};

const NameRow = (props: NameRowProps) => {
  const { item } = useBudgetDashboardItemContext();
  const { showDetails, toggleDetails } = props;
  const { name, iconClassName, amount } = item;
  const caretIcon = showDetails ? "caret-down" : "caret-right";
  const absolute = !item.draftItem;

  return (
    <>
      <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
        <Cell styling={{ width: "w-6/12" }}>
          <div className="hidden">{item.key}</div>
          <Button
            type="button"
            onClick={toggleDetails}
            styling={{
              fontWeight: "font-semibold",
              color: "text-gray-800",
            }}
          >
            <span className="text-blue-300 text-sm">
              <Icon name={caretIcon} />
            </span>{" "}
            {name}
          </Button>{" "}
          <Icon name={iconClassName} />
        </Cell>
        <Cell
          styling={{
            fontWeight: "font-bold",
            textAlign: "text-right",
            width: "w-4/12",
          }}
        >
          <AmountSpan zeroColor="black" amount={amount} absolute={absolute} />
        </Cell>
      </Row>
    </>
  );
};

const DifferenceLineItem = () => {
  const { item } = useBudgetDashboardItemContext();
  const { spent, amount, isExpense, difference } = item;

  if (Math.abs(amount) >= Math.abs(spent)) {
    return null;
  }

  const copy = isExpense ? "Over Budget" : "Exceeding Budget";

  return (
    <Row styling={{ padding: "p-2", flexAlign: "justify-between" }}>
      <Cell styling={{ width: "w-6/12", fontWeight: "font-semibold" }}>
        {copy}
      </Cell>
      <Cell
        styling={{
          fontWeight: "font-bold",
          textAlign: "text-right",
          width: "w-4/12",
        }}
      >
        <AmountSpan
          amount={difference * -1}
          positiveColor="green"
          negativeColor="red"
          zeroColor="black"
          absolute={true}
        />
      </Cell>
    </Row>
  );
};

const LocalAmountInput = (props: {
  amount: TInputAmount;
  isInputShown: boolean;
  itemKey: string;
  onChange: (s: string) => void;
  toggleInput: () => void;
  children: React.ReactNode;
}) => {
  if (props.isInputShown) {
    return (
      <AmountInput
        name={`item-form-${props.itemKey}`}
        amount={props.amount}
        onChange={props.onChange}
        classes={["font-normal", "border", "border-gray-500"]}
      />
    );
  } else {
    return (
      <Button type="button" onClick={props.toggleInput}>
        {props.children}
      </Button>
    );
  }
};

export { DifferenceLineItem, ItemContainer, LocalAmountInput };
