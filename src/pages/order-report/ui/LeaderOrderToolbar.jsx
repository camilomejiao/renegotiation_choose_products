import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppSearchInput } from "../../../shared/ui/search-input";
import { AppSelect } from "../../../shared/ui/select";
import { matchesSupplierSelectOption } from "../model/supplierSelectSearch";
import {
  ToolbarActionButton,
  ToolbarCard,
  ToolbarDivider,
  ToolbarSection,
} from "./OrderReportPage.styles";

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
      <ToolbarSection>
        <Row gutter={[12, 12]}>
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
            <ToolbarActionButton
              icon={<SearchOutlined />}
              onClick={onSearch}
              loading={loading}
            >
              Buscar
            </ToolbarActionButton>
          </Col>
        </Row>
      </ToolbarSection>

      <ToolbarSection>
        <Row gutter={[12, 12]}>
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
            <ToolbarActionButton
              variant="secondary"
              icon={<ClearOutlined />}
              onClick={onClear}
              disabled={loading && !selectedSupplier && !orderSearchValue}
            >
              Limpiar
            </ToolbarActionButton>
          </Col>
        </Row>
      </ToolbarSection>

      <ToolbarDivider />
    </ToolbarCard>
  );
};
