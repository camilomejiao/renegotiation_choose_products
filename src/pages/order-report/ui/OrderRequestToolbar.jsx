import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

import { AppSearchInput } from "../../../shared/ui/search-input";
import { AppSelect } from "../../../shared/ui/select";
import {
  ToolbarActionButton,
  ToolbarCard,
  ToolbarDivider,
  ToolbarSection,
} from "./OrderReportPage.styles";

export const OrderRequestToolbar = ({
  loading,
  onClear,
  onSearch,
  onSearchValueChange,
  onStatusChange,
  onTypeChange,
  requestSearchError,
  requestSearchValue,
  requestStatus,
  requestStatusOptions,
  requestType,
  requestTypeOptions,
}) => {
  return (
    <ToolbarCard bordered>
      <ToolbarSection>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <AppSearchInput
              placeholder="Buscar por cedula/CUB/orden"
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
              placeholder="Estado de Solicitud"
              onChange={onStatusChange}
              isDisabled={loading}
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
