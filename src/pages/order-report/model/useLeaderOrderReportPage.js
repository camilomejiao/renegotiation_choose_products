import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { normalizeParameterOptions } from "../../../entities/parameter";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import {
  getDepartmentCatalog,
  getLeaderSupplierCatalog,
  getLeaderOrderApprovalRequestsPage,
  getMunicipalityCatalog,
  getOrderReportPage,
  getOrderRequestFilterCatalog,
} from "../api/orderReportApi";
import { getOrderRequestPreviewTimestamp } from "./utils";
import { normalizeLeaderOrderRequestRows } from "./normalizeLeaderOrderRequestRows";
import { normalizeLeaderOrderRows } from "./normalizeLeaderOrderRows";
import { ORDER_REQUEST_FILTER_PARAMETER_IDS } from "./requestFilterConfig";

const PAGE_SIZE = 100;
const REQUESTS_EMPTY_TEXT = "No hay solicitudes registradas para mostrar.";
const REQUESTS_ERROR_TEXT = "No fue posible obtener las solicitudes.";

export const useLeaderOrderReportPage = ({ userAuth }) => {
  const hasLoadedRequestFiltersRef = useRef(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [loadingMode, setLoadingMode] = useState(null);

  const [requestRows, setRequestRows] = useState([]);
  const [requestTotal, setRequestTotal] = useState(0);
  const [requestEmptyText, setRequestEmptyText] = useState(REQUESTS_EMPTY_TEXT);
  const [requestPage, setRequestPage] = useState(1);
  const [requestPageSize, setRequestPageSize] = useState(PAGE_SIZE);

  const [orderRows, setOrderRows] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(PAGE_SIZE);
  const [selectedOrderSupplier, setSelectedOrderSupplier] = useState(null);
  const [appliedOrderSupplier, setAppliedOrderSupplier] = useState(null);

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
  const [approvalComment, setApprovalComment] = useState("");
  const [approvalConfirmationAction, setApprovalConfirmationAction] =
    useState(null);
  const [approvalModalView, setApprovalModalView] = useState("form");
  const [approvalErrorMessage, setApprovalErrorMessage] = useState("");

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
      setRequestEmptyText(REQUESTS_EMPTY_TEXT);

      const data = await getLeaderOrderApprovalRequestsPage({
        page: requestPage,
        pageSize: requestPageSize,
        requestType: appliedRequestType?.value || "",
        requestStatus: appliedRequestStatus?.value || "",
        supplierName: appliedSupplier?.label || "",
        departmentName: appliedDepartment?.label || "",
        municipalityName: appliedMunicipality?.label || "",
      });

      const requestRows = data?.records ?? data?.results ?? [];
      const normalizedRows = normalizeLeaderOrderRequestRows(requestRows);

      setRequestRows(normalizedRows);
      setRequestTotal(Number(data?.count) || normalizedRows.length);
    } catch (response) {
      console.error("Error obteniendo solicitudes del líder:", response);
      setRequestRows([]);
      setRequestTotal(0);
      setRequestEmptyText(REQUESTS_ERROR_TEXT);
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
      const filteredRows = appliedOrderSupplier?.label
        ? normalizedRows.filter(
            (row) =>
              String(row?.supplier || "").trim().toLowerCase() ===
              String(appliedOrderSupplier.label).trim().toLowerCase()
          )
        : normalizedRows;

      setOrderRows(filteredRows);
      setOrderTotal(
        appliedOrderSupplier?.label
          ? filteredRows.length
          : Number(data?.count) || 0
      );
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
  }, [appliedOrderSupplier, orderPage, orderPageSize]);

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

  const handleOrderFiltersSearch = useCallback(() => {
    setOrderPage(1);
    setAppliedOrderSupplier(selectedOrderSupplier);
  }, [selectedOrderSupplier]);

  const handleOrderFiltersClear = useCallback(() => {
    setSelectedOrderSupplier(null);
    setAppliedOrderSupplier(null);
    setOrderPage(1);
    setOrderPageSize(PAGE_SIZE);
  }, []);

  const handleManageRequest = useCallback((request) => {
    setManagedRequest(request);
    setApprovalComment(request?.approvalComment || "");
    setApprovalConfirmationAction(null);
    setApprovalModalView("form");
    setApprovalErrorMessage("");
    setIsApprovalModalOpen(true);
  }, []);

  const closeApprovalModal = useCallback(() => {
    setManagedRequest(null);
    setApprovalComment("");
    setApprovalConfirmationAction(null);
    setApprovalModalView("form");
    setApprovalErrorMessage("");
    setIsApprovalModalOpen(false);
  }, []);

  const handleApprovalActionSelection = useCallback(
    (nextAction) => {
      const normalizedComment = approvalComment.trim();

      if (!normalizedComment) {
        AlertComponent.error(
          "Error",
          "La observación del líder es obligatoria"
        );
        return;
      }

      setApprovalConfirmationAction(nextAction);
    },
    [approvalComment]
  );

  const handleApprovalCommentChange = useCallback((nextComment) => {
    setApprovalComment(nextComment);
    setApprovalConfirmationAction(null);
    setApprovalModalView("form");
    setApprovalErrorMessage("");
  }, []);

  const handleApprovalSubmit = useCallback(async (nextAction) => {
    if (!managedRequest?.id) {
      closeApprovalModal();
      return;
    }

    const normalizedComment = approvalComment.trim();

    if (!normalizedComment) {
      AlertComponent.error(
        "Error",
        "La observación del líder es obligatoria"
      );
      return;
    }

    try {
      setLoadingMode("submit-approval");
      if (nextAction === "approve") {
        setApprovalErrorMessage("");
        setApprovalModalView("processing");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const nextStatus =
        nextAction === "approve" ? "Aprobado" : "Rechazado";
      const approverName =
        userAuth?.name || userAuth?.username || "Usuario líder";
      const approvalDate = getOrderRequestPreviewTimestamp();

      const nextManagedRequest = {
        ...managedRequest,
        approvalStatus: nextStatus,
        approvalDate,
        approver: approverName,
        approvalComment: normalizedComment,
        canManage: false,
      };

      setRequestRows((currentRows) =>
        currentRows.map((row) =>
          row.id === managedRequest.id
            ? {
                ...row,
                approvalStatus: nextStatus,
                approvalDate,
                approver: approverName,
                approvalComment: normalizedComment,
                canManage: false,
              }
            : row
        )
      );
      setManagedRequest(nextManagedRequest);

      if (nextAction === "approve") {
        setApprovalConfirmationAction(null);
        setApprovalModalView("success");
        return;
      }

      AlertComponent.success("Bien hecho!", "La solicitud fue rechazada visualmente.");
      closeApprovalModal();
    } catch (response) {
      console.error("Error gestionando solicitud:", response);
      if (nextAction === "approve") {
        setApprovalConfirmationAction(null);
        setApprovalErrorMessage("No se pudo aprobar la solicitud.");
        setApprovalModalView("error");
      } else {
        setApprovalModalView("form");
        AlertComponent.error("Error", "No se pudo gestionar la solicitud");
      }
    } finally {
      setLoadingMode(null);
    }
  }, [
    approvalComment,
    closeApprovalModal,
    managedRequest,
    userAuth?.name,
    userAuth?.username,
  ]);

  return {
    activeTab,
    approvalComment,
    approvalConfirmationAction,
    approvalErrorMessage,
    approvalModalView,
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
    selectedOrderSupplier,
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
    handleActiveTabChange: setActiveTab,
    handleApproveRequest: () => handleApprovalSubmit("approve"),
    handleApprovalActionSelection,
    handleApprovalConfirmationCancel: () =>
      setApprovalConfirmationAction(null),
    handleRejectRequest: () => handleApprovalSubmit("reject"),
    handleDepartmentChange,
    handleManageRequest,
    handleOrderFiltersClear,
    handleOrderFiltersSearch,
    handleOrderPageChange: setOrderPage,
    handleOrderPageSizeChange: setOrderPageSize,
    handleOrderSupplierChange: setSelectedOrderSupplier,
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
    handleApprovalCommentChange,
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
