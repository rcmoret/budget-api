import React, { useState } from "react";
import Select from "react-select";
import { Link as InertiaLink } from "@inertiajs/react";

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Row } from "@/components/common/Row";
import { DateFormatter, monthOptions } from "@/lib/DateFormatter";

interface ComponentState {
  isFormShown: boolean;
  baseUrl: string;
  month: number;
  year: number;
}

interface UpdateProps {
  isFormShown?: boolean;
  baseUrl?: string;
  month?: number;
  year?: number;
}

interface ComponentProps {
  isFormShown?: boolean;
  baseUrl: string;
  month: number;
  year: number;
}

const MonthYearNav = (props: ComponentProps) => {
  const [state, updateState] = useState<ComponentState>({
    isFormShown: false,
    ...props,
  });
  const { isFormShown, month, year } = state;
  const update = (payload: UpdateProps) =>
    updateState({
      ...state,
      ...payload,
    });
  const toggleForm = () =>
    update({
      isFormShown: !isFormShown,
    });

  return (
    <div className="my-2">
      <Button
        type="button"
        onClick={toggleForm}
        styling={{ color: "text-blue-300" }}
      >
        <Icon name="calendar" />
      </Button>
      {isFormShown && (
        <Form baseUrl={props.baseUrl} month={month} update={update} year={year} />
      )}
    </div>
  );
};

interface FormProps {
  baseUrl: string;
  month: number;
  year: number;
  update: (props: UpdateProps) => void;
}

const Form = (props: FormProps) => {
  const { baseUrl, month, update, year } = props;
  const handleInputChange = (
    event: React.ChangeEvent & { target: HTMLInputElement },
  ) => {
    const target = event.target;
    update({
      [target.name]: String(target.value),
    });
  };
  const handleSelectChange = (event: { label: string; value: string }) =>
    update({
      month: Number(event.value),
    });

  const options = monthOptions({
    includeNullOption: false,
  });
  const value = options.find((option) => option.value === month);
  const href = `${baseUrl}/${month}/${year}`;

  return (
    <Row
      styling={{
        margin: "my-2",
        flexAlign: "justify-between",
        flexWrap: "flex-wrap",
        overflow: "overflow-visible",
      }}
    >
      <div className="w-7/12">
        <Select onChange={handleSelectChange} options={options} value={value} />
      </div>
      <div className="w-4/12">
        <input
          type="number"
          name="year"
          className="rounded border border-solid border-gray-800 w-full p-1 text-right"
          onChange={handleInputChange}
          value={year}
        />
      </div>
      <InertiaLink className="text-blue-300" href={href}>
        Jump to{" "}
        {DateFormatter({
          month,
          year,
          day: 1,
          format: "shortMonthYear",
        })}{" "}
        <Icon name="arrow-right" />
      </InertiaLink>
    </Row>
  );
};

export { MonthYearNav };
