import { useMemo } from "react";
import { Col, Row } from "antd";

import { SmartTable } from "../../../shared/ui/smart-table";
import { AppTabs } from "../../../shared/ui/tabs";
import { getLeaderOrderColumns } from "../model/getLeaderOrderColumns";
import { getLeaderOrderRequestColumns } from "../model/getLeaderOrderRequestColumns";
import { useLeaderOrderReportSearchPage } from "../model/useLeaderOrderReportSearchPage";
import { LeaderOrderApprovalModal } from "./LeaderOrderApprovalModal";
import { LeaderOrderToolbar } from "./LeaderOrderToolbar";
import { LeaderOrderRequestToolbar } from "./LeaderOrderRequestToolbar";
import { OrderRequestApprovalViewModal } from "./OrderRequestApprovalViewModal";
import {
  StyledDivider,
  TableCard,
} from "./OrderReportPage.styles";

export const LeaderOrderReportContent = () => {
  const {
    activeTab,
    approvalComment,
    approvalConfirmationAction,
    approvalErrorMessage,
    approvalModalView,
    departmentOptions,
    isApprovalModalOpen,
    loading,
    municipalityOptions,
    orderTableLoading,
    orderPage,
    orderPageSize,
    orderRows,
    orderSearchError,
    orderSearchValue,
    orderTotal,
    requestPage,
    requestPageSize,
    requestEmptyText,
    requestTableLoading,
    requestRows,
    requestSearchError,
    requestSearchValue,
    requestStatusOptions,
    requestTotal,
    requestTypeOptions,
    selectedDepartment,
    selectedMunicipality,
    selectedOrderSupplier,
    selectedRequestSearchAttribute,
    selectedRequestStatus,
    selectedRequestType,
    selectedRequestSupplier,
    supplierOptions,
    managedRequest,
    viewRequest,
    closeApprovalModal,
    submitting,
    handleActiveTabChange,
    handleApprovalActionSelection,
    handleApprovalConfirmationCancel,
    handleApproveRequest,
    handleDepartmentChange,
    handleManageRequest,
    handleOrderFiltersClear,
    handleOrderFiltersSearch,
    handleOrderSearchValueChange,
    handleOrderSupplierChange,
    handleRejectRequest,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange,
    handleRequestSearchValueChange,
    handleRequestStatusChange,
    handleRequestTypeChange,
    handleSupplierChange,
    handleMunicipalityChange,
    handleApprovalCommentChange,
    handleViewRequest,
    closeViewRequest,
    loadLeaderOrders,
    loadLeaderRequests,
    onOrderPageChange,
  } = useLeaderOrderReportSearchPage();

  const requestColumns = useMemo(
    () =>
      getLeaderOrderRequestColumns({
        onManageRequest: handleManageRequest,
        onViewRequest: handleViewRequest,
      }),
    [handleManageRequest, handleViewRequest]
  );

  const orderColumns = useMemo(() => getLeaderOrderColumns(), []);

  const requestsContent = (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <StyledDivider />
      </Col>

      <Col span={24}>
        <LeaderOrderRequestToolbar
          loading={loading}
          requestType={selectedRequestType}
          requestTypeOptions={requestTypeOptions}
          onTypeChange={handleRequestTypeChange}
          requestStatus={selectedRequestStatus}
          requestStatusOptions={requestStatusOptions}
          onStatusChange={handleRequestStatusChange}
          selectedSupplier={selectedRequestSupplier}
          supplierOptions={supplierOptions}
          onSupplierChange={handleSupplierChange}
          selectedDepartment={selectedDepartment}
          departmentOptions={departmentOptions}
          onDepartmentChange={handleDepartmentChange}
          selectedMunicipality={selectedMunicipality}
          municipalityOptions={municipalityOptions}
          onMunicipalityChange={handleMunicipalityChange}
          onSearch={handleRequestFiltersSearch}
          onSearchValueChange={handleRequestSearchValueChange}
          onClear={handleRequestFiltersClear}
          requestSearchError={requestSearchError}
          requestSearchValue={requestSearchValue}
        />
      </Col>

      <Col span={24}>
        <TableCard bordered>
          <SmartTable
            rowKey="id"
            columns={requestColumns}
            dataSource={requestRows}
            loading={requestTableLoading}
            total={requestTotal}
            currentPage={requestPage}
            onPageChange={handleRequestPageChange}
            reload={loadLeaderRequests}
            showPagination
            pageSizeOptions={["10", "25", "50", "100"]}
            defaultPageSize={String(requestPageSize)}
            defaultText="---"
            emptyText={requestEmptyText}
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

  const ordersContent = (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <StyledDivider />
      </Col>

      <Col span={24}>
        <LeaderOrderToolbar
          loading={loading}
          orderSearchError={orderSearchError}
          orderSearchValue={orderSearchValue}
          selectedSupplier={selectedOrderSupplier}
          supplierOptions={supplierOptions}
          onSearchValueChange={handleOrderSearchValueChange}
          onSupplierChange={handleOrderSupplierChange}
          onSearch={handleOrderFiltersSearch}
          onClear={handleOrderFiltersClear}
        />
      </Col>

      <Col span={24}>
        <TableCard bordered>
          <SmartTable
            rowKey="id"
            columns={orderColumns}
            dataSource={orderRows}
            loading={orderTableLoading}
            total={orderTotal}
            currentPage={orderPage}
            onPageChange={onOrderPageChange}
            reload={loadLeaderOrders}
            showPagination
            pageSizeOptions={["10", "25", "50", "100"]}
            defaultPageSize={String(orderPageSize)}
            defaultText="---"
            emptyText="No hay órdenes de compra registradas."
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
          defaultActiveKey: "requests",
          items: [
            {
              key: "requests",
              label: "SOLICITUDES",
              children: requestsContent,
            },
            {
              key: "purchase-orders",
              label: "ÓRDENES DE COMPRA",
              children: ordersContent,
            },
          ],
          onChange: handleActiveTabChange,
        }}
      />
      <LeaderOrderApprovalModal
        isOpen={isApprovalModalOpen}
        comment={approvalComment}
        confirmationAction={approvalConfirmationAction}
        errorMessage={approvalErrorMessage}
        modalView={approvalModalView}
        request={managedRequest || undefined}
        submitting={submitting}
        onApprovalActionSelection={handleApprovalActionSelection}
        onApprovalConfirmationCancel={handleApprovalConfirmationCancel}
        onCommentChange={handleApprovalCommentChange}
        onCancel={closeApprovalModal}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      <OrderRequestApprovalViewModal
        isOpen={Boolean(viewRequest)}
        request={viewRequest}
        onClose={closeViewRequest}
      />
    </>
  );
};
