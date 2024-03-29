import { snakeCaseToCapitalized } from "lib/index";
import { FormItemProps } from "lib/types";
import { InputGroup, FormControl } from "react-bootstrap";
import { Field, FieldProps, useFormikContext } from "Formik";

type TextInputProps = FormItemProps & {
  autoComplete?: boolean;
  disabled?: boolean;
};
export default function TextInput(props: TextInputProps) {
  const { touched, errors } = useFormikContext();

  return (
    <div>
      <InputGroup>
        <InputGroup.Text>
          {props.label ?? `${snakeCaseToCapitalized(props.field_id)}: `}
        </InputGroup.Text>
        <Field id={props.field_id} name={props.field_id}>
          {({ field }: FieldProps) => (
            <FormControl
              type="text"
              autoComplete={props.autoComplete ? "on" : "off"}
              disabled={props.disabled}
              {...field}
            />
          )}
        </Field>
      </InputGroup>
      {(touched as any)[props.field_id] && (
        <small>{(errors as any)[props.field_id]}</small>
      )}
    </div>
  );
}
