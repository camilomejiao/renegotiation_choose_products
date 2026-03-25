import { useMemo } from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { CatalogStatusPill, isCatalogItemClosed, isCatalogItemOpen } from "../../../entities/catalog-item";
import { CatalogSearchInput } from "../../../features/catalog-search";
import { CreateCatalogItemButton } from "../../../features/create-catalog-item";
import { ExportCatalogReportButton } from "../../../features/export-catalog-report";
import { Page } from "../../../shared/ui/page";
import { SmartTable } from "../../../shared/ui/smart-table";
import { useThemeMode } from "../../../shared/ui/theme/ThemeProvider";
import { themeTokens } from "../../../shared/ui/theme/tokens";
import { getCatalogManagementColumns } from "../model/getCatalogManagementColumns";
import { useCatalogManagementPage } from "../model/useCatalogManagementPage";
import { CatalogSuppliersModal } from "./CatalogSuppliersModal";
import {
  ActionsSpace,
  ContentSection,
  HeaderSection,
  SmartTableCard,
  StyledDivider,
  SuppliersViewButton,
  CatalogActionIconButton,
  RowActions,
  ToolbarCard,
  ToolbarDivider,
} from "./CatalogManagementPage.styles";

export const CatalogManagementPage = () => {
  const {
    loading,
    rows,
    searchQuery,
    showSuppliersModal,
    suppliersModalData,
    loadCatalogItems,
    handleSearchChange,
    handleCreateCatalogItem,
    handleExportReport,
    handleAddProducts,
    handleEditCatalogItem,
    openSuppliersModal,
    closeSuppliersModal,
  } = useCatalogManagementPage();

  const { mode } = useThemeMode();
  const theme = themeTokens[mode] || themeTokens.light;
  const actionColors = theme.colors;

  const columns = useMemo(
    () =>
      getCatalogManagementColumns({
        actionColors,
        onOpenSuppliers: openSuppliersModal,
        onAddProducts: handleAddProducts,
        onEditCatalogItem: handleEditCatalogItem,
        CatalogStatusPill,
        SuppliersViewButton,
        CatalogActionIconButton,
        RowActions,
      }),
    [actionColors, handleAddProducts, handleEditCatalogItem, openSuppliersModal]
  );

  const pageHeader = useMemo(
    () => ({
      title: "Administración de Catálogo",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: "Administración de Catálogo" },
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
    >
      <HeaderSection>
        <HeaderImage
          imageHeader={imgPeople}
          titleHeader="¡Empieza a agregar tus productos!"
          bannerIcon=""
          backgroundIconColor=""
          bannerInformation=""
          backgroundInformationColor=""
        />
      </HeaderSection>

      <ContentSection>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <StyledDivider />
          </Col>

          <Col span={24}>
            <ToolbarCard bordered>
              <Row gutter={[12, 12]} align="middle" justify="space-between">
                <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
                  <CatalogSearchInput value={searchQuery} onChange={handleSearchChange} />
                </Col>

                <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
                  <ActionsSpace>
                    <CreateCatalogItemButton onClick={handleCreateCatalogItem} />
                    <ExportCatalogReportButton onClick={handleExportReport} />
                  </ActionsSpace>
                </Col>
              </Row>

              <ToolbarDivider />
            </ToolbarCard>
          </Col>

          <Col span={24}>
            <SmartTableCard bordered>
              <SmartTable
                rowKey="id"
                dataSource={rows}
                columns={columns}
                loading={loading}
                total={rows.length}
                reload={loadCatalogItems}
                download={{
                  enable: true,
                  fileName: "convocatorias",
                  headers: [
                    { label: "ID", key: "id" },
                    { label: "FECHA", key: "date" },
                    { label: "NOMBRE CONVOCATORIA", key: "name" },
                    { label: "PLANES PRODUCTIVOS", key: "plansLabel" },
                    { label: "ESTADO", key: "status" },
                    { label: "N° PROVEEDORES", key: "n_suppliers" },
                  ],
                }}
                toolbarExtensions={[
                  <ExportCatalogReportButton key="toolbar-export" onClick={handleExportReport} />,
                ]}
                showPagination
                pageSizeOptions={["10", "20", "50", "100"]}
                defaultPageSize="10"
                enableRowSelection={false}
                showToolbar
                showTableResize={false}
                showColumnSettings={false}
                dangerRowCondition={isCatalogItemClosed}
                successRowCondition={isCatalogItemOpen}
                scroll={{ x: "max-content" }}
              />
            </SmartTableCard>
          </Col>
        </Row>
      </ContentSection>

      <CatalogSuppliersModal
        isOpen={showSuppliersModal}
        onClose={closeSuppliersModal}
        dataSource={suppliersModalData}
      />
    </Page>
  );
};
