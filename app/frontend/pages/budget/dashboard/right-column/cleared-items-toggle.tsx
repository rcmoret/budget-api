import { ToggleSlider } from "@/components/slider";
import { useClearedItemsVisibilityToggle } from "../store";

const ClearedItemsToggle = () => {
  const [showClearedItems, toggleClearedItems] = useClearedItemsVisibilityToggle()
  const label = "Toggle Cleared Item Visibility"
  const buttonTitle = label

  return (
    <div className="flex flex-row justify-between items-center text-sm">
      <label htmlFor="toggle-cleared-items" className="text-sm">
        {label}
      </label>
      <div className="tooltip tooltip-left" data-tip={buttonTitle}>
        <ToggleSlider
          toggleValue={showClearedItems}
          onClick={toggleClearedItems}
          id="toggle-cleared-items"
        />
      </div>
    </div>
  );
}

export { ClearedItemsToggle }
