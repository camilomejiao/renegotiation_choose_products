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
      <ToolbarSection>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <AppSearchInput
              placeholder="Buscar por cédula/CUB/orden"
              value={requestSearchValue}
              onChange={onSearchValueChange}
              onPressEnter={onSearch}
              disabled={loading}
              status={requestSearchError ? "error" : undefined}
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
              value={requestType}
              options={requestTypeOptions}
              placeholder="Tipo de Solicitud"
              onChange={onTypeChange}
              isDisabled={loading}
            />
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <AppSelect
              value={requestStatus}
              options={requestStatusOptions}
              placeholder="Estado"
              onChange={onStatusChange}
              isDisabled={loading}
            />
          </Col>

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
        </Row>
      </ToolbarSection>

      <ToolbarSection>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <AppSelect
              value={selectedDepartment}
              options={departmentOptions}
              placeholder="Departamento"
              onChange={onDepartmentChange}
              isDisabled={loading}
            />
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <AppSelect
              value={selectedMunicipality}
              options={municipalityOptions}
              placeholder="Municipio"
              onChange={onMunicipalityChange}
              isDisabled={!selectedDepartment || loading}
            />
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <ToolbarActionButton
              variant="secondary"
              icon={<ClearOutlined />}
              onClick={onClear}
              disabled={loading}
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
