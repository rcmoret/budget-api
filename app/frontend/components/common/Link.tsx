import React, { SyntheticEvent } from "react";
import { Link as InertiaLink } from "@inertiajs/react";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  styling?: {
    color?: string;
    hoverBgColor?: string;
    hoverColor?: string;
    hoverBgOpacity?: string | null;
  };
}

const ButtonStyleLink = (props: ButtonLinkProps) => {
  const styling = {
    color: "text-white",
    hoverBgColor: "hover:bg-blue-800",
    hoverBgOpacity: null,
    hoverColor: "hover:text-white",
    bgColor: "bg-blue-600",
    padding: "p-2",
    rounded: "rounded",
    ...props.styling,
  };

  const classes = Object.values(styling).filter((val) => val && val !== "");

  return (
    <InertiaLink href={props.href} className={classes.join(" ")}>
      {props.children}
    </InertiaLink>
  );
};

interface ActionAnchorProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  title?: string;
}

interface ElementProps {
  className: string;
  onClick: (event: SyntheticEvent) => void;
  title?: string;
  href: "#";
}

const ActionAnchorTag = (props: ActionAnchorProps) => {
  const onClick = (event: SyntheticEvent) => {
    event.preventDefault();
    props.onClick();
  };

  let elementProps: ElementProps = {
    className: (props.className || ""),
    onClick,
    href: "#"
  }
  if (props.title) { elementProps = { ...elementProps, title: props.title } }

  return (
    <a {...elementProps}>
      {props.children}
    </a>
  );
};

export { ActionAnchorTag, ButtonStyleLink };
