import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { AppSelect } from "../../../shared/ui/select";
import { matchesSupplierSelectOption } from "../model/supplierSelectSearch";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const LeaderOrderRequestToolbar = ({
  departmentOptions,
  loading,
  municipalityOptions,
  onClear,
  onDepartmentChange,
  onMunicipalityChange,
  onSearch,
  onSearchValueChange,
  onStatusChange,
  onSupplierChange,
  onTypeChange,
  requestSearchError,
  requestSearchValue,
  requestStatus,
  requestStatusOptions,
  requestType,
  requestTypeOptions,
  selectedDepartment,
  selectedMunicipality,
  selectedSupplier,
  supplierOptions,
}) => {
  return (
    <ToolbarCard bordered>
      <Row gutter={[12, 12]} style={{ marginBottom: 8 }}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <AppSearchInput
            placeholder="Buscar por cédula/CUB/orden"
            value={requestSearchValue}
            onChange={onSearchValueChange}
            onPressEnter={onSearch}
            disabled={loading}
            status={requestSearchError ? "error" : undefined}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
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

      <Row gutter={[12, 12]} style={{ marginTop: 12, marginBottom: 8 }}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <AppSelect
            value={requestType}
            options={requestTypeOptions}
            placeholder="Tipo de Solicitud"
            onChange={onTypeChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
          <AppSelect
            value={requestStatus}
            options={requestStatusOptions}
            placeholder="Estado"
            onChange={onStatusChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <AppSelect
            value={selectedSupplier}
            options={supplierOptions}
            placeholder="Proveedor (nombre o NIT)"
            onChange={onSupplierChange}
            filterOption={matchesSupplierSelectOption}
            isDisabled={loading}
          />
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ margin: "25px -6px 8px" }}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <AppSelect
            value={selectedDepartment}
            options={departmentOptions}
            placeholder="Departamento"
            onChange={onDepartmentChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <AppSelect
            value={selectedMunicipality}
            options={municipalityOptions}
            placeholder="Municipio"
            onChange={onMunicipalityChange}
            isDisabled={!selectedDepartment || loading}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <AppButton
            variant="secondary"
            icon={<ClearOutlined />}
            onClick={onClear}
            disabled={loading}
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
