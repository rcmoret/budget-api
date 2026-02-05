import { FormSubmitButton } from "@/lib/theme/buttons/form-submit-button";
import { useFinalizeFormContext } from "./form_context";

const FinalizeSubmitButton = () => {
  const { submitHandler, isSubmittable } = useFinalizeFormContext();

  return (
    <div className="w-52">
      <FormSubmitButton
        onSubmit={submitHandler}
        isEnabled={isSubmittable}
        iconName="check-circle"
        outer={{ padding: "px-4 py-2" }}
      >
        Submit
      </FormSubmitButton>
    </div>
  );
};

export { FinalizeSubmitButton };
