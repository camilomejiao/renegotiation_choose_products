import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { normalizeParameterOptions } from "../../../entities/parameter";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import {
  getDepartmentCatalog,
  getLeaderSupplierCatalog,
  getMunicipalityCatalog,
  getOrderCancellationRequestsPage,
  getOrderReportPage,
  getOrderRequestFilterCatalog,
} from "../api/orderReportApi";
import { getOrderRequestPreviewTimestamp } from "./utils";
import { normalizeLeaderOrderRequestRows } from "./normalizeLeaderOrderRequestRows";
import { normalizeLeaderOrderRows } from "./normalizeLeaderOrderRows";
import { ORDER_REQUEST_FILTER_PARAMETER_IDS } from "./requestFilterConfig";

const PAGE_SIZE = 100;

export const useLeaderOrderReportPage = ({ userAuth }) => {
  const hasLoadedRequestFiltersRef = useRef(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [loadingMode, setLoadingMode] = useState(null);

  const [requestRows, setRequestRows] = useState([]);
  const [requestTotal, setRequestTotal] = useState(0);
  const [requestPage, setRequestPage] = useState(1);
  const [requestPageSize, setRequestPageSize] = useState(PAGE_SIZE);

  const [orderRows, setOrderRows] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(PAGE_SIZE);

  const [requestTypeOptions, setRequestTypeOptions] = useState([]);
  const [requestStatusOptions, setRequestStatusOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);

  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [selectedRequestStatus, setSelectedRequestStatus] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);

  const [appliedRequestType, setAppliedRequestType] = useState(null);
  const [appliedRequestStatus, setAppliedRequestStatus] = useState(null);
  const [appliedSupplier, setAppliedSupplier] = useState(null);
  const [appliedDepartment, setAppliedDepartment] = useState(null);
  const [appliedMunicipality, setAppliedMunicipality] = useState(null);

  const [managedRequest, setManagedRequest] = useState(null);
  const [viewRequest, setViewRequest] = useState(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState("approve");
  const [approvalComment, setApprovalComment] = useState("");

  const loading = useMemo(() => {
    if (loadingMode === "submit-approval") {
      return false;
    }

    if (activeTab === "requests") {
      return loadingMode === "requests" || loadingMode === "filters";
    }

    return loadingMode === "orders";
  }, [activeTab, loadingMode]);

  const submitting = loadingMode === "submit-approval";

  const loadingText = useMemo(() => {
    if (loadingMode === "submit-approval") {
      return "Gestionando solicitud...";
    }

    if (loadingMode === "filters") {
      return "Cargando filtros...";
    }

    if (loadingMode === "requests") {
      return "Cargando solicitudes...";
    }

    return "Cargando órdenes...";
  }, [loadingMode]);

  const loadLeaderFilterOptions = useCallback(async () => {
    try {
      setLoadingMode("filters");

      const [requestTypeRows, requestStatusRows, supplierRows, departmentRows] =
        await Promise.all([
          ORDER_REQUEST_FILTER_PARAMETER_IDS.requestType
            ? getOrderRequestFilterCatalog(
                ORDER_REQUEST_FILTER_PARAMETER_IDS.requestType
              )
            : Promise.resolve([]),
          ORDER_REQUEST_FILTER_PARAMETER_IDS.requestStatus
            ? getOrderRequestFilterCatalog(
                ORDER_REQUEST_FILTER_PARAMETER_IDS.requestStatus
              )
            : Promise.resolve([]),
          getLeaderSupplierCatalog(),
          getDepartmentCatalog(),
        ]);

      setRequestTypeOptions(normalizeParameterOptions(requestTypeRows));
      setRequestStatusOptions(normalizeParameterOptions(requestStatusRows));
      setSupplierOptions(normalizeParameterOptions(supplierRows));
      setDepartmentOptions(normalizeParameterOptions(departmentRows));
    } catch (response) {
      console.error("Error cargando filtros del líder:", response);
      setRequestTypeOptions([]);
      setRequestStatusOptions([]);
      setSupplierOptions([]);
      setDepartmentOptions([]);
      AlertComponent.error("Error", "No fue posible cargar los filtros");
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "filters" ? null : currentMode
      );
    }
  }, []);

  const loadMunicipalities = useCallback(async (departmentId) => {
    if (!departmentId) {
      setMunicipalityOptions([]);
      return;
    }

    try {
      setLoadingMode("filters");
      const municipalityRows = await getMunicipalityCatalog(departmentId);
      setMunicipalityOptions(normalizeParameterOptions(municipalityRows));
    } catch (response) {
      console.error("Error cargando municipios:", response);
      setMunicipalityOptions([]);
      AlertComponent.error("Error", "No fue posible cargar los municipios");
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "filters" ? null : currentMode
      );
    }
  }, []);

  const loadLeaderRequests = useCallback(async () => {
    try {
      setLoadingMode("requests");

      const data = await getOrderCancellationRequestsPage({
        page: requestPage,
        pageSize: requestPageSize,
        requestType: appliedRequestType?.value || "",
        requestStatus: appliedRequestStatus?.value || "",
        supplierId: appliedSupplier?.value || "",
        departmentId: appliedDepartment?.value || "",
        municipalityId: appliedMunicipality?.value || "",
      });

      const normalizedRows = normalizeLeaderOrderRequestRows(data?.results);
      setRequestRows(normalizedRows);
      setRequestTotal(Number(data?.count) || 0);
    } catch (response) {
      console.error("Error obteniendo solicitudes del líder:", response);
      setRequestRows([]);
      setRequestTotal(0);
      AlertComponent.error("Error", "No fue posible obtener las solicitudes");
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "requests" ? null : currentMode
      );
    }
  }, [
    appliedDepartment,
    appliedMunicipality,
    appliedRequestStatus,
    appliedRequestType,
    appliedSupplier,
    requestPage,
    requestPageSize,
  ]);

  const loadLeaderOrders = useCallback(async () => {
    try {
      setLoadingMode("orders");

      const data = await getOrderReportPage({
        page: orderPage,
        pageSize: orderPageSize,
        searchQuery: "",
      });

      const normalizedRows = normalizeLeaderOrderRows(data?.results);
      setOrderRows(normalizedRows);
      setOrderTotal(Number(data?.count) || 0);
    } catch (response) {
      console.error("Error obteniendo órdenes del líder:", response);
      setOrderRows([]);
      setOrderTotal(0);
      AlertComponent.error("Error", "No fue posible obtener las órdenes");
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "orders" ? null : currentMode
      );
    }
  }, [orderPage, orderPageSize]);

  useEffect(() => {
    if (activeTab !== "requests" || hasLoadedRequestFiltersRef.current) {
      return;
    }

    hasLoadedRequestFiltersRef.current = true;
    loadLeaderFilterOptions();
  }, [activeTab, loadLeaderFilterOptions]);

  useEffect(() => {
    if (activeTab !== "requests") {
      return;
    }

    loadLeaderRequests();
  }, [activeTab, loadLeaderRequests]);

  useEffect(() => {
    if (activeTab !== "purchase-orders") {
      return;
    }

    loadLeaderOrders();
  }, [activeTab, loadLeaderOrders]);

  const handleDepartmentChange = useCallback(
    async (option) => {
      setSelectedDepartment(option);
      setSelectedMunicipality(null);
      setAppliedMunicipality(null);
      await loadMunicipalities(option?.value);
    },
    [loadMunicipalities]
  );

  const handleRequestFiltersSearch = useCallback(() => {
    setRequestPage(1);
    setAppliedRequestType(selectedRequestType);
    setAppliedRequestStatus(selectedRequestStatus);
    setAppliedSupplier(selectedSupplier);
    setAppliedDepartment(selectedDepartment);
    setAppliedMunicipality(selectedMunicipality);
  }, [
    selectedDepartment,
    selectedMunicipality,
    selectedRequestStatus,
    selectedRequestType,
    selectedSupplier,
  ]);

  const handleRequestFiltersClear = useCallback(() => {
    setSelectedRequestType(null);
    setSelectedRequestStatus(null);
    setSelectedSupplier(null);
    setSelectedDepartment(null);
    setSelectedMunicipality(null);
    setAppliedRequestType(null);
    setAppliedRequestStatus(null);
    setAppliedSupplier(null);
    setAppliedDepartment(null);
    setAppliedMunicipality(null);
    setMunicipalityOptions([]);
    setRequestPage(1);
    setRequestPageSize(PAGE_SIZE);
  }, []);

  const handleManageRequest = useCallback((request) => {
    setManagedRequest(request);
    setApprovalAction("approve");
    setApprovalComment(request?.approvalComment || "");
    setIsApprovalModalOpen(true);
  }, []);

  const closeApprovalModal = useCallback(() => {
    setManagedRequest(null);
    setApprovalAction("approve");
    setApprovalComment("");
    setIsApprovalModalOpen(false);
  }, []);

  const handleApprovalSubmit = useCallback(async () => {
    if (!managedRequest?.id) {
      closeApprovalModal();
      return;
    }

    try {
      setLoadingMode("submit-approval");

      const nextStatus =
        approvalAction === "approve" ? "Aprobado" : "Rechazado";
      const approverName =
        userAuth?.name || userAuth?.username || "Usuario líder";
      const approvalDate = getOrderRequestPreviewTimestamp();

      setRequestRows((currentRows) =>
        currentRows.map((row) =>
          row.id === managedRequest.id
            ? {
                ...row,
                approvalStatus: nextStatus,
                approvalDate,
                approver: approverName,
                approvalComment: approvalComment.trim(),
                canManage: false,
              }
            : row
        )
      );

      AlertComponent.success(
        "Bien hecho!",
        `La solicitud fue ${
          approvalAction === "approve" ? "aprobada" : "rechazada"
        } visualmente.`
      );

      closeApprovalModal();
    } catch (response) {
      console.error("Error gestionando solicitud:", response);
      AlertComponent.error("Error", "No se pudo gestionar la solicitud");
    } finally {
      setLoadingMode(null);
    }
  }, [
    approvalAction,
    approvalComment,
    closeApprovalModal,
    managedRequest,
    userAuth?.name,
    userAuth?.username,
  ]);

  return {
    activeTab,
    approvalAction,
    approvalComment,
    departmentOptions,
    isApprovalModalOpen,
    loading,
    loadingText,
    submitting,
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
    handleActiveTabChange: setActiveTab,
    handleApprovalSubmit,
    handleDepartmentChange,
    handleManageRequest,
    handleOrderPageChange: setOrderPage,
    handleOrderPageSizeChange: setOrderPageSize,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange: (nextPage, nextPageSize) => {
      setRequestPage(nextPage);
      setRequestPageSize(nextPageSize);
    },
    handleRequestStatusChange: setSelectedRequestStatus,
    handleRequestTypeChange: setSelectedRequestType,
    handleSupplierChange: setSelectedSupplier,
    handleMunicipalityChange: setSelectedMunicipality,
    handleApprovalActionChange: setApprovalAction,
    handleApprovalCommentChange: setApprovalComment,
    handleViewRequest: setViewRequest,
    closeViewRequest: () => setViewRequest(null),
    loadLeaderOrders,
    loadLeaderRequests,
    onOrderPageChange: (nextPage, nextPageSize) => {
      setOrderPage(nextPage);
      setOrderPageSize(nextPageSize);
    },
  };
};
