import {useMemo} from "react";
import {
    ArrowLeftOutlined,
    ReloadOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {Col, Row} from "antd";
import {Link} from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import {HeaderImage} from "../../../components/layout/shared/header_image/HeaderImage";
import {AppSearchInput} from "../../../shared/ui/search-input";
import {AppSelect} from "../../../shared/ui/select";
import {Page} from "../../../shared/ui/page";
import {SmartTable} from "../../../shared/ui/smart-table";
import {getCatalogProductUploadColumns} from "../model/getCatalogProductUploadColumns";
import {useCatalogProductUploadPage} from "../model/useCatalogProductUploadPage";
import {
    ActionButton,
    ActionsSpace,
    ContentSection,
    HeaderSection,
    SaveSection,
    StyledDivider,
    TableCard,
    TableContainer,
    ToolbarCard,
    ToolbarDivider,
} from "./CatalogProductUploadPage.styles";

export const CatalogProductUploadPage = () => {
    const {
        loadingInitial,
        loadingPlans,
        loadingTable,
        saving,
        convocationOptions,
        planOptions,
        selectedConvocation,
        selectedPlan,
        rows,
        searchQuery,
        handleSelectedConvocation,
        handleSelectedPlan,
        handleRowSelectionChange,
        handleSearchChange,
        handleResetTable,
        handleBack,
        handleSaveProducts,
    } = useCatalogProductUploadPage();

    const columns = useMemo(() => getCatalogProductUploadColumns(), []);

    const pageHeader = useMemo(
        () => ({
            title: "Cargue de Productos",
            breadcrumbs: [
                {title: <Link to="/admin">Inicio</Link>},
                {title: <Link to="/admin/list-products-by-convocation">Administracion de Catalogo</Link>},
                {title: "Cargue"},
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
                <HeaderImage imageHeader={imgPeople} titleHeader="Empieza a agregar tus productos"/>
            </HeaderSection>

            <ContentSection>
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <StyledDivider/>
                    </Col>

                    <Col span={24}>
                        <ToolbarCard bordered>
                            <Row gutter={[12, 12]}>
                                <Col xs={24} sm={12} lg={6}>
                                    <AppSelect
                                        value={selectedConvocation}
                                        options={convocationOptions}
                                        placeholder="Selecciona una Jornada"
                                        onChange={handleSelectedConvocation}
                                        isLoading={loadingInitial}
                                        noOptionsMessage={() => "Sin opciones"}
                                    />
                                </Col>

                                <Col xs={24} sm={12} lg={6}>
                                    <AppSelect
                                        value={selectedPlan}
                                        options={planOptions}
                                        placeholder="Selecciona un Plan"
                                        onChange={handleSelectedPlan}
                                        isDisabled={!selectedConvocation || loadingInitial}
                                        isLoading={loadingPlans}
                                        noOptionsMessage={() =>
                                            selectedConvocation ? "Sin planes" : "Selecciona una jornada"
                                        }
                                    />
                                </Col>

                                <Col xs={24} sm={12} lg={6}>
                                    <AppSearchInput
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </Col>

                                <Col xs={24} sm={12} lg={6}>
                                    <ActionsSpace>
                                        <ActionButton icon={<ReloadOutlined/>} onClick={handleResetTable}>
                                            Reiniciar tabla
                                        </ActionButton>
                                        <ActionButton icon={<ArrowLeftOutlined/>} onClick={handleBack}>
                                            Atras
                                        </ActionButton>
                                    </ActionsSpace>
                                </Col>
                            </Row>

                            <ToolbarDivider/>
                        </ToolbarCard>
                    </Col>

                    <Col span={24}>
                        <TableCard bordered>
                            <TableContainer>
                                <SmartTable
                                    rowKey="rowKey"
                                    columns={columns}
                                    columnWidthMode="fixed"
                                    dataSource={rows}
                                    loading={loadingInitial || loadingTable}
                                    total={rows.length}
                                    showPagination
                                    pageSizeOptions={["100", "500", "1000"]}
                                    defaultPageSize="100"
                                    enableRowSelection
                                    onRowSelectionChange={handleRowSelectionChange}
                                    showToolbar={false}
                                    showColumnSettings={false}
                                    showTableResize={false}
                                    scroll={{x: "max-content"}}
                                />
                            </TableContainer>

                            <SaveSection>
                                <ActionButton
                                    type="primary"
                                    icon={<SaveOutlined/>}
                                    onClick={handleSaveProducts}
                                    loading={saving}
                                    disabled={loadingInitial || loadingPlans}
                                >
                                    Guardar Productos
                                </ActionButton>
                            </SaveSection>
                        </TableCard>
                    </Col>
                </Row>
            </ContentSection>
        </Page>
    );
};
