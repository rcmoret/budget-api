import { ActionIconButton } from "@/lib/theme/buttons/action-button";
import { AmountSpan } from "@/components/common/AmountSpan";
import { BudgetCategory } from "@/types/budget";
import {
  CategoryShowProvider,
  useCardContext,
  useCardCategory,
} from "@/pages/budget/categories/CardContext";
import { CategoryFormProvider } from "./category-form-context";
import { CategoryForm } from "@/pages/budget/categories/Form";
import { Icon } from "@/components/common/Icon";
import { Link, useForm } from "@inertiajs/react";
import { Point } from "@/components/common/Symbol";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { type TIcon } from "@/pages/budget/categories/CategoriesContext";
import { useToggle } from "@/lib/hooks/useToogle";

const AccrualComponent = () => {
  const { isAccrual, maturityIntervals } = useCardCategory();

  if (!isAccrual) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2 text-sm">
      <div>Accrual</div>
      <MaturityIntervalComponent maturityIntervals={maturityIntervals || []} />
    </div>
  );
};

const MaturityIntervalComponent = (props: {
  maturityIntervals: Array<{ month: number; year: number }>;
}) => {
  const [showList, toggleShowList] = useToggle(false);

  const caretClass = showList ? "caret-down" : "caret-right";
  const { maturityIntervals } = props;

  if (!maturityIntervals.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-1">
        <ActionIconButton
          title={`${showList ? "Hide" : "Show"} Maturity Intervals`}
          color="black"
          onClick={toggleShowList}
          icon={caretClass}
        />{" "}
        Maturity Intervals
      </div>
      {showList && (
        <MaturityIntervalListComponent maturityIntervals={maturityIntervals} />
      )}
    </div>
  );
};

const MaturityIntervalListComponent = (props: {
  maturityIntervals: Array<{ month: number; year: number }>;
}) => {
  const maturityIntervals = props.maturityIntervals.sort((mi1, mi2) => {
    if (mi1.year === mi2.year) {
      return mi1.month - mi2.month;
    } else {
      return mi1.year - mi2.year;
    }
  });

  return (
    <div className="w-full">
      {maturityIntervals.map((interval) => {
        return (
          <div>
            {interval.month}/{interval.year}
          </div>
        );
      })}
    </div>
  );
};

const PerDayComponent = () => {
  const category = useCardCategory();

  if (category.isMonthly) {
    return null;
  }

  return (
    <div className="w-full text-sm flex flex-row justify-between">
      <div>Per Day Calculations</div>
      <div>{category.isPerDiemEnabled ? "Enabled" : "Disabled"}</div>
    </div>
  );
};

const CardWrapper = (props: {
  category: BudgetCategory;
  isFormShown: boolean;
  icons: Array<TIcon>;
  setShowFormKey: (key: string | null) => void;
}) => {
  const { category, isFormShown, setShowFormKey } = props;

  return (
    <CategoryShowProvider
      category={category}
      isFormShown={isFormShown}
      setShowFormKey={setShowFormKey}
    >
      <CategoryShow />
    </CategoryShowProvider>
  );
};

const CategoryShow = () => {
  const { category, isFormShown, setShowFormKey } = useCardContext();
  const closeForm = () => setShowFormKey(null);

  if (isFormShown) {
    return (
      <CategoryFormProvider
        category={category}
        closeForm={closeForm}
        isFormShown={true}
        isNew={false}
      >
        <CategoryForm />
      </CategoryFormProvider>
    );
  } else {
    return <Card openForm={() => setShowFormKey(category.key)} />;
  }
};

const ArchiveComponent = ({ queryParams }: { queryParams: string[] }) => {
  const { name, key, isArchived, archivedAt } = useCardCategory();

  if (!isArchived) {
    return null;
  }
  const { processing, put } = useForm({
    category: { archivedAt: null },
  });

  const formUrl = UrlBuilder({
    name: "CategoryShow",
    key,
    queryParams: buildQueryParams(queryParams),
  });

  const onSubmit = () => put(formUrl);

  return (
    <div className="w-full flex justify-between items-start">
      <div className="flex flex-col gap-1 text-sm">
        <div>Archived at:</div>
        <div>{archivedAt || ""}</div>
      </div>
      <div className="text-right flex justify-end gap-2">
        <ActionIconButton
          icon="folder-open"
          isEnabled={!processing}
          onClick={onSubmit}
          title={`Restore ${name}`}
          color="green"
        />
      </div>
    </div>
  );
};

const ArchiveButton = ({ queryParams }: { queryParams: string[] }) => {
  const category = useCardCategory();
  const { processing, put } = useForm({
    category: { archivedAt: new Date() },
  });

  const formUrl = UrlBuilder({
    name: "CategoryShow",
    key: category.key,
    queryParams: buildQueryParams(queryParams),
  });

  const onSubmit = () => {
    console.log(formUrl);
    put(formUrl);
  };

  if (category.isArchived) {
    return null;
  }

  return (
    <form>
      <ActionIconButton
        onClick={onSubmit}
        isEnabled={!processing}
        color="red"
        title={`Archive ${category.name}`}
        icon="trash"
      />
    </form>
  );
};

const Card = (props: { openForm: () => void }) => {
  const {
    name,
    defaultAmount,
    iconClassName,
    isAccrual,
    isExpense,
    isMonthly,
    slug,
  } = useCardCategory();
  const { openForm } = props;

  return (
    <div className="w-96 flex flex-col gap-2 border-b border-gray-400 pb-2 px-4">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <Point>
            <Link href={`/budget/category/${slug}`}>{name}</Link>
          </Point>{" "}
          <Icon name={iconClassName} />
        </div>
        <div className="text-right flex justify-end gap-2 items-center">
          <div>
            <ActionIconButton
              title={`Edit ${name}`}
              onClick={openForm}
              color="blue"
              isEnabled={true}
              icon="edit"
            />
          </div>
          <ArchiveButton queryParams={["budget", "category"]} />
        </div>
      </div>
      <ArchiveComponent queryParams={["budget", "category"]} />
      <div className="w-full text-sm">{isExpense ? "Expense" : "Revenue"}</div>
      <div className="w-full text-sm">
        {isMonthly ? "Monthly" : "Day to Day"}
      </div>
      {!!defaultAmount && (
        <div className="w-full flex flex-row justify-between text-sm">
          <div>Default:</div>
          <AmountSpan amount={defaultAmount} />
        </div>
      )}
      <div className="w-full text-sm">
        <PerDayComponent />
      </div>
      {isAccrual && <AccrualComponent />}
    </div>
  );
};

export {
  Card,
  CardWrapper,
  TIcon,
  PerDayComponent,
  AccrualComponent,
  ArchiveComponent,
  ArchiveButton,
};
