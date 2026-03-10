import { StyledInput, StyledPasswordInput } from "./AppInput.styles";

export const AppInput = ({ value, onChange, placeholder, size = "middle", className, ...rest }) => {
  const InputComponent = rest.type === "password" ? StyledPasswordInput : StyledInput;

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
