import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

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
          <AppButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            style={{ width: "100%" }}
          >
            Buscar
          </AppButton>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <AppButton
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading && !searchQuery}
            style={{ width: "100%" }}
          >
            Limpiar
          </AppButton>
        </Col>
      </Row>

      <ToolbarDivider />
    </ToolbarCard>
  );
};
