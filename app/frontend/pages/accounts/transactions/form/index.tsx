import React from "react";
import DatePicker from "react-datepicker";
import { parseISO as parseIsoDate } from "date-fns";
import { useAppConfigContext } from "@/components/layout/Provider";
import { Icon } from "@/components/common/Icon";
import { Label } from "@/pages/accounts/transactions/partials/label";
import { BudgetItemsComponent } from "@/pages/accounts/transactions/form/LineItems";
import { Button } from "@/components/common/Button";
import Select, { SingleValue } from "react-select";
import { Row } from "@/components/common/Row";
import { useToggle } from "@/lib/hooks/useToogle";
import { TransactionWithBalance } from "@/pages/accounts/transactions";
import { SubmitButton } from "@/components/common/Button";
import { Cell } from "@/components/common/Cell";
import {
  TransactionFormProvider,
  useTransactionFormContext,
} from "./context-provider";

const ClearanceDateComponent = () => {
  const { data, updateFormData, month, year } = useTransactionFormContext();
  const clearanceDate = !!data.clearanceDate
    ? parseIsoDate(data.clearanceDate)
    : null;

  const openToDate = clearanceDate || new Date(year, month - 1);

  const onChange = (input: Date | null) => {
    updateFormData({
      name: "clearanceDate",
      value: input?.toISOString().split("T")[0] || "",
    });
  };

  return (
    <div>
      <Label label="Clearance Date" />
      <DatePicker
        selected={clearanceDate}
        openToDate={openToDate}
        onChange={onChange}
        className="border border-gray-300 h-input-lg rounded px-1"
      />
    </div>
  );
};

const DescriptionComponent = () => {
  const { data, updateFormData } = useTransactionFormContext();

  const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) => {
    updateFormData({ name: ev.target.name, value: ev.target.value });
  };

  return (
    <div className="mr-4 w-full md:w-fit">
      <Label label="Description">
        <span className="italic text-xs">* optional</span>
      </Label>
      <input
        value={data.description || ""}
        name="description"
        onChange={onChange}
        style={{ width: "90%" }}
        className="border border-gray-300 h-input-lg px-1 rounded"
      />
    </div>
  );
};

const CheckNumberComponent = () => {
  const { data, updateFormData } = useTransactionFormContext();
  const { checkNumber } = data;
  const [showInput, toggleInput] = useToggle(!!checkNumber);

  const onChange = (ev: React.ChangeEvent & { target: HTMLInputElement }) =>
    updateFormData({ name: ev.target.name, value: ev.target.value });

  if (showInput) {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <span className="text-gray-600">
            <Icon name="money-check" />
          </span>
        </Button>{" "}
        Check Number
        <div>
          <input
            value={checkNumber || ""}
            name="checkNumber"
            onChange={onChange}
            className="h-input-lg px-1 border border-gray-300 rounded"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <span className="text-gray-600">
            <Icon name="money-check" />
          </span>
        </Button>
      </div>
    );
  }
};

const NotesComponent = () => {
  const { data, updateFormData } = useTransactionFormContext();
  const { notes } = data;
  const [showInput, toggleInput] = useToggle(!!notes);

  const onChange = (ev: React.ChangeEvent & { target: HTMLTextAreaElement }) =>
    updateFormData({ name: ev.target.name, value: ev.target.value });

  if (showInput) {
    return (
      <div className="w-full md:w-fit">
        <Button type="button" onClick={toggleInput}>
          <span className="text-gray-600">
            <Icon name="sticky-note" />
          </span>
        </Button>{" "}
        Notes
        <div>
          <textarea
            value={notes || ""}
            name="notes"
            onChange={onChange}
            className="border border-gray-300 border-solid rounded w-full px-1"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Button type="button" onClick={toggleInput}>
          <span className="text-gray-600">
            <Icon name="sticky-note" />
          </span>
        </Button>
      </div>
    );
  }
};

const BudgetExclusionComponent = () => {
  const { data, updateFormData } = useTransactionFormContext();
  const { isBudgetExclusion } = data;
  const { appConfig } = useAppConfigContext();
  const { isCashFlow } = appConfig.account;

  const onChange = () => {
    updateFormData({ name: "isBudgetExclusion", value: !isBudgetExclusion });
  };

  if (isCashFlow) {
    return null;
  }

  return (
    <div>
      <div>Budget Exclusion?</div>
      <input type="checkbox" onChange={onChange} checked={isBudgetExclusion} />
    </div>
  );
};

const AccountSelectComponent = () => {
  const { data, updateFormData, isNew } = useTransactionFormContext();
  const { appConfig } = useAppConfigContext();

  if (isNew) {
    return null;
  }

  const options = appConfig.accounts.map((account) => ({
    label: account.name,
    value: account.key,
  }));

  const value =
    options.find((option) => option.value === data.accountKey) || "";

  const onChange = (ev: SingleValue<{ label: string; value: string }>) => {
    updateFormData({ name: "accountKey", value: ev?.value || "" });
  };

  return (
    <Select
      options={options}
      value={value}
      // @ts-ignore
      onChange={onChange}
    />
  );
};

const SubmitButtonComponent = () => {
  const { processing, onSubmit, isNew } = useTransactionFormContext();

  return (
    <SubmitButton onSubmit={onSubmit} isEnabled={!processing} styling={{}}>
      <div className="bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1 flex flex-row gap-2 font-semibold">
        {isNew ? "CREATE" : "UPDATE"}
        <div className="text-chartreuse-300">
          <Icon name="check-circle" />
        </div>
      </div>
    </SubmitButton>
  );
};

const TransactionFormContent = () => {
  const { data, isOdd, closeForm, onSubmit } = useTransactionFormContext();

  const bgColor = isOdd ? "bg-sky-100" : "bg-gray-50";

  return (
    <Row
      styling={{
        padding: "px-2 py-1",
        flexWrap: "flex-wrap",
        backgroundColor: bgColor,
      }}
    >
      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full rounded flex flex-row flex-wrap px-2 py-1 gap-2 border border-gray-300">
          <Cell
            styling={{
              display: "flex",
              flexAlign: "justify-between md:justify-start",
              width: "w-full md:w-fit",
            }}
          >
            <div className="hidden">{data.key}</div>
            <div className="mr-4">
              <Button type="button" onClick={closeForm}>
                <span className="text-gray-600">
                  <Icon name="times-circle" />
                </span>
              </Button>
            </div>
            <ClearanceDateComponent />
          </Cell>
          <Cell styling={{ display: "flex", width: "w-full md:w-fit" }}>
            <DescriptionComponent />
          </Cell>
          <BudgetItemsComponent />
          <div className="flex flex-col w-8/12 md:w-2/12 gap-2">
            <CheckNumberComponent />
            <NotesComponent />
            <BudgetExclusionComponent />
          </div>
          <div className="w-full md:w-3/12 ">
            <AccountSelectComponent />
          </div>
          <div className="w-full md:w-fit text-right grow self-end text-lg">
            <div>
              <SubmitButtonComponent />
            </div>
          </div>
        </div>
      </form>
    </Row>
  );
};

const TransactionForm = (props: {
  transaction: TransactionWithBalance;
  index: number;
  month: number;
  year: number;
  isNew?: boolean;
  onSuccess: () => void;
  closeForm: () => void;
}) => {
  return (
    <TransactionFormProvider
      transaction={props.transaction}
      index={props.index}
      month={props.month}
      year={props.year}
      isNew={!!props.isNew}
      closeForm={props.closeForm}
      onSuccess={props.onSuccess}
    >
      <TransactionFormContent />
    </TransactionFormProvider>
  );
};

export { TransactionForm };
