import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppSearchInput } from "../../../shared/ui/search-input";
import {
  ToolbarActionButton,
  ToolbarCard,
  ToolbarDivider,
} from "./OrderReportPage.styles";

export const OrderReportToolbar = ({
  loading,
  onClear,
  onSearch,
  onSearchQueryChange,
  searchQuery,
}) => {
  return (
    <ToolbarCard bordered>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <AppSearchInput
            placeholder="Buscar por documento"
            value={searchQuery}
            onChange={onSearchQueryChange}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <ToolbarActionButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
          >
            Buscar
          </ToolbarActionButton>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <ToolbarActionButton
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading && !searchQuery}
          >
            Limpiar
          </ToolbarActionButton>
        </Col>
      </Row>

      <ToolbarDivider />
    </ToolbarCard>
  );
};
