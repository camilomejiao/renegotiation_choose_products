import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { AppSelect } from "../../../shared/ui/select";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const LeaderOrderToolbar = ({
  loading,
  onClear,
  onSearch,
  onSearchQueryChange,
  onSupplierChange,
  searchQuery,
  selectedSupplier,
  supplierOptions,
}) => {
  return (
    <ToolbarCard bordered>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={12} lg={10} xl={6} xxl={6}>
          <AppSearchInput
            placeholder="Buscar por documento"
            value={searchQuery}
            onChange={onSearchQueryChange}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={10} xl={6} xxl={6}>
          <AppSelect
            value={selectedSupplier}
            options={supplierOptions}
            placeholder="Proveedor"
            onChange={onSupplierChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={7} xl={3} xxl={3}>
          <AppButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            style={{ width: "100%" }}
          >
            Buscar
          </AppButton>
        </Col>

        <Col xs={24} sm={12} md={6} lg={7} xl={3} xxl={3}>
          <AppButton
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading && !selectedSupplier && !searchQuery}
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
