import { SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Input } from "antd";
import { CONTROL_HEIGHT } from "../lib/controlMetrics";

export const AppSearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  allowClear = true,
  size = "large",
  style,
  ...rest
}) => {
  return (
    <StyledSearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      size={size}
      prefix={<SearchOutlined />}
      style={{ width: "100%", ...style }}
      {...rest}
    />
  );
};

const StyledSearchInput = styled(Input)`
  && {
    min-height: ${CONTROL_HEIGHT}px;
    height: ${CONTROL_HEIGHT}px;
    border-radius: 8px;
  }
`;
