import React, { SyntheticEvent } from "react";
import { InertiaLink } from "@inertiajs/inertia-react";

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
}

const ActionAnchorTag = (props: ActionAnchorProps) => {
  const onClick = (event: SyntheticEvent) => {
    event.preventDefault();
    props.onClick();
  };
  return (
    <a href="#" className={props.className || ""} onClick={onClick}>
      {props.children}
    </a>
  );
};

export { ActionAnchorTag, ButtonStyleLink };
