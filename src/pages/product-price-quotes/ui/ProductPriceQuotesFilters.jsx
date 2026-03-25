import { Col, Row } from "antd";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { AppSelect } from "../../../shared/ui/select";
import { AppSwitch } from "../../../shared/ui/switch";
import { SwitchField, SwitchLabel } from "./ProductPriceQuotesFilters.styles";

export const ProductPriceQuotesFilters = ({
  planOptions,
  selectedPlan,
  loadingPlans,
  onlyMine,
  searchQuery,
  hasSelectedPlan,
  onPlanChange,
  onOnlyMineChange,
  onSearchChange,
}) => {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={12} md={10} lg={8} xl={8} xxl={8}>
        <AppSelect
          value={selectedPlan}
          options={planOptions}
          placeholder="Selecciona un plan"
          onChange={onPlanChange}
          isLoading={loadingPlans}
        />
      </Col>

      <Col xs={24} sm={12} md={14} lg={8} xl={8} xxl={8}>
        <AppSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar sobre el plan seleccionado..."
          disabled={!hasSelectedPlan}
        />
      </Col>

      <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
        <SwitchField justify="space-between" align="center">
          <SwitchLabel>{`Ver solo mis productos (${onlyMine ? "SI" : "NO"})`}</SwitchLabel>
          <AppSwitch
            checked={onlyMine}
            onChange={onOnlyMineChange}
            disabled={!hasSelectedPlan}
          />
        </SwitchField>
      </Col>
    </Row>
  );
};
