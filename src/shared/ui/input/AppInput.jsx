import {
  StyledInput,
  StyledPasswordInput,
  StyledTextArea,
} from "./AppInput.styles";

export const AppInput = ({
  value,
  onChange,
  placeholder,
  size = "middle",
  className,
  multiline = false,
  type,
  ...rest
}) => {
  let InputComponent = StyledInput;
  const inputProps = {
    className,
    value,
    onChange,
    placeholder,
    size,
    ...rest,
  };

  if (multiline) {
    InputComponent = StyledTextArea;
  } else if (type === "password") {
    InputComponent = StyledPasswordInput;
  } else if (type) {
    inputProps.type = type;
  }

  return (
    <InputComponent
      {...inputProps}
    />
  );
};
