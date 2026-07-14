import { Link } from "@inertiajs/react";

type NeighborLinkProps = {
  children: React.ReactNode;
  href: string;
  title: string;
};

type NeighborLinksProps = {
  previousMonth: {
    href: string;
    label: string;
  };
  nextMonth: {
    href: string;
    label: string;
  };
};

const ArrowComponent = (props: { children: React.ReactNode }) => {
  return (
    <div className="text-info font-bold inline-block -translate-y-0.5">
      {props.children}
    </div>
  );
};

const LinkContainer = (props: {
  children: React.ReactNode;
  href: string;
  id: string;
  subtype: "next" | "previous";
  title: string;
}) => {
  const innerLinkClassName = [
    "bg-primary",
    "py-3",
    "rounded",
    "shadow-md",
    "text-primary-content",
    "h-full",
    "w-full",
    "gap-1",
    "items-center",
    "justify-center",
    "tracking-wide",
    "grid",
    props.subtype === "previous"
      ? "grid-cols-[auto_1fr]"
      : "grid-cols-[1fr_auto]",
    props.subtype === "previous" ? "pl-3 pr-4" : "pr-3 pl-4",
    props.subtype === "previous" ? "text-right" : "text-left",
  ].join(" ");

  return (
    <Link id={props.id} href={props.href} title={props.title}>
      <div className={innerLinkClassName}>{props.children}</div>
    </Link>
  );
};

const NextNeighborLink = (props: NeighborLinkProps) => {
  const { children, href, title } = props;

  return (
    <LinkContainer
      href={href}
      subtype="next"
      title={title}
      id="neighbor-link-next"
    >
      <div>{children}</div>
      <ArrowComponent>&#x2192;</ArrowComponent>
    </LinkContainer>
  );
};

const PreviousNeighborLink = (props: NeighborLinkProps) => {
  const { children, href, title } = props;

  return (
    <LinkContainer
      href={href}
      subtype="previous"
      title={title}
      id="neighbor-link-prev"
    >
      <ArrowComponent>&#x2190;</ArrowComponent>
      <div>{children}</div>
    </LinkContainer>
  );
};

const NeighborLinks = (props: NeighborLinksProps) => {
  return (
    <div className="grid grid-cols-[4fr_2fr_4fr] px-2">
      <PreviousNeighborLink
        href={props.previousMonth.href}
        title={props.previousMonth.label}
      >
        {props.previousMonth.label}
      </PreviousNeighborLink>
      <div></div>
      <NextNeighborLink
        href={props.nextMonth.href}
        title={props.nextMonth.label}
      >
        {props.nextMonth.label}
      </NextNeighborLink>
    </div>
  );
};

export { NeighborLinks };
