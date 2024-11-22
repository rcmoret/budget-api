import { Link as InertiaLink } from "@inertiajs/react";

import { Cell } from "@/components/common/Cell";

type HeaderButtonProps = {
  namespace: string;
  accountPath: string;
}

export const HeaderButtons = (props: HeaderButtonProps) => {
  const { namespace } = props
  const textColor = "text-gray-800";
  const selectedTextColor = "text-gray-100";
  const bgColor = "bg-gradient-to-b from-gray-200 to-gray-300";
  const selectedBgColor = "bg-cyan-800";
  const accountsBgColor = namespace === "accounts" ? selectedBgColor : bgColor;
  const accountsTextColor =
    namespace === "accounts" ? selectedTextColor : textColor;
  const budgetTextColor =
    namespace === "budget" ? selectedTextColor : textColor;
  const budgetBgColor = namespace === "budget" ? selectedBgColor : bgColor;
  const accountPath = props.accountPath || "/accounts"
  const accountsBorder =
    namespace === "accounts" ? "border-2 border-cyan-1000" : "border border-gray-400"
  const budgetBorder =
    namespace === "budget" ? "border-2 border-cyan-1000" : "border border-gray-400"


  return (
    <>
      <MainLink
        path={accountPath}
        copy="Accounts"
        bgColor={accountsBgColor}
        textColor={accountsTextColor}
        border={accountsBorder}
      />
      <MainLink
        path={`/budget`}
        copy="Budget"
        bgColor={budgetBgColor}
        textColor={budgetTextColor}
        border={budgetBorder}
      />
    </>
  );
};

type MainLinkProps = {
  copy: string;
  path: string;
  bgColor: string;
  border: string | null;
  textColor: string;
}

const MainLink = (props: MainLinkProps) => {
  const border = props.border || ""
  return (
    <Cell
      styling={{
        width: "w-full",
        fontSize: "text-3xl",
        textAlign: "text-center",
        padding: "p-1",
      }}
    >
      <div className="w-full">
        <InertiaLink href={props.path}>
          <div className={`w-full ${props.bgColor} ${border} rounded pt-4 pb-4`}>
            <h2 className={props.textColor}>{props.copy}</h2>
          </div>
        </InertiaLink>
      </div>
    </Cell>
  )
}
