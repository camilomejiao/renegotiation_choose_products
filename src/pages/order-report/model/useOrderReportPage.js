import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";

import { normalizeParameterOptions } from "../../../entities/parameter";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import {
  cancelOrderCancellationRequest,
  deleteOrderReportItem,
  getOrderCancellationRequestsPage,
  getOrderRequestFilterCatalog,
  getOrderReportPage,
} from "../api/orderReportApi";
import { normalizeOrderCancellationRequestRows } from "./normalizeOrderCancellationRequestRows";
import { normalizeOrderReportRows } from "./normalizeOrderReportRows";
import { ORDER_REQUEST_FILTER_PARAMETER_IDS } from "./requestFilterConfig";

const PAGE_SIZE = 100;
const MIN_SEARCH_LENGTH = 5;
const REQUESTS_EMPTY_TEXT = "No hay solicitudes registradas para mostrar.";
const REQUESTS_ERROR_TEXT = "No fue posible obtener las solicitudes.";

export const useOrderReportPage = () => {
  const hasLoadedRequestFiltersRef = useRef(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [requestsRows, setRequestsRows] = useState([]);
  const [requestsTotal, setRequestsTotal] = useState(0);
  const [requestsEmptyText, setRequestsEmptyText] = useState(REQUESTS_EMPTY_TEXT);
  const [loadingMode, setLoadingMode] = useState(null);
  const [requestTypeOptions, setRequestTypeOptions] = useState([]);
  const [requestStatusOptions, setRequestStatusOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
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
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] =
    useState(false);
  const [activeTab, setActiveTab] = useState("purchase-orders");

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
        searchQuery: appliedSearchQuery,
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
  }, [appliedSearchQuery, page, pageSize]);

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
  }, [appliedRequestStatus, appliedRequestType, requestPage, requestPageSize]);

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

  const resetDeleteFlow = useCallback(() => {
    setCancellationReason("");
    setDeleteConfirmationChecked(false);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    resetDeleteFlow();
  }, [resetDeleteFlow]);

  const handleSearchQueryChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    const normalizedQuery = searchQuery.trim();

    if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
      AlertComponent.error(
        "Error",
        `El valor a buscar debe tener al menos ${MIN_SEARCH_LENGTH} caracteres`
      );
      return;
    }

    setPage(1);
    setAppliedSearchQuery(normalizedQuery);
  }, [searchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setPage(1);
    setPageSize(PAGE_SIZE);
  }, []);

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
  }, []);

  const handleDeleteConfirmationChange = useCallback((checked) => {
    setDeleteConfirmationChecked(checked);
  }, []);

  const handleRequestTypeChange = useCallback((option) => {
    setSelectedRequestType(option);
  }, []);

  const handleRequestStatusChange = useCallback((option) => {
    setSelectedRequestStatus(option);
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

    if (!deleteConfirmationChecked) {
      AlertComponent.error(
        "Error",
        "Debes leer o aceptar el texto jurídico para continuar"
      );
      return;
    }

    const confirmationResult = await Swal.fire({
      title: "Confirmación",
      text:
        "Está a punto de enviar una solicitud de anulación de orden de compra. Una vez la solicitud sea gestionada por el equipo de Implementación, no podrá ser cancelada. ¿Desea continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "No",
      heightAuto: true,
    });

    if (!confirmationResult.isConfirmed) {
      return;
    }

    try {
      setLoadingMode("submit-request");
      const response = await deleteOrderReportItem(selectedOrder.id, {
        motivo_anulacion: normalizedReason,
      });

      if (response?.status === ResponseStatusEnum.NO_CONTENT) {
        AlertComponent.success(
          "Bien hecho!",
          "La solicitud de anulación fue registrada exitosamente"
        );
        closeDeleteModal();
        setActiveTab("requests");
        setRows((currentRows) =>
          currentRows.filter((row) => row.id !== selectedOrder.id)
        );
        setTotal((currentTotal) => Math.max(currentTotal - 1, 0));

        const isLastItemOnPage = rows.length === 1 && page > 1;
        if (isLastItemOnPage) {
          setPage((currentPage) => currentPage - 1);
          return;
        }

        setRequestPage(1);
        return;
      }

      if (response?.status === ResponseStatusEnum.FORBIDDEN) {
        AlertComponent.error(
          "Error",
          `No se puede anular la orden porque ${
            response?.data || "tiene dependencias asociadas"
          }`
        );
        closeDeleteModal();
      }
    } catch (response) {
      console.error("Error al eliminar la orden:", response);
      AlertComponent.error("Error", "No se pudo registrar la solicitud de anulación");
    } finally {
      setLoadingMode(null);
    }
  }, [
    cancellationReason,
    closeDeleteModal,
    deleteConfirmationChecked,
    page,
    rows.length,
    selectedOrder,
  ]);

  const handleCancelRequest = useCallback(
    async (request) => {
      const confirmationResult = await Swal.fire({
        title: "Confirmación",
        text:
          "Está a punto de cancelar esta solicitud de anulación. La solicitud quedará en estado Cancelado. ¿Desea continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar solicitud",
        cancelButtonText: "No",
        heightAuto: true,
      });

      if (!confirmationResult.isConfirmed) {
        return;
      }

      try {
        setLoadingMode("cancel-request");
        await cancelOrderCancellationRequest(request.id, {
          estado: "CANCELADO",
        });

        AlertComponent.success(
          "Bien hecho!",
          "La solicitud fue cancelada exitosamente"
        );

        const isLastItemOnPage = requestsRows.length === 1 && requestPage > 1;
        if (isLastItemOnPage) {
          setRequestPage((currentPage) => currentPage - 1);
          return;
        }

        await loadRequests();
      } catch (response) {
        console.error("Error cancelando la solicitud:", response);
        AlertComponent.error("Error", "No se pudo cancelar la solicitud");
      } finally {
        setLoadingMode(null);
      }
    },
    [loadRequests, requestPage, requestsRows.length]
  );

  return {
    activeTab,
    cancellationReason,
    deleteConfirmationChecked,
    isDeleteModalOpen,
    loading,
    loadingText,
    submitting,
    page,
    pageSize,
    requestPage,
    requestPageSize,
    requestStatusOptions,
    requestTypeOptions,
    requestsEmptyText,
    requestsRows,
    requestsTotal,
    rows,
    searchQuery,
    selectedOrder,
    selectedRequestStatus,
    selectedRequestType,
    total,
    closeDeleteModal,
    handleActiveTabChange: setActiveTab,
    handleCancellationReasonChange,
    handleClearSearch,
    handleDeleteConfirm,
    handleDeleteConfirmationChange,
    handleDeleteRequest,
    handlePageChange,
    handleRequestFiltersClear,
    handleRequestFiltersSearch,
    handleRequestPageChange,
    handleRequestStatusChange,
    handleRequestTypeChange,
    handleSearch,
    handleSearchQueryChange,
    handleCancelRequest,
    loadOrders,
    loadRequests,
  };
};
