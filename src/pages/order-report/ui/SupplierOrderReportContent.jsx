import { useMemo } from "react";
import { Col, Row } from "antd";

import { SmartTable } from "../../../shared/ui/smart-table";
import { AppTabs } from "../../../shared/ui/tabs";
import { getOrderCancellationRequestColumns } from "../model/getOrderCancellationRequestColumns";
import { getOrderReportColumns } from "../model/getOrderReportColumns";
import { useOrderReportPage } from "../model/useOrderReportPage";
import { OrderReportDeleteModal } from "./OrderReportDeleteModal";
import { OrderRequestCancelModal } from "./OrderRequestCancelModal";
import { OrderReportToolbar } from "./OrderReportToolbar";
import { OrderRequestToolbar } from "./OrderRequestToolbar";
import {
  StyledDivider,
  TableCard,
} from "./OrderReportPage.styles";

export const SupplierOrderReportContent = () => {
  const {
    activeTab,
    cancelSubmitting,
    cancellationReason,
    deleteErrorMessage,
    deleteModalView,
    hasReadDeleteLegalText,
    isRequestCancelModalOpen,
    rows,
    total,
    requestsRows,
    requestsTotal,
    loading,
    searchQuery,
    page,
    pageSize,
    requestPage,
    requestPageSize,
    requestCancelErrorMessage,
    requestCancelModalView,
    requestCancelObservation,
    requestTypeOptions,
    requestStatusOptions,
    requestsEmptyText,
    selectedOrder,
    selectedRequest,
    selectedRequestType,
    selectedRequestStatus,
    isDeleteModalOpen,
    loadOrders,
    loadRequests,
    submitting,
    handleActiveTabChange,
    handleSearchQueryChange,
    handleSearch,
    handleClearSearch,
    handleDeleteConfirmationCancel,
    handlePageChange,
    handleRequestPageChange,
    handleDeleteContinue,
    handleDeleteLegalTextRead,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleRequestCancelConfirm,
    handleRequestCancelContinue,
    handleRequestCancelObservationChange,
    handleRequestCancelReturn,
    handleCancellationReasonChange,
    handleRequestTypeChange,
    handleRequestStatusChange,
    handleRequestFiltersSearch,
    handleRequestFiltersClear,
    handleCancelRequest,
    closeDeleteModal,
    closeRequestCancelModal,
  } = useOrderReportPage();

  const columns = useMemo(
    () => getOrderReportColumns({ onDelete: handleDeleteRequest }),
    [handleDeleteRequest]
  );

  const requestColumns = useMemo(
    () =>
      getOrderCancellationRequestColumns({
        onCancelRequest: handleCancelRequest,
      }),
    [handleCancelRequest]
  );

  const orderPurchaseContent = (
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
            defaultText="---"
            emptyText="No hay órdenes de compra registradas."
            enableRowSelection={false}
            showToolbar
            showColumnSettings={false}
            showTableResize={false}
            scroll={{ x: "max-content" }}
          />
        </TableCard>
      </Col>
    </Row>
  );

  const requestsContent = (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <StyledDivider />
      </Col>

      <Col span={24}>
        <OrderRequestToolbar
          loading={loading}
          onClear={handleRequestFiltersClear}
          onSearch={handleRequestFiltersSearch}
          onStatusChange={handleRequestStatusChange}
          onTypeChange={handleRequestTypeChange}
          requestStatus={selectedRequestStatus}
          requestStatusOptions={requestStatusOptions}
          requestType={selectedRequestType}
          requestTypeOptions={requestTypeOptions}
        />
      </Col>

      <Col span={24}>
        <TableCard bordered>
          <SmartTable
            rowKey="id"
            columns={requestColumns}
            dataSource={requestsRows}
            loading={loading}
            total={requestsTotal}
            currentPage={requestPage}
            onPageChange={handleRequestPageChange}
            reload={loadRequests}
            showPagination
            pageSizeOptions={["10", "25", "50", "100"]}
            defaultPageSize={String(requestPageSize)}
            defaultText="---"
            emptyText={requestsEmptyText}
            enableRowSelection={false}
            showToolbar
            showColumnSettings={false}
            showTableResize={false}
            scroll={{ x: "max-content" }}
          />
        </TableCard>
      </Col>
    </Row>
  );

  return (
    <>
      <AppTabs
        tabsProps={{
          activeKey: activeTab,
          defaultActiveKey: "purchase-orders",
          items: [
            {
              key: "purchase-orders",
              label: "ÓRDENES DE COMPRA",
              children: orderPurchaseContent,
            },
            {
              key: "requests",
              label: "SOLICITUDES",
              children: requestsContent,
            },
          ],
          onChange: handleActiveTabChange,
        }}
      />
      <OrderReportDeleteModal
        open={isDeleteModalOpen}
        orderId={selectedOrder?.id}
        onClose={closeDeleteModal}
        modalView={deleteModalView}
        errorMessage={deleteErrorMessage}
        onContinue={handleDeleteContinue}
        onConfirm={handleDeleteConfirm}
        onConfirmationCancel={handleDeleteConfirmationCancel}
        onLegalTextRead={handleDeleteLegalTextRead}
        onReasonChange={handleCancellationReasonChange}
        cancellationReason={cancellationReason}
        hasReadLegalText={hasReadDeleteLegalText}
        loading={submitting}
      />
      <OrderRequestCancelModal
        isOpen={isRequestCancelModalOpen}
        request={selectedRequest}
        modalView={requestCancelModalView}
        observation={requestCancelObservation}
        errorMessage={requestCancelErrorMessage}
        loading={cancelSubmitting}
        onClose={closeRequestCancelModal}
        onContinue={handleRequestCancelContinue}
        onConfirm={handleRequestCancelConfirm}
        onObservationChange={handleRequestCancelObservationChange}
        onReturn={handleRequestCancelReturn}
      />
    </>
  );
};
