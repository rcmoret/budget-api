import { AccountManage } from "@/types/account";
import { ActionButton } from "@/lib/theme/buttons/action-button";
import { Button } from "@/components/common/Button";
import { FormRow } from "@/lib/theme/forms/manage";
import { FormSubmitButton } from "@/lib/theme/buttons/form-submit-button";
import { Icon } from "@/components/common/Icon";
import {
  SelectableOption,
  SelectionGroup,
  ThemeOptions,
} from "@/lib/theme/options";
import { UrlBuilder } from "@/lib/UrlBuilder";
import { buildQueryParams } from "@/lib/redirect_params";
import { generateKeyIdentifier } from "@/lib/KeyIdentifier";
import { useForm } from "@inertiajs/react";

const LocalSelectionGroup = (props: { children: React.ReactNode }) => {
  const optionTheme: ThemeOptions = {
    stature: "slim",
  };

  return (
    <SelectionGroup
      role="radio"
      className="w-full flex flex-row justify-between"
      optionTheme={optionTheme}
      children={props.children}
    />
  );
};

const LocalSectableOption = (props: {
  children: string | React.ReactNode;
  optionValue: boolean;
  isCashFlow: boolean;
  setCashFlow: (b: boolean) => void;
}) => {
  const { children, optionValue, isCashFlow, setCashFlow } = props;
  const onClick = () => setCashFlow(optionValue);

  return (
    <div className="w-5/12">
      <SelectableOption isSelected={isCashFlow} onClick={onClick}>
        <div className="text-xs">{children}</div>
      </SelectableOption>
    </div>
  );
};

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

  const hasValidInputs =
    !!data.name &&
    !!data.slug &&
    (data.isCashFlow === true || data.isCashFlow === false);
  const isEnabled = !processing && hasValidInputs;

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

  const { isCashFlow } = data;

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

  const setCashFlow = (bool: boolean) => {
    setData({ ...data, isCashFlow: bool });
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

  const formHeadingId = `account-form-heading-${key}`;

  return (
    <form onSubmit={onSumbit} aria-labelledby={formHeadingId}>
      <div className="w-96 border-b border-gray700 flex flex-row flex-wrap justify-between pb-2">
        <div className="hidden">{key}</div>
        <div>
          <ActionButton
            onClick={closeForm}
            color="blue"
            icon="times-circle"
            title="Close form"
            aria-label="Close form"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <FormRow
            label="Name"
            id={`name-${key}`}
            inputValue={data.name}
            labelAriaId={formHeadingId}
            name="name"
            onChange={onChange}
            required={true}
          />
          <FormRow
            label="Slug"
            id={`slug-${key}`}
            inputValue={data.slug}
            labelAriaId={formHeadingId}
            name="slug"
            onChange={onChange}
            required={true}
          />
          <FormRow
            label="Priority"
            id={`priority-${key}`}
            inputValue={data.priority}
            labelAriaId={formHeadingId}
            name="priority"
            onChange={onChange}
            required={true}
            type="number"
          />
          <div>
            <legend>Type</legend>
          </div>
          <LocalSelectionGroup>
            <LocalSectableOption
              isCashFlow={isCashFlow}
              children="Cash Flow"
              setCashFlow={setCashFlow}
              optionValue={true}
            />
            <LocalSectableOption
              isCashFlow={!isCashFlow}
              children="Budget Exclusion"
              setCashFlow={setCashFlow}
              optionValue={false}
            />
          </LocalSelectionGroup>
          <div className="w-full flex flex-row-reverse">
            <FormSubmitButton
              onSubmit={onSumbit}
              isEnabled={isEnabled}
              isBusy={!isEnabled}
              iconName="check-circle"
              title={isNew ? "Create account" : "Update account"}
            >
              {isNew ? "Create" : "Update"}
            </FormSubmitButton>
          </div>
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

  if (isFormShown) {
    return (
      <div className="w-96 flex flex-row flex-wrap justify-between pb-2">
        <NewForm closeForm={closeForm} />
      </div>
    );
  } else {
    return (
      <div className="w-72 flex flex-row flex-wrap justify-between pb-2">
        <NewButton openForm={openForm} />
      </div>
    );
  }
};

export { AccountForm, AddNewComponent };
