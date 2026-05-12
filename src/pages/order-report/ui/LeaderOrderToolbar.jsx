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
        <Col xs={24} sm={24} md={12} lg={10} xl={6} xxl={6}>
          <AppSearchInput
            placeholder="Buscar por cédula/CUB/orden"
            value={orderSearchValue}
            onChange={onSearchValueChange}
            onPressEnter={onSearch}
            disabled={loading}
            status={orderSearchError ? "error" : undefined}
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
      </Row>

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
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading && !selectedSupplier && !orderSearchValue}
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
