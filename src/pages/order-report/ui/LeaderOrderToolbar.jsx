import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSelect } from "../../../shared/ui/select";
import { matchesSupplierSelectOption } from "../model/supplierSelectSearch";
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
        <Col xs={24} sm={24} md={12} lg={10} xl={6} xxl={6}>
          <AppSelect
            value={selectedSupplier}
            options={supplierOptions}
            placeholder="Proveedor (nombre o NIT)"
            onChange={onSupplierChange}
            filterOption={matchesSupplierSelectOption}
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
