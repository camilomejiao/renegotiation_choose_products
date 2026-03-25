import {useMemo} from "react";
import {Col, Row} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import {HeaderImage} from "../../../components/layout/shared/header_image/HeaderImage";
import {Page} from "../../../shared/ui/page";
import {SmartTable} from "../../../shared/ui/smart-table";
import {getProductPriceQuotesColumns} from "../model/getProductPriceQuotesColumns";
import {useProductPriceQuotesPage} from "../model/useProductPriceQuotesPage";
import {ProductPriceQuotesFilters} from "./ProductPriceQuotesFilters";
import {
    BottomActions,
    ContentSection,
    HeaderSection,
    SaveButton,
    StyledDivider,
    TableContainer,
    TableCard,
    ToolbarCard,
    ToolbarDivider,
} from "./ProductPriceQuotesPage.styles";

export const ProductPriceQuotesPage = () => {
    const {
        rows,
        planOptions,
        selectedPlan,
        onlyMine,
        searchQuery,
        loadingPlans,
        loadingTable,
        saving,
        hasSelectedPlan,
        canSave,
        handleSelectedPlan,
        handleToggleOnlyMine,
        handleSearchChange,
        handleRowChange,
        handleSave,
        refresh,
    } = useProductPriceQuotesPage();

    const columns = useMemo(() => {
        return getProductPriceQuotesColumns({onRowChange: handleRowChange});
    }, [handleRowChange]);

    const pageHeader = useMemo(
        () => ({
            title: "Cotización de catálogos",
            breadcrumbs: [
                {title: <Link to="/admin">Inicio</Link>},
                {title: "Cotización de catálogos"},
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
                        <StyledDivider/>
                    </Col>

                    <Col span={24}>
                        <ToolbarCard bordered>
                            <ProductPriceQuotesFilters
                                planOptions={planOptions}
                                selectedPlan={selectedPlan}
                                loadingPlans={loadingPlans}
                                onlyMine={onlyMine}
                                searchQuery={searchQuery}
                                hasSelectedPlan={hasSelectedPlan}
                                onPlanChange={handleSelectedPlan}
                                onOnlyMineChange={handleToggleOnlyMine}
                                onSearchChange={handleSearchChange}
                            />

                            <ToolbarDivider/>
                        </ToolbarCard>
                    </Col>

                    <Col span={24}>
                        <TableCard bordered>
                            <TableContainer>
                                <SmartTable
                                    rowKey="id"
                                    columns={columns}
                                    dataSource={rows}
                                    loading={loadingTable}
                                    total={rows.length}
                                    reload={refresh}
                                    showPagination
                                    pageSizeOptions={["10", "50", "100", "500", "1000"]}
                                    defaultPageSize="100"
                                    enableRowSelection={false}
                                    showToolbar
                                    showTableResize={false}
                                    showColumnSettings={false}
                                    scroll={{x: "max-content"}}
                                />
                            </TableContainer>

                            <BottomActions>
                                <SaveButton
                                    type="primary"
                                    icon={<SaveOutlined/>}
                                    onClick={handleSave}
                                    loading={saving}
                                    disabled={!canSave}
                                >
                                    Guardar productos
                                </SaveButton>
                            </BottomActions>
                        </TableCard>
                    </Col>
                </Row>
            </ContentSection>
        </Page>
    );
};
