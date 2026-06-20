import { Link } from "@inertiajs/react";

type NeighborLinkProps = {
  children: React.ReactNode;
  href: string
}

type NeighborLinksProps = {
  previousMonth: {
    href: string;
    label: React.ReactNode
  }
  nextMonth: {
    href: string;
    label: React.ReactNode
  }
}

const ArrowComponent = (props: { children: React.ReactNode }) => {
  return (
    <div className="text-info font-bold inline-block -translate-y-0.5">
      {props.children}
    </div>
  )
}

const LinkContainer = (props: { children: React.ReactNode; href: string; subtype: "next" | "previous" }) => {
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
    props.subtype === "previous" ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr_auto]",
    props.subtype === "previous" ? "pl-3 pr-4" : "pr-3 pl-4",
    props.subtype === "previous" ? "text-right" : "text-left"
  ].join(" ")

  return (
    <Link href={props.href}>
      <div className={innerLinkClassName}>
        {props.children}
      </div>
    </Link>
  )
}

const NextNeighborLink = (props: NeighborLinkProps) => {
  const { children, href } = props

  return (
    <LinkContainer href={href} subtype="next">
      <div>{children}</div>
      <ArrowComponent>
        &#x2192;
      </ArrowComponent>
    </LinkContainer>
  )
}

const PreviousNeighborLink = (props: NeighborLinkProps) => {
  const { children, href } = props

  return (
    <LinkContainer href={href} subtype="previous">
      <ArrowComponent>
        &#x2190;
      </ArrowComponent>
      <div>{children}</div>
    </LinkContainer>
  )
}

const NeighborLinks = (props: NeighborLinksProps) => {
  return (
    <div className="grid grid-cols-[4fr_2fr_4fr] px-2">
      <PreviousNeighborLink href={props.previousMonth.href}>
        {props.previousMonth.label}
      </PreviousNeighborLink>
      <div></div>
      <NextNeighborLink href={props.nextMonth.href}>
        {props.nextMonth.label}
      </NextNeighborLink>
    </div>
  )
}

export { NeighborLinks }
