import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AccountProps } from "@frontend/types/account";
import { AccountShowProvider } from "../account-context-provider";
import { AccountCard } from ".";

type SortableCardProps = {
  account: AccountProps;
};

const SortableCard = (props: SortableCardProps) => {
  const { account } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: account.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccountShowProvider
        account={account}
        dragListeners={listeners}
        dragAttributes={attributes}
      >
        <AccountCard />
      </AccountShowProvider>
    </div>
  );
};

export { SortableCard };
