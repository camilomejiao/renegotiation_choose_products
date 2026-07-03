import { useCallback, useMemo, useState } from "react";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { getAlertedProductsPage } from "../../../entities/alerted-product";
import { SIN_GESTION_ALERTA_ID, SIN_TIPO_GESTION_ID } from "./alertManagementConstants";

const DEFAULT_PAGE_SIZE = 10;

export const useAddProductModal = ({ jornadaId, addedOrderDetailIds = [], onAdd } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalRecords, setTotalRecords] = useState(0);
  const [addingId, setAddingId] = useState(null);

  const fetchProducts = useCallback(
    async (page, size) => {
      if (!jornadaId) return;
      setLoading(true);
      try {
        const result = await getAlertedProductsPage({
          operationalDay: { value: jornadaId },
          managementType: { value: SIN_TIPO_GESTION_ID },
          alertManagement: { value: SIN_GESTION_ALERTA_ID },
          page,
          pageSize: size,
        });
        setRows(result.rows);
        setTotalRecords(result.meta?.total_registros ?? 0);
      } catch {
        setRows([]);
        setTotalRecords(0);
        AlertComponent.error("Error", "No fue posible cargar los productos disponibles para adicionar.");
      } finally {
        setLoading(false);
      }
    },
    [jornadaId]
  );

  const openModal = useCallback(() => {
    setIsOpen(true);
    setCurrentPage(1);
    fetchProducts(1, pageSize);
  }, [fetchProducts, pageSize]);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const handlePageChange = useCallback(
    (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
      fetchProducts(page, size);
    },
    [fetchProducts]
  );

  const handleAdd = useCallback(
    async (record) => {
      setAddingId(record.id);
      try {
        await onAdd?.(record);
      } finally {
        setAddingId(null);
      }
    },
    [onAdd]
  );

  const visibleRows = useMemo(
    () => rows.filter((row) => !addedOrderDetailIds.includes(row.orderDetailId)),
    [rows, addedOrderDetailIds]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    rows: visibleRows,
    loading,
    addingId,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handleAdd,
  };
};