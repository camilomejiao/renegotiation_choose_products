import { Input } from "antd";

export const AppInput = ({ value, onChange, placeholder, size = "middle", style, ...rest }) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size={size}
      style={{ width: "100%", ...style }}
      {...rest}
    />
  );
};
