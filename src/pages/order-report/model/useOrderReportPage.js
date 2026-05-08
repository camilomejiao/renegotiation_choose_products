import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { normalizeParameterOptions } from "../../../entities/parameter";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import {
  cancelOrderCancellationRequest,
  createOrderCancellationRequest,
  getOrderCancellationRequestsPage,
  getOrderRequestFilterCatalog,
  getOrderReportPage,
} from "../api/orderReportApi";
import {
  DEFAULT_ORDER_SEARCH_OPTION,
  getOrderSearchError,
  normalizeOrderSearchValue,
  ORDER_SEARCH_DEBOUNCE_MS,
  ORDER_SEARCH_OPTIONS,
} from "./orderSearch";
import { normalizeOrderCancellationRequestRows } from "./normalizeOrderCancellationRequestRows";
import { normalizeOrderReportRows } from "./normalizeOrderReportRows";
import { ORDER_REQUEST_FILTER_PARAMETER_IDS } from "./requestFilterConfig";

const PAGE_SIZE = 100;
const REQUESTS_EMPTY_TEXT = "No hay solicitudes registradas para mostrar.";
const REQUESTS_ERROR_TEXT = "No fue posible obtener las solicitudes.";
const DELETE_MODAL_INITIAL_VIEW = "legal";
const ORDER_CANCELLATION_REQUEST_TYPE = 5215;
const REQUEST_CANCEL_MODAL_INITIAL_VIEW = "form";
const REQUEST_CANCEL_STATUS = "CANCELADO";
const DELETE_FORBIDDEN_FALLBACK_MESSAGE = "tiene dependencias asociadas";

const getDeleteForbiddenMessage = (response) => {
  const responseData = response?.data;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message.trim();
  }

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData.trim();
  }

  return DELETE_FORBIDDEN_FALLBACK_MESSAGE;
};

export const useOrderReportPage = () => {
  const hasLoadedRequestFiltersRef = useRef(false);
  const lastOrderSearchValueRef = useRef("");
  const lastRequestSearchValueRef = useRef("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [requestsRows, setRequestsRows] = useState([]);
  const [requestsTotal, setRequestsTotal] = useState(0);
  const [requestsEmptyText, setRequestsEmptyText] = useState(REQUESTS_EMPTY_TEXT);
  const [loadingMode, setLoadingMode] = useState(null);
  const [requestTypeOptions, setRequestTypeOptions] = useState([]);
  const [requestStatusOptions, setRequestStatusOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [requestPage, setRequestPage] = useState(1);
  const [requestPageSize, setRequestPageSize] = useState(PAGE_SIZE);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [selectedRequestStatus, setSelectedRequestStatus] = useState(null);
  const [appliedRequestType, setAppliedRequestType] = useState(null);
  const [appliedRequestStatus, setAppliedRequestStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [hasReadDeleteLegalText, setHasReadDeleteLegalText] = useState(false);
  const [deleteModalView, setDeleteModalView] = useState(
    DELETE_MODAL_INITIAL_VIEW
  );
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRequestCancelModalOpen, setIsRequestCancelModalOpen] = useState(false);
  const [requestCancelObservation, setRequestCancelObservation] = useState("");
  const [requestCancelModalView, setRequestCancelModalView] = useState(
    REQUEST_CANCEL_MODAL_INITIAL_VIEW
  );
  const [requestCancelErrorMessage, setRequestCancelErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("purchase-orders");

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
    if (loadingMode === "submit-request" || loadingMode === "cancel-request") {
      return false;
    }

    if (activeTab === "purchase-orders") {
      return loadingMode === "orders";
    }

    return loadingMode === "requests" || loadingMode === "request-filters";
  }, [activeTab, loadingMode]);

  const submitting = loadingMode === "submit-request";
  const cancelSubmitting = loadingMode === "cancel-request";

  const loadingText = useMemo(() => {
    if (loadingMode === "submit-request") {
      return "Registrando solicitud de anulación...";
    }

    if (loadingMode === "cancel-request") {
      return "Actualizando solicitud...";
    }

    if (loadingMode === "requests") {
      return "Cargando solicitudes...";
    }

    return "Cargando órdenes...";
  }, [loadingMode]);

  const loadOrders = useCallback(async () => {
    try {
      setLoadingMode("orders");
      const data = await getOrderReportPage({
        page,
        pageSize,
        searchField: appliedOrderSearchAttribute,
        searchValue: appliedOrderSearchValue,
      });

      setRows(normalizeOrderReportRows(data?.results));
      setTotal(Number(data?.count) || 0);
    } catch (response) {
      console.error("Error obteniendo las órdenes de compra:", response);
      setRows([]);
      setTotal(0);
      AlertComponent.error("Error", "No fue posible obtener las órdenes de compra");
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "orders" ? null : currentMode
      );
    }
  }, [appliedOrderSearchAttribute, appliedOrderSearchValue, page, pageSize]);

  const loadRequestFilterOptions = useCallback(async () => {
    const requestTypeParameterId =
      ORDER_REQUEST_FILTER_PARAMETER_IDS.requestType;
    const requestStatusParameterId =
      ORDER_REQUEST_FILTER_PARAMETER_IDS.requestStatus;

    try {
      setLoadingMode("request-filters");

      const [requestTypeRows, requestStatusRows] = await Promise.all([
        requestTypeParameterId
          ? getOrderRequestFilterCatalog(requestTypeParameterId)
          : Promise.resolve([]),
        requestStatusParameterId
          ? getOrderRequestFilterCatalog(requestStatusParameterId)
          : Promise.resolve([]),
      ]);

      setRequestTypeOptions(normalizeParameterOptions(requestTypeRows));
      setRequestStatusOptions(normalizeParameterOptions(requestStatusRows));
    } catch (response) {
      console.error("Error obteniendo catálogos de solicitudes:", response);
      setRequestTypeOptions([]);
      setRequestStatusOptions([]);
      AlertComponent.error(
        "Error",
        "No fue posible cargar los filtros de solicitudes"
      );
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "request-filters" ? null : currentMode
      );
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      setLoadingMode("requests");
      setRequestsEmptyText(REQUESTS_EMPTY_TEXT);
      const data = await getOrderCancellationRequestsPage({
        page: requestPage,
        pageSize: requestPageSize,
        requestType: appliedRequestType?.value || "",
        requestStatus: appliedRequestStatus?.value || "",
        searchField: appliedRequestSearchAttribute,
        searchValue: appliedRequestSearchValue,
      });

      const requestRows = data?.records ?? data?.results ?? [];
      const normalizedRows = normalizeOrderCancellationRequestRows(requestRows);
      setRequestsRows(normalizedRows);
      setRequestsTotal(Number(data?.count) || normalizedRows.length);
    } catch (response) {
      console.error("Error obteniendo las solicitudes:", response);
      setRequestsRows([]);
      setRequestsTotal(0);
      setRequestsEmptyText(REQUESTS_ERROR_TEXT);
    } finally {
      setLoadingMode((currentMode) =>
        currentMode === "requests" ? null : currentMode
      );
    }
  }, [
    appliedRequestSearchAttribute,
    appliedRequestSearchValue,
    appliedRequestStatus,
    appliedRequestType,
    requestPage,
    requestPageSize,
  ]);

  useEffect(() => {
    if (activeTab !== "purchase-orders") {
      return;
    }

    loadOrders();
  }, [activeTab, loadOrders]);

  useEffect(() => {
    if (activeTab !== "requests" || hasLoadedRequestFiltersRef.current) {
      return;
    }

    hasLoadedRequestFiltersRef.current = true;
    loadRequestFilterOptions();
  }, [activeTab, loadRequestFilterOptions]);

  useEffect(() => {
    if (activeTab !== "requests") {
      return;
    }

    loadRequests();
  }, [activeTab, loadRequests]);

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
      if (page !== 1) {
        setPage(1);
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
      setPage(1);
      setAppliedOrderSearchAttribute(nextField);
      setAppliedOrderSearchValue(normalizedValue);
    }, ORDER_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    activeTab,
    appliedOrderSearchAttribute,
    appliedOrderSearchValue,
    orderSearchValue,
    page,
    selectedOrderSearchAttribute,
  ]);

  useEffect(() => {
    if (activeTab !== "requests") {
      return;
    }

    const nextField =
      selectedRequestSearchAttribute?.value || DEFAULT_ORDER_SEARCH_OPTION.value;
    const normalizedValue = normalizeOrderSearchValue(requestSearchValue);
    const nextError = getOrderSearchError(
      { field: nextField, value: normalizedValue },
      { allowEmpty: true }
    );
    const didSearchValueChange =
      lastRequestSearchValueRef.current !== requestSearchValue;

    setRequestSearchError(nextError || "");
    lastRequestSearchValueRef.current = requestSearchValue;

    if (!didSearchValueChange) {
      return;
    }

    if (!normalizedValue || nextError) {
      if (requestPage !== 1) {
        setRequestPage(1);
      }

      if (appliedRequestSearchAttribute !== nextField) {
        setAppliedRequestSearchAttribute(nextField);
      }

      if (appliedRequestSearchValue !== "") {
        setAppliedRequestSearchValue("");
      }

      return;
    }

    const timer = window.setTimeout(() => {
      setRequestPage(1);
      setAppliedRequestSearchAttribute(nextField);
      setAppliedRequestSearchValue(normalizedValue);
    }, ORDER_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    activeTab,
    appliedRequestSearchAttribute,
    appliedRequestSearchValue,
    requestPage,
    requestSearchValue,
    selectedRequestSearchAttribute,
  ]);

  const resetDeleteFlow = useCallback(() => {
    setCancellationReason("");
    setHasReadDeleteLegalText(false);
    setDeleteModalView(DELETE_MODAL_INITIAL_VIEW);
    setDeleteErrorMessage("");
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    resetDeleteFlow();
  }, [resetDeleteFlow]);

  const resetRequestCancelFlow = useCallback(() => {
    setRequestCancelObservation("");
    setRequestCancelModalView(REQUEST_CANCEL_MODAL_INITIAL_VIEW);
    setRequestCancelErrorMessage("");
  }, []);

  const closeRequestCancelModal = useCallback(() => {
    setIsRequestCancelModalOpen(false);
    setSelectedRequest(null);
    resetRequestCancelFlow();
  }, [resetRequestCancelFlow]);

  const handlePageChange = useCallback((nextPage, nextPageSize) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  }, []);

  const handleRequestPageChange = useCallback((nextPage, nextPageSize) => {
    setRequestPage(nextPage);
    setRequestPageSize(nextPageSize);
  }, []);

  const handleDeleteRequest = useCallback(
    (order) => {
      setSelectedOrder(order);
      setIsDeleteModalOpen(true);
      resetDeleteFlow();
    },
    [resetDeleteFlow]
  );

  const handleCancellationReasonChange = useCallback((value) => {
    setCancellationReason(value);
    setDeleteModalView(DELETE_MODAL_INITIAL_VIEW);
    setDeleteErrorMessage("");
  }, []);

  const handleDeleteLegalTextRead = useCallback(() => {
    setHasReadDeleteLegalText(true);
    setDeleteModalView(DELETE_MODAL_INITIAL_VIEW);
    setDeleteErrorMessage("");
  }, []);

  const handleDeleteContinue = useCallback(() => {
    const normalizedReason = cancellationReason.trim();

    if (!normalizedReason) {
      AlertComponent.error(
        "Error",
        "Debes ingresar un motivo de anulación para continuar"
      );
      return;
    }

    if (!hasReadDeleteLegalText) {
      AlertComponent.error(
        "Error",
        "Debes leer el texto jurídico para continuar"
      );
      return;
    }

    setDeleteErrorMessage("");
    setDeleteModalView("confirm");
  }, [cancellationReason, hasReadDeleteLegalText]);

  const handleDeleteConfirmationCancel = useCallback(() => {
    setDeleteModalView(DELETE_MODAL_INITIAL_VIEW);
    setDeleteErrorMessage("");
  }, []);

  const handleRequestCancelObservationChange = useCallback((value) => {
    setRequestCancelObservation(value);
    setRequestCancelModalView(REQUEST_CANCEL_MODAL_INITIAL_VIEW);
    setRequestCancelErrorMessage("");
  }, []);

  const handleRequestCancelContinue = useCallback(() => {
    if (!requestCancelObservation.trim()) {
      AlertComponent.error(
        "Error",
        "Debes ingresar una observación para continuar"
      );
      return;
    }

    setRequestCancelErrorMessage("");
    setRequestCancelModalView("confirm");
  }, [requestCancelObservation]);

  const handleRequestCancelReturn = useCallback(() => {
    setRequestCancelModalView(REQUEST_CANCEL_MODAL_INITIAL_VIEW);
    setRequestCancelErrorMessage("");
  }, []);

  const handleRequestTypeChange = useCallback((option) => {
    setSelectedRequestType(option);
  }, []);

  const handleRequestStatusChange = useCallback((option) => {
    setSelectedRequestStatus(option);
  }, []);

  const handleOrderSearchAttributeChange = useCallback((option) => {
    setSelectedOrderSearchAttribute(option);
    setOrderSearchValue("");
  }, []);

  const handleRequestSearchAttributeChange = useCallback((option) => {
    setSelectedRequestSearchAttribute(option);
    setRequestSearchValue("");
  }, []);

  const handleRequestFiltersSearch = useCallback(() => {
    setRequestPage(1);
    setAppliedRequestType(selectedRequestType);
    setAppliedRequestStatus(selectedRequestStatus);
  }, [selectedRequestStatus, selectedRequestType]);

  const handleRequestFiltersClear = useCallback(() => {
    setSelectedRequestType(null);
    setSelectedRequestStatus(null);
    setAppliedRequestType(null);
    setAppliedRequestStatus(null);
    setRequestPage(1);
    setRequestPageSize(PAGE_SIZE);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedOrder?.id) {
      closeDeleteModal();
      return;
    }

    const normalizedReason = cancellationReason.trim();

    if (!normalizedReason) {
      AlertComponent.error(
        "Error",
        "Debes ingresar un motivo de anulación para continuar"
      );
      return;
    }

    if (!hasReadDeleteLegalText) {
      AlertComponent.error(
        "Error",
        "Debes leer el texto jurídico para continuar"
      );
      return;
    }

    try {
      setLoadingMode("submit-request");
      setDeleteErrorMessage("");
      setDeleteModalView("processing");
      const response = await createOrderCancellationRequest({
        order_id: String(selectedOrder.id),
        tipo_solicitud: ORDER_CANCELLATION_REQUEST_TYPE,
        observacion: normalizedReason,
      });

      if (
        response?.status === ResponseStatusEnum.OK ||
        response?.status === ResponseStatusEnum.CREATED ||
        response?.status === ResponseStatusEnum.NO_CONTENT
      ) {
        setActiveTab("requests");
        setRows((currentRows) =>
          currentRows.filter((row) => row.id !== selectedOrder.id)
        );
        setTotal((currentTotal) => Math.max(currentTotal - 1, 0));
        setRequestPage(1);
        setDeleteModalView("success");

        const isLastItemOnPage = rows.length === 1 && page > 1;
        if (isLastItemOnPage) {
          setPage((currentPage) => currentPage - 1);
          return;
        }

        return;
      }

      if (response?.status === ResponseStatusEnum.FORBIDDEN) {
        setDeleteErrorMessage(
          `No se puede anular la orden de compra porque ${getDeleteForbiddenMessage(
            response
          )}`
        );
        setDeleteModalView("error");
      }
    } catch (response) {
      console.error("Error al eliminar la orden:", response);
      setDeleteErrorMessage("No se pudo registrar la solicitud de anulación.");
      setDeleteModalView("error");
    } finally {
      setLoadingMode(null);
    }
  }, [
    cancellationReason,
    closeDeleteModal,
    hasReadDeleteLegalText,
    page,
    rows.length,
    selectedOrder,
  ]);

  const handleCancelRequest = useCallback(
    (request) => {
      setSelectedRequest(request);
      setIsRequestCancelModalOpen(true);
      resetRequestCancelFlow();
    },
    [resetRequestCancelFlow]
  );

  const handleRequestCancelConfirm = useCallback(async () => {
    if (!selectedRequest?.id) {
      closeRequestCancelModal();
      return;
    }

    const normalizedObservation = requestCancelObservation.trim();

    if (!normalizedObservation) {
      AlertComponent.error(
        "Error",
        "Debes ingresar una observación para continuar"
      );
      return;
    }

    try {
      setLoadingMode("cancel-request");
      setRequestCancelErrorMessage("");
      setRequestCancelModalView("processing");
      const response = await cancelOrderCancellationRequest({
        solicitud_id: String(selectedRequest.id),
        observacion: normalizedObservation,
        nuevo_estado: REQUEST_CANCEL_STATUS,
      });

      if (
        response?.status === ResponseStatusEnum.OK ||
        response?.status === ResponseStatusEnum.NO_CONTENT
      ) {
        setRequestsRows((currentRows) =>
          currentRows.map((row) =>
            row.id === selectedRequest.id
              ? {
                  ...row,
                  status: "Cancelado",
                  observation: normalizedObservation,
                  canCancel: false,
                }
              : row
          )
        );
        setRequestCancelModalView("success");
        return;
      }
    } catch (response) {
      console.error("Error cancelando la solicitud:", response);
      setRequestCancelErrorMessage("No se pudo cancelar la solicitud.");
      setRequestCancelModalView("error");
    } finally {
      setLoadingMode(null);
    }
  }, [
    closeRequestCancelModal,
    requestCancelObservation,
    selectedRequest,
  ]);

  return {
    activeTab,
    cancellationReason,
    deleteErrorMessage,
    deleteModalView,
    hasReadDeleteLegalText,
    isRequestCancelModalOpen,
    isDeleteModalOpen,
    loading,
    loadingText,
    cancelSubmitting,
    submitting,
    page,
    pageSize,
    requestPage,
    requestPageSize,
    requestCancelErrorMessage,
    requestCancelModalView,
    requestCancelObservation,
    requestSearchError,
    requestSearchOptions: ORDER_SEARCH_OPTIONS,
    requestSearchValue,
    requestStatusOptions,
    requestTypeOptions,
    requestsEmptyText,
    requestsRows,
    requestsTotal,
    rows,
    orderSearchError,
    orderSearchOptions: ORDER_SEARCH_OPTIONS,
    orderSearchValue,
    selectedOrder,
    selectedOrderSearchAttribute,
    selectedRequest,
    selectedRequestSearchAttribute,
    selectedRequestStatus,
    selectedRequestType,
    total,
    closeDeleteModal,
    closeRequestCancelModal,
    handleActiveTabChange: setActiveTab,
    handleCancellationReasonChange,
    handleDeleteConfirmationCancel,
    handleDeleteConfirm,
    handleDeleteContinue,
    handleDeleteLegalTextRead,
    handleDeleteRequest,
    handleOrderSearchAttributeChange,
    handleOrderSearchValueChange: (event) =>
      setOrderSearchValue(event.target.value),
    handlePageChange,
    handleRequestCancelConfirm,
    handleRequestCancelContinue,
    handleRequestCancelObservationChange,
    handleRequestCancelReturn,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange,
    handleRequestSearchAttributeChange,
    handleRequestSearchValueChange: (event) =>
      setRequestSearchValue(event.target.value),
    handleRequestStatusChange,
    handleRequestTypeChange,
    handleCancelRequest,
    loadOrders,
    loadRequests,
  };
};
