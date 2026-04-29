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
  ...rest
}) => {
  let InputComponent = StyledInput;

  if (multiline) {
    InputComponent = StyledTextArea;
  } else if (rest.type === "password") {
    InputComponent = StyledPasswordInput;
  }

  return (
    <InputComponent
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size={size}
      {...rest}
    />
  );
};
