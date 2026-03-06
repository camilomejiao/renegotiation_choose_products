import { SearchOutlined } from "@ant-design/icons";
import { StyledSearchInput } from "./AppSearchInput.styles";

export const AppSearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  allowClear = true,
  size = "large",
  className,
  ...rest
}) => {
  return (
    <StyledSearchInput
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      size={size}
      prefix={<SearchOutlined />}
      {...rest}
    />
  );
};
