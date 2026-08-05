import { Icon } from "@budget/design-system";

const Cell = (props: { name: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-1 w-20 text-base-content">
    <span className="text-xl">{props.children}</span>
    <span className="text-xs opacity-70">{props.name}</span>
  </div>
);

export const Common = () => (
  <div className="flex flex-wrap gap-3">
    <Cell name="coins"><Icon name="coins" /></Cell>
    <Cell name="calendar"><Icon name="calendar" /></Cell>
    <Cell name="money-check"><Icon name="money-check" /></Cell>
    <Cell name="paperclip"><Icon name="paperclip" /></Cell>
    <Cell name="sticky-note"><Icon name="sticky-note" /></Cell>
    <Cell name="folder-open"><Icon name="folder-open" /></Cell>
  </div>
);

export const Controls = () => (
  <div className="flex flex-wrap gap-3">
    <Cell name="caret-down"><Icon name="caret-down" /></Cell>
    <Cell name="caret-right"><Icon name="caret-right" /></Cell>
    <Cell name="arrow-up"><Icon name="arrow-up" /></Cell>
    <Cell name="arrow-down"><Icon name="arrow-down" /></Cell>
    <Cell name="angle-double-left"><Icon name="angle-double-left" /></Cell>
    <Cell name="bars"><Icon name="bars" /></Cell>
  </div>
);

export const Status = () => (
  <div className="flex flex-wrap gap-3">
    <Cell name="check-circle"><Icon name="check-circle" /></Cell>
    <Cell name="times-circle"><Icon name="times-circle" /></Cell>
    <Cell name="plus-circle"><Icon name="plus-circle" /></Cell>
    <Cell name="trash"><Icon name="trash" /></Cell>
    <Cell name="edit"><Icon name="edit" /></Cell>
    <Cell name="gears"><Icon name="gears" /></Cell>
  </div>
);
