import { ToggleSlider } from "@/components/slider";
import { useShowAccruals, useToggleShowAccruals } from "@/layout/app-config-store";

const AccrualToggle = () => {
  const showAccruals = useShowAccruals()
  const toggleAccruals = useToggleShowAccruals()
  const label = "Toggle Accruals"
  const buttonTitle = label

  return (
    <div className="flex flex-row justify-between items-center text-sm">
      <label htmlFor="toggle-accrual-items" className="text-sm">
        {label}
      </label>
      <div className="tooltip tooltip-left" data-tip={buttonTitle}>
        <ToggleSlider
          toggleValue={showAccruals}
          onClick={toggleAccruals}
          id="toggle-accrual-items"
        />
      </div>
    </div>
  );
}

export { AccrualToggle }
