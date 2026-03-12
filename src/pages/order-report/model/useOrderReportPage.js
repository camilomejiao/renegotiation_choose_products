import { useCallback, useEffect, useMemo, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import {
  deleteOrderReportItem,
  getOrderReportPage,
} from "../api/orderReportApi";
import { normalizeOrderReportRows } from "./normalizeOrderReportRows";

const PAGE_SIZE = 100;
const MIN_SEARCH_LENGTH = 5;

export const useOrderReportPage = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadingText = useMemo(() => {
    if (loading && isDeleteModalOpen) {
      return "Eliminando orden...";
    }

    return "Cargando órdenes...";
  }, [isDeleteModalOpen, loading]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }, [appliedSearchQuery, page, pageSize]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
  }, []);

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

  const handleDeleteRequest = useCallback((order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedOrder?.id) {
      closeDeleteModal();
      return;
    }

    try {
      setLoading(true);
      const response = await deleteOrderReportItem(selectedOrder.id);

      if (response?.status === ResponseStatusEnum.NO_CONTENT) {
        AlertComponent.success("Bien hecho!", "Orden eliminada exitosamente!");
        closeDeleteModal();

        const isLastItemOnPage = rows.length === 1 && page > 1;
        if (isLastItemOnPage) {
          setPage((currentPage) => currentPage - 1);
          return;
        }

        await loadOrders();
        return;
      }

      if (response?.status === ResponseStatusEnum.FORBIDDEN) {
        AlertComponent.error(
          "Error",
          `No se puede eliminar orden porque ${response?.data || "tiene dependencias asociadas"}`
        );
        closeDeleteModal();
      }
    } catch (response) {
      console.error("Error al eliminar la orden:", response);
      AlertComponent.error("Error", "No se pudo eliminar la orden");
    } finally {
      setLoading(false);
    }
  }, [closeDeleteModal, loadOrders, page, rows.length, selectedOrder]);

  return {
    rows,
    total,
    loading,
    loadingText,
    searchQuery,
    page,
    pageSize,
    selectedOrder,
    isDeleteModalOpen,
    loadOrders,
    handleSearchQueryChange,
    handleSearch,
    handleClearSearch,
    handlePageChange,
    handleDeleteRequest,
    handleDeleteConfirm,
    closeDeleteModal,
  };
};
