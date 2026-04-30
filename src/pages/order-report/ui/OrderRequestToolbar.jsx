import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSelect } from "../../../shared/ui/select";
import { ToolbarCard, ToolbarDivider } from "./OrderReportPage.styles";

export const OrderRequestToolbar = ({
  loading,
  onClear,
  onSearch,
  onStatusChange,
  onTypeChange,
  requestStatus,
  requestStatusOptions,
  requestType,
  requestTypeOptions,
}) => {
  return (
    <ToolbarCard bordered>
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
            placeholder="Estado de Solicitud"
            onChange={onStatusChange}
            isDisabled={loading}
          />
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <AppButton
            icon={<SearchOutlined />}
            onClick={onSearch}
            loading={loading}
            style={{ width: "100%" }}
          >
            Buscar
          </AppButton>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
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
