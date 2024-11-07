import { InertiaLink } from "@inertiajs/inertia-react";

import { Cell } from "@/components/common/Cell";
// import { Row } from "@/components/common/Row";

type HeaderButtonProps = {
  namespace: string;
  accountPath: string;
}

export const HeaderButtons = (props: HeaderButtonProps) => {
  const { namespace } = props
  const textColor = "text-gray-500";
  const selectedTextColor = "text-black";
  const bgColor = "bg-gradient-to-b from-gray-300 to-gray-100";
  const selectedBgColor = "bg-gradient-to-b from-green-500 to-green-300";
  const accountsBgColor = namespace === "accounts" ? selectedBgColor : bgColor;
  const accountsTextColor =
    namespace === "accounts" ? selectedTextColor : textColor;
  const budgetTextColor =
    namespace === "budget" ? selectedTextColor : textColor;
  const budgetBgColor = namespace === "budget" ? selectedBgColor : bgColor;
  const accountPath = props.accountPath || "/accounts"

  return (
    <>
      <MainLink
        path={accountPath}
        copy="Accounts"
        bgColor={accountsBgColor}
        textColor={accountsTextColor}
      />
      <MainLink
        path={`/budget`}
        copy="Budget"
        bgColor={budgetBgColor}
        textColor={budgetTextColor}
      />
    </>
  );
};

type MainLinkProps = {
  copy: string;
  path: string;
  bgColor: string;
  textColor: string;
}

const MainLink = (props: MainLinkProps) => {
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
          <div className={`w-full ${props.bgColor} rounded pt-4 pb-4`}>
            <h2 className={props.textColor}>{props.copy}</h2>
          </div>
        </InertiaLink>
      </div>
    </Cell>
  )
}
