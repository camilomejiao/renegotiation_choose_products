import { StyledInput } from "./AppInput.styles";

export const AppInput = ({ value, onChange, placeholder, size = "middle", className, ...rest }) => {
  return (
    <StyledInput
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size={size}
      {...rest}
    />
  );
};
