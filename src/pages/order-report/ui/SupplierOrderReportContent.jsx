import { SearchOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Col, Row } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppSearchInput } from "../../../shared/ui/search-input";
import { SmartTable } from "../../../shared/ui/smart-table";
import { AppTabs } from "../../../shared/ui/tabs";
import { getOrderCancellationRequestColumns } from "../model/getOrderCancellationRequestColumns";
import { getOrderReportColumns } from "../model/getOrderReportColumns";
import { useOrderReportPage } from "../model/useOrderReportPage";
import { OrderReportDeleteModal } from "./OrderReportDeleteModal";
import { OrderRequestCancelModal } from "./OrderRequestCancelModal";
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
    orderSearchError,
    orderSearchValue,
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
    handleOrderFiltersSearch,
    handleOrderSearchValueChange,
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

  const orderSearchExtension = useMemo(
    () => [
      <Row key="supplier-order-search" gutter={[12, 12]} style={{ width: "100%" }}>
        <Col xs={24} sm={24} md={18} lg={8} xl={8} xxl={8}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={16} md={16} lg={17} xl={17} xxl={17}>
              <AppSearchInput
                placeholder="Buscar por cedula/CUB/orden"
                value={orderSearchValue}
                onChange={handleOrderSearchValueChange}
                onPressEnter={handleOrderFiltersSearch}
                disabled={loading}
                status={orderSearchError ? "error" : undefined}
              />
            </Col>
            <Col xs={24} sm={8} md={8} lg={7} xl={7} xxl={7}>
              <AppButton
                icon={<SearchOutlined />}
                onClick={handleOrderFiltersSearch}
                loading={loading}
                style={{ width: "100%" }}
              >
                Buscar
              </AppButton>
            </Col>
          </Row>
        </Col>
      </Row>,
    ],
    [
      handleOrderFiltersSearch,
      handleOrderSearchValueChange,
      loading,
      orderSearchError,
      orderSearchValue,
    ]
  );

  const orderPurchaseContent = (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <StyledDivider />
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
            toolbarExtensions={orderSearchExtension}
            toolbarExtensionsPosition="left"
            reloadPosition="left"
            showReload={false}
            download={{ enable: false }}
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
            reloadPosition="left"
            showReload={false}
            download={{ enable: false }}
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
