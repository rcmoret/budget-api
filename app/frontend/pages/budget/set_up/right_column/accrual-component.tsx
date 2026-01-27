import { useSetUpCategoryShowContext } from "@/pages/budget/set_up/categories";
import { Icon } from "@/components/common/Icon";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { DateFormatter } from "@/lib/DateFormatter";
import { SubmitButton } from "@/components/common/Button";
import { useSetupEventsFormContext } from "@/pages/budget/set_up";

const AccrualFormComponent = () => {
  const { category } = useSetUpCategoryShowContext();
  const {
    metadata: { month, year },
  } = useSetupEventsFormContext();
  const { put, processing } = useForm({
    category: {
      maturityIntervals: [
        {
          month,
          year,
        },
      ],
    },
  });

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault();
    const formUrl = UrlBuilder({
      name: "CategoryShow",
      key: category.key,
      queryParams: buildQueryParams([
        "budget",
        month,
        year,
        "set-up",
        category.slug,
      ]),
    });
    console.log(formUrl);
    put(formUrl);
  };

  return (
    <div>
      <SubmitButton
        isEnabled={!processing}
        onSubmit={onSubmit}
        styling={{
          backgroundColor: "bg-green-400",
          padding: "px-2 py-1",
          rounded: "rounded",
          color: "text-white",
          shadow: "shadow-sm",
        }}
      >
        Maturing in {month}/{year}?
      </SubmitButton>
    </div>
  );
};

const AccrualComponent = () => {
  const { category } = useSetUpCategoryShowContext();
  const {
    metadata: { month, year },
  } = useSetupEventsFormContext();

  const intervals = category.upcomingMaturityIntervals || [];

  const isMaturing =
    intervals[0]?.month === month && intervals[0]?.year === year;

  const anyIntervals = !!intervals.length;

  const iconColor = anyIntervals ? "text-purple-100" : "text-gray-300";

  let accrualInfoMessage = "";
  if (!anyIntervals) {
    accrualInfoMessage = "No Upcoming Maturity Intervals";
  } else if (isMaturing) {
    accrualInfoMessage = `Mature in ${DateFormatter({ month, year, format: "monthYear" })}`;
  } else {
    accrualInfoMessage = `Maturing next in ${DateFormatter({
      month: intervals[0].month,
      year: intervals[0].year,
      format: "monthYear",
    })}`;
  }

  return (
    <div className="flex flex-col rounded border-purple-60 px-4 py-2 border w-1/2">
      <div className="flex flex-row-reverse justify-between">
        <div className="bg-purple-60 text-sm py-1 px-3 font-medium rounded-xl">
          Accrual
        </div>
      </div>
      <div className="flex flex-row gap-2 text-sm">
        <div className={iconColor}>
          <Icon name="calendar" />
        </div>
        {accrualInfoMessage}
      </div>
      {!isMaturing && <AccrualFormComponent />}
    </div>
  );
};

export { AccrualComponent };
