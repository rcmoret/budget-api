import { AccountTransactionDetail } from "@/types/transaction";
import { ActionAnchorTag } from "@/components/common/Link";
import { Icon } from "@/components/common/Icon";

interface CaretComponentProps {
  details: AccountTransactionDetail[];
  isDetailShown: boolean;
  toggleFn: () => void;
}

const CaretComponent = (props: CaretComponentProps) => {
  const { details, isDetailShown, toggleFn } = props;

  return (
    <div className="w-[5%]">
      {details.length > 1 ? (
        <DetailToggle isDetailShown={isDetailShown} toggleFn={toggleFn} />
      ) : (
        ""
      )}
    </div>
  );
};

const DetailToggle = (props: {
  isDetailShown: boolean;
  toggleFn: () => void;
}) => {
  const { isDetailShown, toggleFn } = props;
  const iconName = isDetailShown ? "caret-down" : "caret-right";

  return (
    <ActionAnchorTag onClick={toggleFn}>
      <Icon name={iconName} />
    </ActionAnchorTag>
  );
};

const ClearanceDateComponent = (props: {
  clearanceDate: string;
  shortClearanceDate: string;
}) => (
  <div className="w-2/12">
    <span className="max-sm:hidden">{props.clearanceDate}</span>
    <span className="sm:hidden">{props.shortClearanceDate}</span>
  </div>
);

export { CaretComponent, ClearanceDateComponent };
