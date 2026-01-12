import Select, { SingleValue } from "react-select";
import { T_CREATE_EXTRA_EVENT } from "@/lib/hooks/useFinalizeEventsForm";
import { useFinalizeFormContext } from "./form_context";
import { byLabel } from "@/lib/sort_functions";

type TExtraCreateEvent = {
  amount: 0;
  budget_category_key: string;
  budget_item_key: string;
  event_type: T_CREATE_EXTRA_EVENT;
  key: string;
  data: any;
}

type TExtraCategoryCreateEvent = {
  name: string;
  slug: string;
  events: Array<TExtraCreateEvent>
}

const ExtraEventsSelect = () => {
  const {
    extraCategoryOptions,
    extraEvent,
    setExtraEventKey
  } = useFinalizeFormContext()

  const options = [
      ...extraCategoryOptions.flatMap((category) => {
      return category.events.map((ev) => ({
        label: `${category.name}`,
        value: ev.key
      }))
    })
  ].sort(byLabel)

  const onChange = (ev: SingleValue<{ label: string; value: string }>) => {
    if (!ev) { return }

    setExtraEventKey(ev.value)
  }

  const option = options.find((option) => option.value === extraEvent?.key) || null

  return (
    <div className="w-52">
      <Select
        value={option}
        options={options}
        onChange={onChange}
      />
    </div>
  )
}

export { ExtraEventsSelect, TExtraCreateEvent, TExtraCategoryCreateEvent }
