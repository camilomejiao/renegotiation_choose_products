import {useMemo} from "react";
import {SaveOutlined} from "@ant-design/icons";
import {Col, Row} from "antd";
import {Link} from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import {HeaderImage} from "../../../components/layout/shared/header_image/HeaderImage";
import {AppSearchInput} from "../../../shared/ui/search-input";
import {AppSelect} from "../../../shared/ui/select";
import {Page} from "../../../shared/ui/page";
import {SmartTable} from "../../../shared/ui/smart-table";
import { ApproveDenyButton } from "../../../shared/ui/approve-deny-button";
import { ApprovalActionModal } from "../../../shared/ui/approval-action-modal";
import {getCatalogEnvironmentalColumns} from "../model/getCatalogEnvironmentalColumns";
import {useCatalogEnvironmentalValidationPage} from "../model/useCatalogEnvironmentalValidationPage";
import {
    ActionButton,
    BottomActions,
    ContentSection,
    HeaderSection,
    StyledDivider,
    TableCard,
    TableContainer,
    ToolbarCard,
    ToolbarDivider,
} from "./CatalogEnvironmentalValidationPage.styles";

export const CatalogEnvironmentalValidationPage = () => {
    const {
        loadingInitial,
        loadingPlans,
        loadingTable,
        saving,
        approving,
        convocationOptions,
        planOptions,
        selectedConvocation,
        selectedPlan,
        environmentalCategories,
        rows,
        rowCount,
        page,
        pageSize,
        searchQuery,
        showApprovalModal,
        approvalAction,
        approvalComment,
        handleSelectedConvocation,
        handleSelectedPlan,
        handleSearchChange,
        handleTablePageChange,
        handleRowSelectionChange,
        handleRowFieldChange,
        openApprovalModal,
        closeApprovalModal,
        setApprovalAction,
        setApprovalComment,
        handleApproveSubmit,
        handleSaveProducts,
        reloadProducts,
    } = useCatalogEnvironmentalValidationPage();

    const columns = useMemo(
        () =>
            getCatalogEnvironmentalColumns({
                environmentalCategories,
                onRowFieldChange: handleRowFieldChange,
            }),
        [environmentalCategories, handleRowFieldChange]
    );

    const pageHeader = useMemo(
        () => ({
            title: "Validacion Ambiental",
            breadcrumbs: [
                {title: <Link to="/admin">Inicio</Link>},
                {title: <Link to="/admin/products-enviromental">Validacion Ambiental</Link>}
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
                <HeaderImage imageHeader={imgPeople} titleHeader="Listado de productos"/>
            </HeaderSection>

            <ContentSection>
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <StyledDivider/>
                    </Col>

                    <Col span={24}>
                        <ToolbarCard bordered>
                            <Row gutter={[12, 12]}>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                                    <AppSearchInput
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                                    <AppSelect
                                        value={selectedConvocation}
                                        options={convocationOptions}
                                        placeholder="Selecciona una Jornada"
                                        onChange={handleSelectedConvocation}
                                        isLoading={loadingInitial}
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
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
                                    dataSource={rows}
                                    loading={loadingTable}
                                    total={rowCount}
                                    currentPage={page + 1}
                                    onPageChange={handleTablePageChange}
                                    showPagination
                                    pageSizeOptions={["10", "50", "100"]}
                                    defaultPageSize={String(pageSize)}
                                    enableRowSelection
                                    onRowSelectionChange={handleRowSelectionChange}
                                    showToolbar
                                    reload={reloadProducts}
                                    showColumnSettings={false}
                                    showTableResize={false}
                                    scroll={{x: "max-content"}}
                                />
                            </TableContainer>

                            <BottomActions>
                                <ApproveDenyButton
                                    onClick={openApprovalModal}
                                    loading={approving}
                                    disabled={loadingInitial || loadingPlans}
                                >
                                    Aprobar / Denegar
                                </ApproveDenyButton>

                                <ActionButton
                                    type="primary"
                                    icon={<SaveOutlined/>}
                                    onClick={handleSaveProducts}
                                    loading={saving}
                                    disabled={loadingInitial || loadingPlans}
                                >
                                    Guardar Productos
                                </ActionButton>
                            </BottomActions>
                        </TableCard>
                    </Col>
                </Row>
            </ContentSection>

            <ApprovalActionModal
                isOpen={showApprovalModal}
                action={approvalAction}
                comment={approvalComment}
                submitting={approving}
                onActionChange={setApprovalAction}
                onCommentChange={setApprovalComment}
                onCancel={closeApprovalModal}
                onConfirm={handleApproveSubmit}
            />
        </Page>
    );
};
