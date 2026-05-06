import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSelect } from "../../../shared/ui/select";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const LeaderOrderToolbar = ({
  loading,
  onClear,
  onSearch,
  onSupplierChange,
  selectedSupplier,
  supplierOptions,
}) => {
  return (
    <ToolbarCard bordered>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={8}>
          <AppSelect
            value={selectedSupplier}
            options={supplierOptions}
            placeholder="Proveedor"
            onChange={onSupplierChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={7} xl={4} xxl={4}>
          <AppButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            style={{ width: "100%" }}
          >
            Buscar
          </AppButton>
        </Col>

        <Col xs={24} sm={12} md={6} lg={7} xl={4} xxl={4}>
          <AppButton
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading && !selectedSupplier}
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
