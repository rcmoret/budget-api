import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import {
  cardBgValue,
  outerCardClassName,
  formBgValue,
  rowClassName,
  innerCardClassName,
} from "@/layout/card/card-classes";
import { KeyIdentifier } from "@/components/key-identifier";

const DragHandle = (props: {
  dragAttributes: DraggableAttributes;
  dragListeners: SyntheticListenerMap;
}) => {
  return (
    <button
      className="cursor-grab active:cursor-grabbing text-base-content/80 hover:text-base-content px-1"
      {...props.dragListeners}
      {...props.dragAttributes}
    >
      ⠿
    </button>
  );
};

const ArchiveButtonWrapper = (props: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-6">
      <button
        type="button"
        onClick={props.onClick}
        className="btn btn-ghost btn-xs"
        title={props.title}
      >
        {props.children}
      </button>
    </div>
  );
};

const ArchiveIcon = (props: { title: string; onClick: () => void }) => {
  return (
    <ArchiveButtonWrapper onClick={props.onClick} title={props.title}>
      <span className="text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z"
          />
          <path fill="currentColor" d="M14 9h-4v3H7l5 5 5-5h-3z" />
        </svg>
      </span>
    </ArchiveButtonWrapper>
  );
};

const UnarchiveIcon = (props: { onClick: () => void; title: string }) => {
  return (
    <ArchiveButtonWrapper onClick={props.onClick} title={props.title}>
      <span className="text-xl font-semibold">&#9842;</span>
    </ArchiveButtonWrapper>
  );
};

const CardLabel = (props: {
  label: string | React.ReactNode;
  children?: React.ReactNode;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
}) => {
  const { dragAttributes, dragListeners } = props;

  const className = [
    "flex",
    "justify-between",
    "items-center",
    "font-medium",
    "pb-1",
    "border-b",
    "border-primary/40",
  ].join(" ");

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {dragAttributes && dragListeners && (
          <DragHandle
            dragAttributes={dragAttributes}
            dragListeners={dragListeners}
          />
        )}
        <span className="text-lg">{props.label}</span>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

const ArchivedAtRow = (props: { archivedAt: string | null }) => {
  return (
    <div className={rowClassName}>
      <div>Archived At</div>
      <div>{props.archivedAt ?? ""}</div>
    </div>
  );
};

const ActiveItemCard = (props: {
  children: React.ReactNode;
  isFormShown?: boolean;
  label: React.ReactNode;
  id: string;
}) => {
  const { children, isFormShown = false, label, id } = props;
  // when I want to highlight add
  // const isOutlined = id === "account-218b5f598fcb";
  //
  // and update outerCardClassName with
  //   ...(isOutlined ? ["border", "border-2", "border-success"] : []),

  const bgColor = isFormShown ? formBgValue : cardBgValue;
  const className = [outerCardClassName({ bgColor })].join(" ");
  return (
    <div className={className} id={id}>
      {label}
      <div className={innerCardClassName}>{children}</div>
    </div>
  );
};

const ArchivedItemCard = (props: {
  name: string;
  onClick: () => void;
  title: string;
  itemKey: string;
  id?: string;
  children: React.ReactNode;
}) => {
  const className = outerCardClassName({ bgColor: cardBgValue });

  return (
    <div className={className} id={props.id}>
      <CardLabel label={props.name} />
      <div className={innerCardClassName}>{props.children}</div>
      <CardRow>
        <KeyIdentifier identifier={props.itemKey} />
        <UnarchiveIcon onClick={props.onClick} title={props.title} />
      </CardRow>
    </div>
  );
};

const CardRow = (props: { children: React.ReactNode }) => {
  const rowClassName = [
    "flex",
    "flex-row",
    "[&>*:last-child]:ml-auto",
    "justify-end",
  ].join(" ");

  return <div className={rowClassName}>{props.children}</div>;
};

const CloseFormButton = (props: { onDismiss: () => void }) => {
  return (
    <div className="flex justify-center items-center font-medium">
      <FormToggleButton title="close form" onClick={props.onDismiss}>
        &#10005;
      </FormToggleButton>
    </div>
  );
};

const FormToggleButton = (props: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) => {
  const className = [
    "bg-white/60",
    "cursor-pointer",
    "h-6",
    "hover:bg-white",
    "hover:font-medium",
    "hover:text-base-content",
    "leading-none",
    "rounded-full",
    "text-base-content/70",
    "w-6",
  ].join(" ");

  return (
    <button
      className={className}
      type="button"
      onClick={props.onClick}
      title={props.title}
    >
      {props.children}
    </button>
  );
};

const EditButton = (props: { showForm: () => void }) => {
  return (
    <div className="flex justify-center items-center text-xl rotate-y-180">
      <FormToggleButton title="edit" onClick={props.showForm}>
        &#9998;
      </FormToggleButton>
    </div>
  );
};

export {
  ActiveItemCard,
  ArchiveIcon,
  ArchivedAtRow,
  ArchivedItemCard,
  CardLabel,
  CardRow,
  CloseFormButton,
  EditButton,
  UnarchiveIcon,
};
