import {
  usePlanningSetupStore,
  useSetupGroups,
} from "@/pages/budget/planning/setup/store";
import { useForm } from "@inertiajs/react";

const SubmitButton = () => {
  const { revenues, fixedExpenses, variableExpenses } = useSetupGroups();
  const { post, processing } = useForm();

  const finishSetupRoute = usePlanningSetupStore((s) => s.finishSetupRoute);

  const isDisabled =
    processing ||
    [revenues, fixedExpenses, variableExpenses].some((group) => {
      return group.metadata.unreviewed > 0;
    });

  const postEvents = () => post(finishSetupRoute);

  const className = [
    "btn",
    "btn-sm",
    ...(isDisabled ? [] : ["btn-success", "text-success-content"]),
    "w-full",
  ].join(" ");

  return (
    <div className="w-full flex">
      <button
        type="button"
        className={className}
        disabled={isDisabled}
        onClick={postEvents}
      >
        Create
      </button>
    </div>
  );
};

export { SubmitButton };
