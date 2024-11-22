import React from "react";
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
    hoverBgColor: "hover:bg-orange-900",
    hoverBgOpacity: null,
    hoverColor: "hover:text-white",
    bgColor: "bg-orange-800",
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

export { ButtonStyleLink };
