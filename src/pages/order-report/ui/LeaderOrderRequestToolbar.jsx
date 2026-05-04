import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSelect } from "../../../shared/ui/select";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const LeaderOrderRequestToolbar = ({
  departmentOptions,
  loading,
  municipalityOptions,
  onClear,
  onDepartmentChange,
  onMunicipalityChange,
  onSearch,
  onStatusChange,
  onSupplierChange,
  onTypeChange,
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
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={12} lg={8} xl={3} xxl={3}>
          <AppSelect
            value={requestType}
            options={requestTypeOptions}
            placeholder="Tipo de Solicitud"
            onChange={onTypeChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={3} xxl={3}>
          <AppSelect
            value={requestStatus}
            options={requestStatusOptions}
            placeholder="Estado"
            onChange={onStatusChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={3} xxl={3}>
          <AppSelect
            value={selectedSupplier}
            options={supplierOptions}
            placeholder="Proveedor"
            onChange={onSupplierChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={3} xxl={3}>
          <AppSelect
            value={selectedDepartment}
            options={departmentOptions}
            placeholder="Departamento"
            onChange={onDepartmentChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={3} xxl={3}>
          <AppSelect
            value={selectedMunicipality}
            options={municipalityOptions}
            placeholder="Municipio"
            onChange={onMunicipalityChange}
            isDisabled={!selectedDepartment || loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
          <AppButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            style={{ width: "100%" }}
          >
            Buscar
          </AppButton>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={5} xxl={5}>
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
