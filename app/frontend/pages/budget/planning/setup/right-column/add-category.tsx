import { CreateEventSelectProvider } from "@/components/create-event-form";
import { TCreateEventClientContext } from "@/lib/create-events-client";
import { FormComponent } from "@/pages/budget/dashboard/right-column/create-event-form";
import { TCategoryScope } from "@/types/budget/planning";

type CreateEventSelectProps = {
  scopes: Array<TCategoryScope>;
  month: string | number;
  year: string | number;
  eventContext: TCreateEventClientContext;
};

const CreateEventSelect = (props: CreateEventSelectProps) => {
  return (
    <div className="py-2 px-4 rounded border-neutral border flex justify-between w-full items-center">
      <CreateEventSelectProvider {...props}>
        <FormComponent />
      </CreateEventSelectProvider>
    </div>
  );
};

export { CreateEventSelect };
