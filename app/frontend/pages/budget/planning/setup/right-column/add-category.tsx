import {
  CreateEventSelectComponent,
  CreateEventSelectProvider,
  useCreateEventSelectContext,
} from "@/components/create-event-select";
import { TCreateEventClientContext } from "@/lib/create-events-client";
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
        <CreateEventSelectComponent />
      </CreateEventSelectProvider>
    </div>
  );
};

export { CreateEventSelect };
