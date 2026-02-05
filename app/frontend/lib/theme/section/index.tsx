import { Point } from "@/components/common/Symbol";
import { Row } from "@/components/common/Row";
import { gradients } from "@/lib/theme/colors";

type SectionHeaderProps = {
  title: string;
};

const gradient = `bg-gradient-to-l from-${gradients.charteuese.full} to-${gradients.charteuese.muted}`; // hsl(112, 28%, 68%) to hsl(112, 28%, 88%)

const SectionHeader = (props: SectionHeaderProps) => {
  return (
    <Row
      styling={{
        backgroundColor: gradient,
        margin: "mb-1",
        fontWeight: "font-semibold",
        fontSize: "text-xl",
        rounded: "rounded",
        overflow: "overflow-hidden",
        padding: "p-2",
        shadow: "shadow-md",
      }}
    >
      <Point>
        <span className="underline">{props.title}</span>
      </Point>
    </Row>
  );
};

export { SectionHeader };
export type { SectionHeaderProps };
