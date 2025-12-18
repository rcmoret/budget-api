import { SubmitButton } from "@/components/common/Button"
import { useFinalizeFormContext } from "./form_context"
import { Icon } from "@/components/common/Icon"

const FinalizeSubmitButton = () => {
  const { submitHandler, isSubmittable } = useFinalizeFormContext()

  return (
    <div className="w-52">
      <SubmitButton
        onSubmit={submitHandler}
        isEnabled={isSubmittable}
        styling={{
          color: "text-white",
          backgroundColor: "bg-green-600",
          hoverColor: "hover:bg-green-700",
          fontWeight: "font-semibold",
          rounded: "rounded",
          padding: "px-4 py-2",
          display: "flex",
          flexAlign: "justify-between",
          gap: "gap-2",
          width: "w-full"
        }}
        disabledStyling={{
          color: "text-gray-500",
          backgroundColor: "bg-gray-300",
          hoverColor: "hover:bg-gray-400",
          border: "border border-gray-400",
          cursor: "cursor-not-allowed"
        }}
      >
        Submit
        <div className={isSubmittable ? "text-chartreuse-300" : "text-gray-500"}>
          <Icon name="check-circle" />
        </div>
      </SubmitButton>
    </div>
  )
}

export { FinalizeSubmitButton }
