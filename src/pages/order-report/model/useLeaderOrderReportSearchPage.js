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
  submitLeaderOrderApprovalRequest,
} from "../api/orderReportApi";
import {
  DEFAULT_ORDER_SEARCH_OPTION,
  getOrderSearchError,
  normalizeOrderSearchValue,
  ORDER_SEARCH_DEBOUNCE_MS,
  ORDER_SEARCH_OPTIONS,
} from "./orderSearch";
import { normalizeLeaderOrderRequestRows } from "./normalizeLeaderOrderRequestRows";
import { normalizeLeaderOrderRows } from "./normalizeLeaderOrderRows";
import { ORDER_REQUEST_FILTER_PARAMETER_IDS } from "./requestFilterConfig";

const REQUEST_PAGE_SIZE = 10;
const ORDER_PAGE_SIZE = 100;
const REQUESTS_EMPTY_TEXT = "No hay solicitudes registradas para mostrar.";
const REQUESTS_ERROR_TEXT = "No fue posible obtener las solicitudes.";
const APPROVAL_ACTION_STATUS = {
  approve: 1,
  reject: 0,
};

const normalizeLeaderSupplierOptions = (rows = []) =>
  rows
    .map((row) => {
      const supplierName = String(row?.nombre ?? row?.label ?? "").trim();
      const supplierNit = String(row?.nit ?? "").trim();
      const supplierId = row?.id ?? row?.value ?? null;

      if (!supplierId || !supplierName) {
        return null;
      }

      return {
        value: supplierId,
        label: supplierNit
          ? `${supplierName} — ${supplierNit}`
          : supplierName,
        supplierName,
        nit: supplierNit,
      };
    })
    .filter(Boolean);

export const useLeaderOrderReportSearchPage = () => {
  const hasLoadedRequestFiltersRef = useRef(false);
  const hasLoadedSupplierOptionsRef = useRef(false);
  const lastOrderSearchValueRef = useRef("");
  const [activeTab, setActiveTab] = useState("requests");
  const [loadingMode, setLoadingMode] = useState(null);

  const [requestRows, setRequestRows] = useState([]);
  const [requestTotal, setRequestTotal] = useState(0);
  const [requestEmptyText, setRequestEmptyText] = useState(REQUESTS_EMPTY_TEXT);
  const [requestPage, setRequestPage] = useState(1);
  const [requestPageSize, setRequestPageSize] = useState(REQUEST_PAGE_SIZE);

  const [orderRows, setOrderRows] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(ORDER_PAGE_SIZE);

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

  const [selectedOrderSearchAttribute, setSelectedOrderSearchAttribute] =
    useState(DEFAULT_ORDER_SEARCH_OPTION);
  const [orderSearchValue, setOrderSearchValue] = useState("");
  const [orderSearchError, setOrderSearchError] = useState("");
  const [appliedOrderSearchAttribute, setAppliedOrderSearchAttribute] =
    useState(DEFAULT_ORDER_SEARCH_OPTION.value);
  const [appliedOrderSearchValue, setAppliedOrderSearchValue] = useState("");

  const [selectedRequestSearchAttribute, setSelectedRequestSearchAttribute] =
    useState(DEFAULT_ORDER_SEARCH_OPTION);
  const [requestSearchValue, setRequestSearchValue] = useState("");
  const [requestSearchError, setRequestSearchError] = useState("");
  const [appliedRequestSearchAttribute, setAppliedRequestSearchAttribute] =
    useState(DEFAULT_ORDER_SEARCH_OPTION.value);
  const [appliedRequestSearchValue, setAppliedRequestSearchValue] = useState("");

  const loading = useMemo(() => {
    if (loadingMode === "submit-approval") {
      return false;
    }

    if (activeTab === "requests") {
      return loadingMode === "requests" || loadingMode === "filters";
    }

    return loadingMode === "orders";
  }, [activeTab, loadingMode]);

  const requestTableLoading = loadingMode === "requests";
  const orderTableLoading = loadingMode === "orders";
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

  const loadLeaderSupplierOptions = useCallback(async () => {
    try {
      setLoadingMode("filters");

      const supplierRows = await getLeaderSupplierCatalog();
      setSupplierOptions(normalizeLeaderSupplierOptions(supplierRows));
    } catch (response) {
      console.error("Error cargando proveedores del líder:", response);
      setSupplierOptions([]);
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "filters" ? null : currentMode
      );
    }
  }, []);

  const loadLeaderFilterOptions = useCallback(async () => {
    try {
      setLoadingMode("filters");

      const [requestTypeRows, requestStatusRows, departmentRows] =
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
          getDepartmentCatalog(),
        ]);

      setRequestTypeOptions(normalizeParameterOptions(requestTypeRows));
      setRequestStatusOptions(normalizeParameterOptions(requestStatusRows));
      setDepartmentOptions(normalizeParameterOptions(departmentRows));
    } catch (response) {
      console.error("Error cargando filtros del líder:", response);
      setRequestTypeOptions([]);
      setRequestStatusOptions([]);
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
        supplierId: appliedSupplier?.value || "",
        departmentId: appliedDepartment?.value || "",
        municipalityId: appliedMunicipality?.value || "",
        searchField: appliedRequestSearchAttribute,
        searchValue: appliedRequestSearchValue,
      });

      const requestRows = data?.records ?? [];
      const normalizedRows = normalizeLeaderOrderRequestRows(requestRows);

      setRequestRows(normalizedRows);
      setRequestTotal(Number(data?.count) || normalizedRows.length);
      return normalizedRows;
    } catch (response) {
      console.error("Error obteniendo solicitudes del líder:", response);
      setRequestRows([]);
      setRequestTotal(0);
      setRequestEmptyText(REQUESTS_ERROR_TEXT);
      return null;
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "requests" ? null : currentMode
      );
    }
  }, [
    appliedDepartment,
    appliedMunicipality,
    appliedRequestSearchAttribute,
    appliedRequestSearchValue,
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
        supplierId: appliedSupplier?.value || "",
        searchField: appliedOrderSearchAttribute,
        searchValue: appliedOrderSearchValue,
      });

      const normalizedRows = normalizeLeaderOrderRows(data?.results);
      setOrderRows(normalizedRows);
      setOrderTotal(Number(data?.count) || normalizedRows.length);
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
  }, [
    appliedOrderSearchAttribute,
    appliedOrderSearchValue,
    appliedSupplier,
    orderPage,
    orderPageSize,
  ]);

  useEffect(() => {
    if (
      !["requests", "purchase-orders"].includes(activeTab) ||
      hasLoadedSupplierOptionsRef.current
    ) {
      return;
    }

    hasLoadedSupplierOptionsRef.current = true;
    loadLeaderSupplierOptions();
  }, [activeTab, loadLeaderSupplierOptions]);

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

  useEffect(() => {
    if (activeTab !== "purchase-orders") {
      return;
    }

    const nextField =
      selectedOrderSearchAttribute?.value || DEFAULT_ORDER_SEARCH_OPTION.value;
    const normalizedValue = normalizeOrderSearchValue(orderSearchValue);
    const nextError = getOrderSearchError(
      { field: nextField, value: normalizedValue },
      { allowEmpty: true }
    );
    const didSearchValueChange =
      lastOrderSearchValueRef.current !== orderSearchValue;

    setOrderSearchError(nextError || "");
    lastOrderSearchValueRef.current = orderSearchValue;

    if (!didSearchValueChange) {
      return;
    }

    if (!normalizedValue || nextError) {
      if (orderPage !== 1) {
        setOrderPage(1);
      }

      if (appliedOrderSearchAttribute !== nextField) {
        setAppliedOrderSearchAttribute(nextField);
      }

      if (appliedOrderSearchValue !== "") {
        setAppliedOrderSearchValue("");
      }

      return;
    }

    const timer = window.setTimeout(() => {
      setOrderPage(1);
      setAppliedOrderSearchAttribute(nextField);
      setAppliedOrderSearchValue(normalizedValue);
    }, ORDER_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    activeTab,
    appliedOrderSearchAttribute,
    appliedOrderSearchValue,
    orderPage,
    orderSearchValue,
    selectedOrderSearchAttribute,
  ]);

  useEffect(() => {
    if (activeTab !== "requests") {
      return;
    }

    const nextError = getOrderSearchError(
      {
        field:
          selectedRequestSearchAttribute?.value ||
          DEFAULT_ORDER_SEARCH_OPTION.value,
        value: normalizeOrderSearchValue(requestSearchValue),
      },
      { allowEmpty: true }
    );

    setRequestSearchError(nextError || "");
  }, [
    activeTab,
    requestSearchValue,
    selectedRequestSearchAttribute,
  ]);

  const runRequestSearch = useCallback(
    ({
      nextRequestType = selectedRequestType,
      nextRequestStatus = selectedRequestStatus,
      nextSupplier = selectedSupplier,
      nextDepartment = selectedDepartment,
      nextMunicipality = selectedMunicipality,
    } = {}) => {
      const nextField =
        selectedRequestSearchAttribute?.value || DEFAULT_ORDER_SEARCH_OPTION.value;
      const normalizedValue = normalizeOrderSearchValue(requestSearchValue);
      const nextError = getOrderSearchError(
        { field: nextField, value: normalizedValue },
        { allowEmpty: true }
      );

      setRequestSearchError(nextError || "");

      if (nextError) {
        return;
      }

      if (requestPage !== 1) {
        setRequestPage(1);
      }

      if (appliedRequestSearchAttribute !== nextField) {
        setAppliedRequestSearchAttribute(nextField);
      }

      if (appliedRequestType !== nextRequestType) {
        setAppliedRequestType(nextRequestType);
      }

      if (appliedRequestStatus !== nextRequestStatus) {
        setAppliedRequestStatus(nextRequestStatus);
      }

      if (appliedSupplier !== nextSupplier) {
        setAppliedSupplier(nextSupplier);
      }

      if (appliedDepartment !== nextDepartment) {
        setAppliedDepartment(nextDepartment);
      }

      if (appliedMunicipality !== nextMunicipality) {
        setAppliedMunicipality(nextMunicipality);
      }

      if (appliedRequestSearchValue !== normalizedValue) {
        setAppliedRequestSearchValue(normalizedValue);
        return;
      }

      if (
        requestPage === 1 &&
        appliedRequestType === nextRequestType &&
        appliedRequestStatus === nextRequestStatus &&
        appliedSupplier === nextSupplier &&
        appliedDepartment === nextDepartment &&
        appliedMunicipality === nextMunicipality
      ) {
        loadLeaderRequests();
      }
    },
    [
      appliedDepartment,
      appliedMunicipality,
      appliedRequestSearchAttribute,
      appliedRequestSearchValue,
      appliedRequestStatus,
      appliedRequestType,
      appliedSupplier,
      loadLeaderRequests,
      requestPage,
      requestSearchValue,
      selectedDepartment,
      selectedMunicipality,
      selectedRequestSearchAttribute,
      selectedRequestStatus,
      selectedRequestType,
      selectedSupplier,
    ]
  );

  const handleDepartmentChange = useCallback(
    async (option) => {
      setSelectedDepartment(option);
      setSelectedMunicipality(null);
      setAppliedMunicipality(null);
      await loadMunicipalities(option?.value);
      runRequestSearch({
        nextDepartment: option,
        nextMunicipality: null,
      });
    },
    [loadMunicipalities, runRequestSearch]
  );

  const handleRequestFiltersSearch = useCallback(() => {
    runRequestSearch();
  }, [
    runRequestSearch,
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
    setRequestSearchValue("");
    setRequestSearchError("");
    setAppliedRequestSearchValue("");
    setMunicipalityOptions([]);
    setRequestPage(1);
    setRequestPageSize(REQUEST_PAGE_SIZE);
  }, []);

  const handleOrderSearchAttributeChange = useCallback((option) => {
    setSelectedOrderSearchAttribute(option);
    setOrderSearchValue("");
  }, []);

  const handleRequestSearchAttributeChange = useCallback((option) => {
    setSelectedRequestSearchAttribute(option);
    setRequestSearchValue("");
  }, []);

  const handleRequestTypeChange = useCallback(
    (option) => {
      setSelectedRequestType(option);
      runRequestSearch({ nextRequestType: option });
    },
    [runRequestSearch]
  );

  const handleRequestStatusChange = useCallback(
    (option) => {
      setSelectedRequestStatus(option);
      runRequestSearch({ nextRequestStatus: option });
    },
    [runRequestSearch]
  );

  const handleSupplierChange = useCallback(
    (option) => {
      setSelectedSupplier(option);
      runRequestSearch({ nextSupplier: option });
    },
    [runRequestSearch]
  );

  const handleMunicipalityChange = useCallback(
    (option) => {
      setSelectedMunicipality(option);
      runRequestSearch({ nextMunicipality: option });
    },
    [runRequestSearch]
  );

  const handleOrderFiltersSearch = useCallback(() => {
    setOrderPage(1);
    setAppliedSupplier(selectedSupplier);
  }, [selectedSupplier]);

  const handleOrderFiltersClear = useCallback(() => {
    setSelectedSupplier(null);
    setAppliedSupplier(null);
    setOrderPage(1);
    setOrderPageSize(ORDER_PAGE_SIZE);
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
      setApprovalErrorMessage("");
      setApprovalModalView("processing");

      await submitLeaderOrderApprovalRequest({
        solicitud_id: String(managedRequest.id),
        observacion: normalizedComment,
        estado: APPROVAL_ACTION_STATUS[nextAction],
      });

      const nextStatus =
        nextAction === "approve" ? "Aprobado" : "Rechazado";
      const refreshedRows = await loadLeaderRequests();
      const refreshedManagedRequest = refreshedRows?.find(
        (row) => row.id === managedRequest.id
      );

      setManagedRequest(
        refreshedManagedRequest ?? {
          ...managedRequest,
          approvalStatus: nextStatus,
          approvalComment: normalizedComment,
          canManage: false,
        }
      );

      if (nextAction === "approve") {
        setApprovalConfirmationAction(null);
        setApprovalModalView("success");
        return;
      }

      AlertComponent.success("Bien hecho!", "La solicitud fue rechazada correctamente.");
      closeApprovalModal();
    } catch (response) {
      console.error("Error gestionando solicitud:", response);
      const errorMessage =
        response?.data?.message ||
        response?.message ||
        "No se pudo gestionar la solicitud";

      if (nextAction === "approve") {
        setApprovalConfirmationAction(null);
        setApprovalErrorMessage(errorMessage);
        setApprovalModalView("error");
      } else {
        setApprovalModalView("form");
        AlertComponent.error("Error", errorMessage);
      }
    } finally {
      setLoadingMode(null);
    }
  }, [
    approvalComment,
    closeApprovalModal,
    loadLeaderRequests,
    managedRequest,
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
    requestTableLoading,
    orderTableLoading,
    loadingText,
    submitting,
    municipalityOptions,
    orderPage,
    orderPageSize,
    orderRows,
    orderSearchError,
    orderSearchOptions: ORDER_SEARCH_OPTIONS,
    orderSearchValue,
    orderTotal,
    selectedOrderSearchAttribute,
    requestPage,
    requestPageSize,
    requestEmptyText,
    requestRows,
    requestSearchError,
    requestSearchOptions: ORDER_SEARCH_OPTIONS,
    requestSearchValue,
    requestStatusOptions,
    requestTotal,
    requestTypeOptions,
    selectedDepartment,
    selectedMunicipality,
    selectedRequestSearchAttribute,
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
    handleOrderSearchAttributeChange,
    handleOrderSearchValueChange: (event) =>
      setOrderSearchValue(event.target.value),
    handleOrderSupplierChange: setSelectedSupplier,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange: (nextPage, nextPageSize) => {
      setRequestPage(nextPage);
      setRequestPageSize(nextPageSize);
    },
    handleRequestSearchAttributeChange,
    handleRequestSearchValueChange: (event) =>
      setRequestSearchValue(event.target.value),
    handleRequestStatusChange,
    handleRequestTypeChange,
    handleSupplierChange,
    handleMunicipalityChange,
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
