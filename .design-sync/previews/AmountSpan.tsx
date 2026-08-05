import { AmountSpan } from "@budget/design-system";

const Row = (props: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-6 w-72">
    <span className="text-sm opacity-70">{props.label}</span>
    <span>{props.children}</span>
  </div>
);

export const Colorize = () => (
  <div className="flex flex-col gap-1">
    <Row label='colorize="normal" · positive'>
      <AmountSpan amount={123050} colorize="normal" />
    </Row>
    <Row label='colorize="normal" · negative'>
      <AmountSpan amount={-41275} colorize="normal" />
    </Row>
    <Row label='colorize="reverse" · negative'>
      <AmountSpan amount={-41275} colorize="reverse" />
    </Row>
    <Row label='colorize="none"'>
      <AmountSpan amount={-41275} colorize="none" />
    </Row>
  </div>
);

export const Formatting = () => (
  <div className="flex flex-col gap-1">
    <Row label="default"><AmountSpan amount={482500} colorize="none" /></Row>
    <Row label="showCents={false}"><AmountSpan amount={482500} showCents={false} colorize="none" /></Row>
    <Row label="absolute"><AmountSpan amount={-41275} absolute colorize="none" /></Row>
    <Row label="decorate"><AmountSpan amount={123050} decorate colorize="normal" /></Row>
  </div>
);

export const OnlyNegative = () => (
  <div className="flex flex-col gap-1">
    <Row label='only="negative" · positive stays base'>
      <AmountSpan amount={123050} colorize="normal" only="negative" />
    </Row>
    <Row label='only="negative" · negative colours'>
      <AmountSpan amount={-41275} colorize="normal" only="negative" />
    </Row>
  </div>
);
