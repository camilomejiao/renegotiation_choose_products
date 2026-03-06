import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

export const CatalogSearchInput = ({ value, onChange }) => {
  return (
    <SearchInput
      size="large"
      placeholder="Buscar..."
      prefix={<SearchOutlined />}
      value={value}
      onChange={onChange}
    />
  );
};

const SearchInput = styled(Input)`
  width: 100%;
`;
