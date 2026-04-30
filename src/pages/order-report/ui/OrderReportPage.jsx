import { useMemo } from "react";
import { Col, Row } from "antd";
import { Link, useOutletContext } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { ApprovalActionModal } from "../../../shared/ui/approval-action-modal";
import { Page } from "../../../shared/ui/page";
import { SmartTable } from "../../../shared/ui/smart-table";
import { AppTabs } from "../../../shared/ui/tabs";
import { getLeaderOrderColumns } from "../model/getLeaderOrderColumns";
import { getLeaderOrderRequestColumns } from "../model/getLeaderOrderRequestColumns";
import { getOrderCancellationRequestColumns } from "../model/getOrderCancellationRequestColumns";
import { getOrderReportColumns } from "../model/getOrderReportColumns";
import { useLeaderOrderReportPage } from "../model/useLeaderOrderReportPage";
import { useOrderReportPage } from "../model/useOrderReportPage";
import { LeaderOrderRequestToolbar } from "./LeaderOrderRequestToolbar";
import { OrderRequestApprovalViewModal } from "./OrderRequestApprovalViewModal";
import { OrderReportDeleteModal } from "./OrderReportDeleteModal";
import { OrderReportToolbar } from "./OrderReportToolbar";
import { OrderRequestToolbar } from "./OrderRequestToolbar";
import {
  ContentSection,
  HeaderSection,
  StyledDivider,
  TableCard,
} from "./OrderReportPage.styles";

const SupplierOrderReportContent = () => {
  const {
    activeTab,
    cancellationReason,
    deleteConfirmationChecked,
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
    requestTypeOptions,
    requestStatusOptions,
    selectedOrder,
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
    handlePageChange,
    handleRequestPageChange,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleCancellationReasonChange,
    handleDeleteConfirmationChange,
    handleRequestTypeChange,
    handleRequestStatusChange,
    handleRequestFiltersSearch,
    handleRequestFiltersClear,
    handleCancelRequest,
    closeDeleteModal,
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
            emptyText="No hay solicitudes registradas para mostrar."
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
        onConfirm={handleDeleteConfirm}
        onReasonChange={handleCancellationReasonChange}
        onConfirmationChange={handleDeleteConfirmationChange}
        cancellationReason={cancellationReason}
        confirmationChecked={deleteConfirmationChecked}
        loading={submitting}
      />
    </>
  );
};

const LeaderOrderReportContent = ({ userAuth }) => {
  const {
    activeTab,
    approvalAction,
    approvalComment,
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
    viewRequest,
    closeApprovalModal,
    submitting,
    handleActiveTabChange,
    handleApprovalSubmit,
    handleDepartmentChange,
    handleManageRequest,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange,
    handleRequestStatusChange,
    handleRequestTypeChange,
    handleSupplierChange,
    handleMunicipalityChange,
    handleApprovalActionChange,
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
            emptyText="No hay solicitudes registradas para mostrar."
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
      <ApprovalActionModal
        isOpen={isApprovalModalOpen}
        action={approvalAction}
        comment={approvalComment}
        submitting={submitting}
        onActionChange={handleApprovalActionChange}
        onCommentChange={handleApprovalCommentChange}
        onCancel={closeApprovalModal}
        onConfirm={handleApprovalSubmit}
      />

      <OrderRequestApprovalViewModal
        isOpen={Boolean(viewRequest)}
        request={viewRequest}
        onClose={closeViewRequest}
      />
    </>
  );
};

export const OrderReportPage = () => {
  const { userAuth } = useOutletContext();

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

  const isLeaderView =
    userAuth?.rol_id === RolesEnum.ADMIN ||
    userAuth?.rol_id === RolesEnum.AGRICULTURAL_LEAD ||
    userAuth?.rol_id === RolesEnum.NON_AGRICULTURAL_LEAD;

  return (
    <Page showPageHeader header={pageHeader} contentPadding="0" minHeight="auto">
      <HeaderSection>
        <HeaderImage imageHeader={imgPeople} titleHeader="¡Órdenes de compra!" />
      </HeaderSection>

      <ContentSection>
        {isLeaderView ? (
          <LeaderOrderReportContent userAuth={userAuth} />
        ) : (
          <SupplierOrderReportContent />
        )}
      </ContentSection>
    </Page>
  );
};
