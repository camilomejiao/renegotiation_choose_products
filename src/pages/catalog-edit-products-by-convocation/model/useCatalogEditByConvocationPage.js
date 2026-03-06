import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { handleError, showAlert } from "../../../helpers/utils/utils";
import {
  deleteCatalogProduct,
  getEnvironmentalCategoryKeys,
  getPlansByConvocation,
  getProductsByPlan,
  loadCatalogEditDependencies,
  updateCatalogProducts,
} from "../api/catalogEditByConvocationApi";
import { normalizeCatalogEditRows } from "./normalizeCatalogEditRows";
import { transformCatalogEditRows } from "./transformCatalogEditRows";

const PAGE_SIZE = 100;

export const useCatalogEditByConvocationPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [rowCount, setRowCount] = useState(0);

  const [rows, setRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const planOptions = useMemo(
    () => plans.map((item) => ({ value: item.id, label: item.plan_nombre })),
    [plans]
  );

  const loadPlans = useCallback(async () => {
    if (!params.id) {
      return;
    }

    try {
      setLoadingPlans(true);
      const [dependencies, planRows] = await Promise.all([
        loadCatalogEditDependencies(),
        getPlansByConvocation(params.id),
      ]);

      setUnitOptions(dependencies.units);
      setCategoryOptions(dependencies.categories);
      setPlans(planRows);
    } catch (error) {
      handleError(error, "Error cargando datos iniciales");
    } finally {
      setLoadingPlans(false);
    }
  }, [params.id]);

  const loadProducts = useCallback(
    async ({ nextPage = 0, nextPageSize = PAGE_SIZE, nextSearch = "", planId }) => {
      if (!planId) {
        setRows([]);
        setRowCount(0);
        return;
      }

      try {
        setLoadingTable(true);
        const response = await getProductsByPlan({
          page: nextPage + 1,
          pageSize: nextPageSize,
          planId,
          search: nextSearch,
        });

        setRows(normalizeCatalogEditRows(response.products));
        setRowCount(response.total);
      } catch (error) {
        handleError(error, "Error al obtener productos");
      } finally {
        setLoadingTable(false);
      }
    },
    []
  );

  const handleSelectedPlan = useCallback((option) => {
    setSelectedPlan(option);
    setPage(0);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  const handleRowChange = useCallback((rowId, patch) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? { ...row, ...patch } : row))
    );
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setSelectedRowId(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedRowId(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedRowId || !selectedPlan?.value) {
      closeDeleteModal();
      return;
    }

    try {
      setDeleting(true);
      const { status } = await deleteCatalogProduct(selectedRowId);

      if (status === ResponseStatusEnum.OK) {
        showAlert("Bien hecho!", "Producto eliminado exitosamente.");
      }

      closeDeleteModal();
      await loadProducts({
        nextPage: 0,
        nextPageSize: pageSize,
        nextSearch: searchQuery,
        planId: selectedPlan.value,
      });
    } catch (error) {
      handleError(error, "Error al eliminar el producto");
    } finally {
      setDeleting(false);
    }
  }, [
    closeDeleteModal,
    loadProducts,
    pageSize,
    searchQuery,
    selectedPlan?.value,
    selectedRowId,
  ]);

  const handleSave = useCallback(async () => {
    if (!selectedPlan?.value) {
      handleError("Falta plan", "Selecciona un plan para guardar");
      return;
    }

    const hasEmptyFields = rows.some((row) => !row.name || !row.price_min || !row.price_max);

    if (hasEmptyFields) {
      handleError("Revisa campos", "Tienes algún campo vacío.");
      return;
    }

    try {
      setSaving(true);
      const environmentalKeys = await getEnvironmentalCategoryKeys();
      const productsPayload = transformCatalogEditRows({ rows, environmentalKeys });

      const { status } = await updateCatalogProducts({
        jornada_plan: selectedPlan.value,
        productos: productsPayload,
      });

      if (status === ResponseStatusEnum.OK) {
        showAlert("Bien hecho!", "Productos actualizados con éxito.");
        navigate("/admin/list-products-by-convocation");
      }
    } catch (error) {
      handleError(error, "Error al guardar los productos");
    } finally {
      setSaving(false);
    }
  }, [navigate, rows, selectedPlan?.value]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  }, []);

  const handleCreateProducts = useCallback(() => {
    navigate("/admin/product-upload");
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate("/admin/list-products-by-convocation");
  }, [navigate]);

  const handleTablePageChange = useCallback((nextPage, nextPageSize) => {
    setLoadingTable(true);
    setRows([]);
    setPage((nextPage || 1) - 1);
    setPageSize(nextPageSize || PAGE_SIZE);
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedPlan?.value) {
      return;
    }

    loadProducts({
      nextPage: page,
      nextPageSize: pageSize,
      nextSearch: debouncedSearchQuery,
      planId: selectedPlan.value,
    });
  }, [debouncedSearchQuery, loadProducts, page, pageSize, selectedPlan?.value]);

  return {
    loadingPlans,
    loadingTable,
    saving,
    deleting,
    planOptions,
    selectedPlan,
    unitOptions,
    categoryOptions,
    rows,
    page,
    pageSize,
    rowCount,
    searchQuery,
    showDeleteModal,
    loadProducts,
    handleSelectedPlan,
    handleRowChange,
    handleDeleteClick,
    closeDeleteModal,
    confirmDelete,
    handleSave,
    handleSearchChange,
    handleCreateProducts,
    handleBack,
    handleTablePageChange,
  };
};
