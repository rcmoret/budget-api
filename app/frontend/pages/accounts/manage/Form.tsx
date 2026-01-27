import { AccountManage } from "@/types/account";
import { Button, SubmitButton } from "@/components/common/Button";
import { useForm } from "@inertiajs/react";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { Icon } from "@/components/common/Icon";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";

const AccountForm = (props: {
  account: AccountManage;
  closeForm: () => void;
  isNew?: boolean;
}) => {
  const { account, closeForm } = props;
  const { key, createdAt, isArchived, archivedAt, ...formProps } = account;
  const isNew = !!props.isNew;

  const { data, setData, transform, processing, post, put } =
    useForm(formProps);

  // @ts-ignore
  transform(() => {
    const { isCashFlow, ...updateProps } = data;

    return {
      account: {
        ...updateProps,
        cashFlow: isCashFlow,
        ...(isNew ? { key: account.key } : {}),
      },
    };
  });

  const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) => {
    const { name } = ev.target;

    if (name === "isCashFlow") {
      setData({ ...data, isCashFlow: ev.target.value === "on" });
      return;
    }
    if (name === "isBudgetExclusion") {
      setData({ ...data, isCashFlow: !(ev.target.value === "on") });
      return;
    }

    setData({ ...data, [name]: ev.target.value });
  };

  const putUpdate = () => {
    const formUrl = UrlBuilder({
      key,
      name: "AccountShow",
      queryParams: buildQueryParams(["accounts", "manage"]),
    });
    put(formUrl, { onSuccess: closeForm });
  };

  const postNew = () => {
    const formUrl = UrlBuilder({
      name: "AccountIndex",
      queryParams: buildQueryParams(["accounts", "manage"]),
    });
    post(formUrl, { onSuccess: closeForm });
  };

  const onSumbit = () => {
    if (isNew) {
      postNew();
    } else {
      putUpdate();
    }
  };

  return (
    <form onSubmit={onSumbit}>
      <div className="w-72 border-b border-gray700 flex flex-row flex-wrap justify-between pb-2">
        <div className="hidden">{key}</div>
        <div className="w-full">
          <div className="w-full flex flex-row justify-between">
            <div>Name</div>
            <div>
              <Button
                type="button"
                onClick={closeForm}
                styling={{ color: "text-blue-300" }}
              >
                <Icon name="times-circle" />
              </Button>
            </div>
          </div>
          <input
            type="string"
            name="name"
            className="border border-gray-300 rounded h-input-lg px-1"
            value={data.name}
            onChange={onChange}
          />
        </div>
        <div className="w-full">
          <div>Slug</div>
          <input
            type="string"
            name="slug"
            value={data.slug}
            onChange={onChange}
            className="border border-gray-300 rounded h-input-lg px-1"
          />
        </div>
        <div className="w-full">
          <div>Priority</div>
          <input
            type="number"
            name="priority"
            value={data.priority}
            onChange={onChange}
            className="border border-gray-300 rounded h-input-lg px-1"
          />
        </div>
        <div className="w-full">
          <div>Type</div>
          <div className="w-full flex flex-row justify-between">
            <div className="w-6/12">
              <div>Cash Flow</div>
              <input
                type="checkbox"
                name="isCashFlow"
                checked={data.isCashFlow}
                className="border border-gray-300 rounded h-input-lg px-1"
                onChange={onChange}
              />
            </div>
            <div className="w-6/12">
              <div>Budget Exclusion</div>
              <input
                type="checkbox"
                name="isBudgetExclusion"
                className="border border-gray-300 rounded h-input-lg px-1"
                checked={!data.isCashFlow}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row-reverse">
          <SubmitButton
            onSubmit={onSumbit}
            styling={{
              rounded: "rounded",
              backgroundColor: "bg-green-600",
              color: "text-white",
              padding: "px-4 py-1",
            }}
            isEnabled={!processing}
          >
            {isNew ? "Create" : "Update"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
};

const NewForm = (props: { closeForm: () => void }) => {
  const { closeForm } = props;

  const account = {
    key: generateKeyIdentifier(),
    name: "",
    slug: "",
    priority: 10000,
    archivedAt: "",
    createdAt: "",
    isArchived: false,
    isCashFlow: true,
  };

  return <AccountForm account={account} closeForm={closeForm} isNew={true} />;
};

const NewButton = (props: { openForm: () => void }) => {
  return (
    <div className="w-full border-b border-gray700 pb-2">
      <Button
        type="button"
        onClick={props.openForm}
        styling={{ color: "text-blue-300" }}
      >
        <div className="w-full flex flex-row gap-2">
          <Icon name="plus-circle" />
          <div>Add New</div>
        </div>
      </Button>
    </div>
  );
};

const AddNewComponent = (props: {
  isFormShown: boolean;
  setShowFormFor: (id: null | string) => void;
}) => {
  const { isFormShown, setShowFormFor } = props;
  const closeForm = () => setShowFormFor(null);
  const openForm = () => setShowFormFor("__new__");

  return (
    <div className="w-72 flex flex-row flex-wrap justify-between pb-2">
      {isFormShown ? (
        <NewForm closeForm={closeForm} />
      ) : (
        <NewButton openForm={openForm} />
      )}
    </div>
  );
};

export { AccountForm, AddNewComponent };
