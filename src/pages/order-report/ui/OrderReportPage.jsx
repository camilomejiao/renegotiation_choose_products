import { useMemo } from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { Loading } from "../../../components/layout/shared/loading/Loading";
import { Page } from "../../../shared/ui/page";
import { SmartTable } from "../../../shared/ui/smart-table";
import { getOrderReportColumns } from "../model/getOrderReportColumns";
import { useOrderReportPage } from "../model/useOrderReportPage";
import { OrderReportDeleteModal } from "./OrderReportDeleteModal";
import { OrderReportToolbar } from "./OrderReportToolbar";
import {
  ContentSection,
  HeaderSection,
  StyledDivider,
  TableCard,
} from "./OrderReportPage.styles";

export const OrderReportPage = () => {
  const {
    rows,
    total,
    loading,
    loadingText,
    searchQuery,
    page,
    pageSize,
    selectedOrder,
    isDeleteModalOpen,
    loadOrders,
    handleSearchQueryChange,
    handleSearch,
    handleClearSearch,
    handlePageChange,
    handleDeleteRequest,
    handleDeleteConfirm,
    closeDeleteModal,
  } = useOrderReportPage();

  const columns = useMemo(
    () => getOrderReportColumns({ onDelete: handleDeleteRequest }),
    [handleDeleteRequest]
  );

  const pageHeader = useMemo(
    () => ({
      title: "Órdenes de Compra",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: "Órdenes de Compra" },
      ],
    }),
    []
  );

  return (
    <Page showPageHeader header={pageHeader} contentPadding="0" minHeight="auto">
      <HeaderSection>
        <HeaderImage imageHeader={imgPeople} titleHeader="¡Órdenes de compra!" />
      </HeaderSection>

      <ContentSection>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <StyledDivider />
          </Col>

          <Col span={24}>
            <OrderReportToolbar
              loading={loading}
              onClear={handleClearSearch}
              onSearch={handleSearch}
              onSearchQueryChange={handleSearchQueryChange}
              searchQuery={searchQuery}
            />
          </Col>

          <Col span={24}>
            <TableCard bordered>
              <SmartTable
                rowKey="id"
                columns={columns}
                dataSource={rows}
                loading={loading}
                total={total}
                currentPage={page}
                onPageChange={handlePageChange}
                reload={loadOrders}
                showPagination
                pageSizeOptions={["10", "25", "50", "100"]}
                defaultPageSize={String(pageSize)}
                enableRowSelection={false}
                showToolbar
                showColumnSettings={false}
                showTableResize={false}
                scroll={{ x: "max-content" }}
              />
            </TableCard>
          </Col>
        </Row>
      </ContentSection>

      {loading && <Loading fullScreen text={loadingText} />}

      <OrderReportDeleteModal
        open={isDeleteModalOpen}
        orderId={selectedOrder?.id}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </Page>
  );
};
