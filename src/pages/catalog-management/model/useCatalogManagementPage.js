import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeCatalogItems } from "../../../entities/catalog-item";
import { filterCatalogItems } from "../../../features/catalog-search";
import { getCatalogItems } from "../api/getCatalogItems";

export const useCatalogManagementPage = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [suppliersForModal, setSuppliersForModal] = useState([]);

  const loadCatalogItems = useCallback(async () => {
    try {
      setLoading(true);
      const payload = await getCatalogItems();
      const normalizedRows = normalizeCatalogItems(payload);
      setRows(normalizedRows);
      setFilteredRows(normalizedRows);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogItems();
  }, [loadCatalogItems]);

  const handleSearchChange = useCallback(
    (event) => {
      const query = event.target.value;
      setSearchQuery(query);
      setFilteredRows(filterCatalogItems(rows, query));
    },
    [rows]
  );

  const handleCreateCatalogItem = useCallback(() => {
    navigate("/admin/product-upload");
  }, [navigate]);

  const handleExportReport = useCallback(() => {
    navigate("/admin/report-by-convocation");
  }, [navigate]);

  const handleAddProducts = useCallback(
    (id) => {
      navigate(`/admin/product-upload?convocationId=${id}`);
    },
    [navigate]
  );

  const handleEditCatalogItem = useCallback(
    (id) => {
      navigate(`/admin/edit-products-by-convocation/${id}`);
    },
    [navigate]
  );

  const openSuppliersModal = useCallback((row) => {
    setSuppliersForModal(row?.suppliersList || []);
    setShowSuppliersModal(true);
  }, []);

  const closeSuppliersModal = useCallback(() => {
    setShowSuppliersModal(false);
    setSuppliersForModal([]);
  }, []);

  const suppliersModalData = useMemo(
    () =>
      suppliersForModal.map((supplier, index) => ({
        key: supplier?.id ?? `${supplier?.nit ?? "nit"}-${index}`,
        index: index + 1,
        nombre: supplier?.nombre ?? "",
        nit: supplier?.nit ?? "",
      })),
    [suppliersForModal]
  );

  return {
    loading,
    rows: filteredRows,
    searchQuery,
    showSuppliersModal,
    suppliersModalData,
    loadCatalogItems,
    handleSearchChange,
    handleCreateCatalogItem,
    handleExportReport,
    handleAddProducts,
    handleEditCatalogItem,
    openSuppliersModal,
    closeSuppliersModal,
  };
};
