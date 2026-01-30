import { Point } from "@/components/common/Symbol";

type HeaderPath = "/budget/categories" | "/accounts/manage" | "/sign-out";

const LocalLink = (props: { label: string; href: HeaderPath }) => {
  return (
    <div className="text-sm px-4 text-blue-600">
      <Point>
        <a href={props.href} className="underline font-semibold">
          {props.label}
        </a>
      </Point>
    </div>
  );
};

const HeaderLinks = () => {
  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-1/2 flex flex-col gap-1">
        <LocalLink label="Accounts" href="/accounts/manage" />
        <LocalLink label="Categories" href="/budget/categories" />
      </div>
      <div className="w-1/2 flex flex-col-reverse gap-1 items-end">
        <LocalLink label="Log Out" href="/sign-out" />
      </div>
    </div>
  );
};

export { HeaderLinks };
