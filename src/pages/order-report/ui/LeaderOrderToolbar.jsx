import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { AppSelect } from "../../../shared/ui/select";
import { matchesSupplierSelectOption } from "../model/supplierSelectSearch";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const LeaderOrderToolbar = ({
  loading,
  onClear,
  onSearch,
  onSearchValueChange,
  onSupplierChange,
  orderSearchError,
  orderSearchValue,
  selectedSupplier,
  supplierOptions,
}) => {
  return (
    <ToolbarCard bordered>
      <Row gutter={[12, 12]} style={{ marginBottom: 8 }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <AppSearchInput
            placeholder="Buscar por cédula/CUB/orden"
            value={orderSearchValue}
            onChange={onSearchValueChange}
            disabled={loading}
            status={orderSearchError ? "error" : undefined}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <AppButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            style={{ width: "25%" }}
          >
            Buscar
          </AppButton>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <AppSelect
            value={selectedSupplier}
            options={supplierOptions}
            placeholder="Proveedor (nombre o NIT)"
            onChange={onSupplierChange}
            filterOption={matchesSupplierSelectOption}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <AppButton
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading && !selectedSupplier && !orderSearchValue}
            style={{ width: "25%" }}
          >
            Limpiar
          </AppButton>
        </Col>
      </Row>

      <ToolbarDivider />
    </ToolbarCard>
  );
};
