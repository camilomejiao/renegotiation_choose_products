import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { ToolbarActions, ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const OrderReportToolbar = ({
  loading,
  onClear,
  onSearch,
  onSearchQueryChange,
  searchQuery,
}) => {
  return (
    <ToolbarCard bordered>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={8}>
          <AppSearchInput
            placeholder="Buscar por documento"
            value={searchQuery}
            onChange={onSearchQueryChange}
          />
        </Col>

        <Col xs={24} sm={24} md={24} lg={14} xl={16} xxl={16}>
          <ToolbarActions>
            <AppButton
              icon={<SearchOutlined />}
              onClick={onSearch}
              loading={loading}
            >
              Buscar
            </AppButton>
            <AppButton
              variant="secondary"
              icon={<ClearOutlined />}
              onClick={onClear}
              disabled={loading && !searchQuery}
            >
              Limpiar
            </AppButton>
          </ToolbarActions>
        </Col>
      </Row>

      <ToolbarDivider />
    </ToolbarCard>
  );
};
