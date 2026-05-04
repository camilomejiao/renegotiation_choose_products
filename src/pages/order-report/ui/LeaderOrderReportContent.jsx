import { useMemo } from "react";
import { Col, Row } from "antd";

import { SmartTable } from "../../../shared/ui/smart-table";
import { AppTabs } from "../../../shared/ui/tabs";
import { getLeaderOrderColumns } from "../model/getLeaderOrderColumns";
import { getLeaderOrderRequestColumns } from "../model/getLeaderOrderRequestColumns";
import { useLeaderOrderReportPage } from "../model/useLeaderOrderReportPage";
import { LeaderOrderApprovalModal } from "./LeaderOrderApprovalModal";
import { LeaderOrderRequestToolbar } from "./LeaderOrderRequestToolbar";
import { OrderRequestApprovalViewModal } from "./OrderRequestApprovalViewModal";
import {
  StyledDivider,
  TableCard,
} from "./OrderReportPage.styles";

export const LeaderOrderReportContent = ({ userAuth }) => {
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
    orderPage,
    orderPageSize,
    orderRows,
    orderTotal,
    requestPage,
    requestPageSize,
    requestEmptyText,
    requestRows,
    requestStatusOptions,
    requestTotal,
    requestTypeOptions,
    selectedDepartment,
    selectedMunicipality,
    selectedRequestStatus,
    selectedRequestType,
    selectedSupplier,
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
    handleRejectRequest,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange,
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
  } = useLeaderOrderReportPage({ userAuth });

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
          selectedSupplier={selectedSupplier}
          supplierOptions={supplierOptions}
          onSupplierChange={handleSupplierChange}
          selectedDepartment={selectedDepartment}
          departmentOptions={departmentOptions}
          onDepartmentChange={handleDepartmentChange}
          selectedMunicipality={selectedMunicipality}
          municipalityOptions={municipalityOptions}
          onMunicipalityChange={handleMunicipalityChange}
          onSearch={handleRequestFiltersSearch}
          onClear={handleRequestFiltersClear}
        />
      </Col>

      <Col span={24}>
        <TableCard bordered>
          <SmartTable
            rowKey="id"
            columns={requestColumns}
            dataSource={requestRows}
            loading={loading}
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
        <TableCard bordered>
          <SmartTable
            rowKey="id"
            columns={orderColumns}
            dataSource={orderRows}
            loading={loading}
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
