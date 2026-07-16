import { KeyIdentifier } from "@/components/key-identifier";
import { CardRow } from "@/components/card";
import { useBudgetItemContext } from "./context-provider";
import { TrashIcon } from "@/components/icons/trash";
import { Pencil } from "@/components/icons/pencil";
import { useAdjustmentInputsContext } from "@/components/adjustment-input";
import { CloseButton, CheckMarkButton, IconButton } from "@/components/cta";
import { useForm } from "@inertiajs/react";
import {
  getRedirectQueryParams,
  useAppRoutes,
} from "@/lib/app-stores/app-config-store";
import { useAdjustmentStore } from "@/lib/adjustment-amount-store";

const useBudgetEventUrl = () => {
  const redirectParams = getRedirectQueryParams();
  const baseUrl = useAppRoutes("createBudgetEventsRoute");
  return { url: [baseUrl, redirectParams].join("?") };
};

const LocalCloseButton = (props: { onClick: () => void }) => {
  return (
    <CloseButton
      ariaLabel="Close Form"
      onClick={props.onClick}
      title="Close Form"
    />
  );
};

const LocalCheckMarkButton = () => {
  const { adjustment } = useAdjustmentInputsContext();
  const { item } = useBudgetItemContext();
  const { resetItems } = useAdjustmentStore.getState();
  const { url } = useBudgetEventUrl();
  const { post, processing, transform } = useForm({});

  transform(() => ({
    events: [
      {
        amount: adjustment.newTotal.cents,
        budgetItemKey: item.key,
        eventType: "item_adjust",
      },
    ],
  }));

  const onSubmit = (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    if (processing) return;

    post(url, { onSuccess: resetItems });
  };

  // `display: contents` keeps the form out of the flex layout so the button
  // still sits inline with its sibling controls.
  return (
    <form onSubmit={onSubmit} className="contents">
      <CheckMarkButton
        type="submit"
        ariaLabel="Save adjustment"
        disabled={processing}
      />
    </form>
  );
};

const EditButton = (props: { onClick: () => void }) => {
  return (
    <IconButton onClick={props.onClick} title="Edit item">
      <Pencil />
    </IconButton>
  );
};

const DeleteButton = () => {
  const { item } = useBudgetItemContext();
  const { resetItems } = useAdjustmentStore.getState();
  const { url } = useBudgetEventUrl();

  const { post, processing, transform } = useForm({});

  transform(() => ({
    events: [
      {
        budgetItemKey: item.key,
        eventType: "item_delete",
      },
    ],
  }));

  const onSubmit = (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    if (processing) return;

    post(url, { onSuccess: resetItems });
  };

  return (
    <form onSubmit={onSubmit} className="contents">
      <IconButton type="submit" title="Delete item">
        <TrashIcon />
      </IconButton>
    </form>
  );
};

const BottomRow = () => {
  const { item } = useBudgetItemContext();
  const { hasAdjustment } = useAdjustmentInputsContext();
  const showEdit = () => item.toggleForm();

  const showBorder =
    item.isVariable ||
    item.isAccrual ||
    item.currentlyBudgetedPercentage !== 100;

  const className = [
    ...(showBorder
      ? ["border-t", "border-primary/20", "pt-2", "mt-2"]
      : ["pt-4"]),
  ].join(" ");

  return (
    <div className={className}>
      <CardRow>
        <KeyIdentifier identifier={item.key} className="text-base-content/66" />
        <div className="flex gap-2 items-center text-xl">
          {hasAdjustment ? (
            <LocalCheckMarkButton />
          ) : (
            <EditButton onClick={showEdit} />
          )}
          {hasAdjustment ? (
            <LocalCloseButton onClick={showEdit} />
          ) : (
            <DeleteButton />
          )}
        </div>
      </CardRow>
    </div>
  );
};

export { BottomRow };
