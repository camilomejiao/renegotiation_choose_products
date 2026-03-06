import { useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { Page } from "../../../shared/ui/page";
import { SmartTable } from "../../../shared/ui/smart-table";
import { AppAutocomplete } from "../../../shared/ui/autocomplete";
import { AppSelect } from "../../../shared/ui/select";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { getCatalogReportColumns } from "../model/getCatalogReportColumns";
import { useCatalogReportPage } from "../model/useCatalogReportPage";
import {
  ContentSection,
  HeaderSection,
  ReportTableCard,
  SearchButton,
  SearchButtonCol,
  StyledDivider,
  ToolbarCard,
  ToolbarDivider,
} from "./CatalogReportPage.styles";

export const CatalogReportPage = () => {
  const {
    loading,
    loadingTable,
    selectedConvocation,
    selectedPlan,
    selectedSupplier,
    convocationOptions,
    planOptions,
    supplierOptions,
    searchQuery,
    filteredRows,
    loadReport,
    handleConvocationChange,
    handlePlanChange,
    handleSupplierChange,
    handleSearchQueryChange,
  } = useCatalogReportPage();

  const columns = useMemo(() => getCatalogReportColumns(), []);

  const pageHeader = useMemo(
    () => ({
      title: "Reporte por Convocatoria",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: <Link to="/admin/list-products-by-convocation">Administración de Catálogo</Link> },
        { title: "Reporte" },
      ],
    }),
    []
  );

  return (
    <Page
      showPageHeader
      header={pageHeader}
      contentPadding="0"
      minHeight="auto"
      headerPaddingTop="36px"
      headerMarginBottom="12px"
    >
      <HeaderSection>
        <HeaderImage imageHeader={imgPeople} titleHeader="¡Reporte de productos!" />
      </HeaderSection>

      <ContentSection>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <StyledDivider />
          </Col>

          <Col span={24}>
            <ToolbarCard bordered>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12} lg={6}>
                  <AppSelect
                    value={selectedConvocation}
                    options={convocationOptions}
                    placeholder="Selecciona una Jornada"
                    onChange={handleConvocationChange}
                    isLoading={loading}
                    noOptionsMessage={() => "Sin opciones"}
                  />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <AppSelect
                    value={selectedPlan}
                    options={planOptions}
                    placeholder="Selecciona un Plan"
                    onChange={handlePlanChange}
                    isDisabled={!selectedConvocation || loading}
                    isLoading={loading}
                    noOptionsMessage={() =>
                      selectedConvocation ? "Sin planes" : "Selecciona una jornada"
                    }
                  />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                  <AppAutocomplete
                    value={selectedSupplier}
                    options={supplierOptions}
                    placeholder="Selecciona un Proveedor"
                    onChange={handleSupplierChange}
                    isDisabled={!selectedConvocation || loading}
                    isLoading={loading}
                    showAllOnOpen
                  />
                </Col>

                <SearchButtonCol xs={24} sm={12} lg={4}>
                  <SearchButton
                    icon={<SearchOutlined />}
                    onClick={loadReport}
                    disabled={!selectedPlan?.value || loading}
                  >
                    Buscar
                  </SearchButton>
                </SearchButtonCol>
              </Row>

              <ToolbarDivider />

              <Row>
                <Col xs={24} sm={12} lg={8}>
                  <AppSearchInput
                    placeholder="Buscar en la tabla..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                  />
                </Col>
              </Row>
            </ToolbarCard>
          </Col>

          <Col span={24}>
            <ReportTableCard bordered>
              <SmartTable
                rowKey="id"
                columns={columns}
                dataSource={filteredRows}
                loading={loadingTable}
                total={filteredRows.length}
                reload={loadReport}
                showPagination
                pageSizeOptions={["10", "50", "100"]}
                defaultPageSize="10"
                enableRowSelection
                showToolbar
                showColumnSettings={false}
                showTableResize={false}
                scroll={{ x: "max-content" }}
                download={{
                  enable: true,
                  fileName: "reporte-convocatoria",
                }}
              />
            </ReportTableCard>
          </Col>
        </Row>
      </ContentSection>
    </Page>
  );
};
