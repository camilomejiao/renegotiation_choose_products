import { useMemo } from "react";
import { ArrowLeftOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Col, Row, Skeleton, Space } from "antd";
import { Link } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { AppSelect } from "../../../shared/ui/select";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { Modal } from "../../../shared/ui/modal";
import { Page } from "../../../shared/ui/page";
import { SmartTable } from "../../../shared/ui/smart-table";
import { getCatalogEditColumns } from "../model/getCatalogEditColumns";
import { useCatalogEditByConvocationPage } from "../model/useCatalogEditByConvocationPage";
import {
  ActionButton,
  ActionsSpace,
  ContentSection,
  HeaderSection,
  SaveSection,
  StyledDivider,
  TableContainer,
  TableCard,
  ToolbarCard,
  ToolbarDivider,
} from "./CatalogEditByConvocationPage.styles";

export const CatalogEditByConvocationPage = () => {
  const {
    loading,
    planOptions,
    selectedPlan,
    unitOptions,
    categoryOptions,
    rows,
    page,
    pageSize,
    rowCount,
    searchQuery,
    showDeleteModal,
    handleSelectedPlan,
    handleRowChange,
    handleDeleteClick,
    closeDeleteModal,
    confirmDelete,
    handleSave,
    handleSearchChange,
    handleCreateProducts,
    handleBack,
    handleTablePageChange,
  } = useCatalogEditByConvocationPage();

  const columns = useMemo(
    () =>
      getCatalogEditColumns({
        unitOptions,
        categoryOptions,
        onRowChange: handleRowChange,
        onDelete: handleDeleteClick,
      }),
    [
      categoryOptions,
      handleDeleteClick,
      handleRowChange,
      unitOptions,
    ]
  );

  const pageHeader = useMemo(
    () => ({
      title: "Editar Productos por Convocatoria",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: <Link to="/admin/list-products-by-convocation">Administración de Catálogo</Link> },
        { title: "Editar" },
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
        <HeaderImage imageHeader={imgPeople} titleHeader="¡Empieza a agregar tus productos!" />
      </HeaderSection>

      <ContentSection>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <StyledDivider />
          </Col>

          <Col span={24}>
            <ToolbarCard bordered>
              {loading ? (
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Skeleton.Input active block style={{ height: 44 }} />
                  </Col>
                  <Col xs={24} sm={12} lg={16}>
                    <Space>
                      <Skeleton.Button active style={{ height: 44, width: 150 }} />
                      <Skeleton.Button active style={{ height: 44, width: 160 }} />
                    </Space>
                  </Col>
                  <Col span={24}>
                    <ToolbarDivider />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Skeleton.Input active block style={{ height: 44 }} />
                  </Col>
                </Row>
              ) : (
                <>
                  <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} sm={12} lg={8}>
                      <AppSelect
                        value={selectedPlan}
                        options={planOptions}
                        placeholder="Selecciona un Plan"
                        onChange={handleSelectedPlan}
                        isLoading={loading}
                      />
                    </Col>

                    <Col xs={24} sm={12} lg={16}>
                      <ActionsSpace>
                        <ActionButton icon={<PlusOutlined />} onClick={handleCreateProducts}>
                          Crear Jornada
                        </ActionButton>
                        <ActionButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
                          Volver al listado
                        </ActionButton>
                      </ActionsSpace>
                    </Col>
                  </Row>

                  <ToolbarDivider />

                  <Row>
                    <Col xs={24} sm={12} lg={8}>
                      <AppSearchInput
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </ToolbarCard>
          </Col>

          <Col span={24}>
            <TableCard bordered>
              <TableContainer>
                {loading ? (
                  <Skeleton active paragraph={{ rows: 8 }} />
                ) : (
                  <SmartTable
                    rowKey="id"
                    columns={columns}
                    columnWidthMode="adaptive"
                    dataSource={rows}
                    loading={false}
                    total={rowCount}
                    currentPage={page + 1}
                    onPageChange={handleTablePageChange}
                    showPagination
                    pageSizeOptions={["10", "50", "100"]}
                    defaultPageSize={String(pageSize)}
                    enableRowSelection={false}
                    showToolbar={false}
                    showColumnSettings={false}
                    showTableResize={false}
                    scroll={{ x: "max-content" }}
                  />
                )}
              </TableContainer>

              <SaveSection>
                <ActionButton type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  Guardar Productos
                </ActionButton>
              </SaveSection>
            </TableCard>
          </Col>
        </Row>
      </ContentSection>

      <Modal
        isOpen={showDeleteModal}
        onCloseModal={closeDeleteModal}
        title="Confirmación de Eliminación"
        footer={
          <Space>
            <Button onClick={closeDeleteModal}>Cancelar</Button>
            <Button danger type="primary" onClick={confirmDelete}>
              Eliminar
            </Button>
          </Space>
        }
      >
        ¿Estás seguro de que deseas eliminar este elemento?
      </Modal>
    </Page>
  );
};
