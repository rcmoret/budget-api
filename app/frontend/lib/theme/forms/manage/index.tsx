import { ThemedInput } from "@/lib/theme/input";

type FormRowContainerProps = {
  id: string;
  children: React.ReactNode;
  label: string;
  labelAriaId: string;
  name: string;
};

const FormRowContainer = (props: FormRowContainerProps) => {
  return (
    <div className="w-full flex flex-row justify-between">
      <label htmlFor={props.id} id={props.labelAriaId}>
        {props.label}
      </label>
      {props.children}
    </div>
  );
};

type FormRowProps = {
  id: string;
  inputValue: number | string;
  label: string;
  labelAriaId: string;
  name: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  type?: "number" | "text";
};

const FormRow = (props: FormRowProps) => {
  const { id, inputValue, label, labelAriaId, name, onChange } = props;

  const type = props.type ?? "text";

  return (
    <FormRowContainer
      id={id}
      name={name}
      label={label}
      labelAriaId={labelAriaId}
    >
      <ThemedInput
        id={id}
        name={name}
        onChange={onChange}
        required={true}
        type={type}
        value={inputValue}
      />
    </FormRowContainer>
  );
};

export { FormRow, FormRowContainer };
