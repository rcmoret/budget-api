import { Link as InertiaLink } from "@inertiajs/react";

import { Cell } from "@/components/common/Cell";

import { colorOptions } from "@/lib/theme/options";

type HeaderButtonProps = {
  namespace: string;
  accountPath: string;
};

const HeaderButtons = (props: HeaderButtonProps) => {
  const { namespace, accountPath } = props;

  return (
    <>
      <NavigationButton
        path={accountPath || "/accounts"}
        copy="Accounts"
        isSelected={namespace === "accounts"}
      />
      <NavigationButton
        path="/budget"
        copy="Budget"
        isSelected={namespace === "budget"}
      />
    </>
  );
};

type NavigationButtonProps = {
  copy: string;
  path: string;
  isSelected: boolean;
};

const NavigationButton = (props: NavigationButtonProps) => {
  const { isSelected, copy, path } = props;

  const sharedClasses = [
    "w-full",
    "rounded",
    "transition-colors",
    "text-3xl",
    "p-4",
    "h-16",
    "flex",
    "items-center",
    "justify-center",
    "focus:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-blue-500",
  ];

  const selectedClasses = [
    colorOptions.chartreuse.selected,
    "text-black",
    "font-semibold",
  ];

  const unselectedClasses = [
    colorOptions.chartreuse.unselected,
    "bg-white",
    "text-black",
    "ring-1",
    "ring-gray-400",
  ];

  const className = [
    ...sharedClasses,
    ...(isSelected ? selectedClasses : unselectedClasses),
  ].join(" ");

  return (
    <Cell
      styling={{
        width: "w-full",
        fontSize: "text-3xl",
        textAlign: "text-center",
        padding: "p-1",
      }}
    >
      <InertiaLink href={path} className={className}>
        <h2>{copy}</h2>
      </InertiaLink>
    </Cell>
  );
};

export { HeaderButtons };
