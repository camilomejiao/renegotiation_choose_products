import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { handleError, showAlert } from "../../../helpers/utils/utils";
import {
  approveOrDenyEnvironmental,
  getConvocations,
  getEnvironmentalDefinitions,
  getPlansByConvocation,
  getProductsByPlan,
  updateEnvironmentalValidation,
} from "../api/catalogEnvironmentalValidationApi";
import { buildEnvironmentalPayload } from "./buildEnvironmentalPayload";
import { normalizeEnvironmentalRows } from "./normalizeEnvironmentalRows";

const PAGE_SIZE = 10;
const BATCH_SIZE = 250;

const toPlanOption = (items = []) => {
  return items.map((item) => ({
    value: item.id,
    label: item.plan_nombre,
  }));
};

const toConvocationOption = (items = []) => {
  return items.map((item) => ({
    value: item.id,
    label: item.nombre,
  }));
};

export const useCatalogEnvironmentalValidationPage = () => {
  const requestIdRef = useRef(0);
  const environmentalCategoriesRef = useRef([]);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);

  const [convocations, setConvocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [environmentalCategories, setEnvironmentalCategories] = useState([]);

  const [selectedConvocation, setSelectedConvocation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRowsMap, setEditedRowsMap] = useState({});

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("approve");
  const [approvalComment, setApprovalComment] = useState("");

  const loadInitialData = useCallback(async () => {
    try {
      setLoadingInitial(true);

      const [convocationRows, categoriesRows] = await Promise.all([
        getConvocations(),
        getEnvironmentalDefinitions(),
      ]);

      setConvocations(convocationRows);
      setEnvironmentalCategories(categoriesRows);
    } catch (error) {
      handleError(error, "Error cargando datos iniciales");
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  const loadProducts = useCallback(
    async ({ nextPage = 0, nextPageSize = PAGE_SIZE, nextSearch = "", planId }) => {
      if (!planId) {
        setRows([]);
        setRowCount(0);
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      try {
        setLoadingTable(true);
        const response = await getProductsByPlan({
          page: nextPage + 1,
          pageSize: nextPageSize,
          planId,
          search: nextSearch,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        const normalizedRows = normalizeEnvironmentalRows({
          rows: response.rows,
          categories: environmentalCategoriesRef.current,
        });

        setRows(normalizedRows);
        setRowCount(response.total);
      } catch (error) {
        if (requestId === requestIdRef.current) {
          handleError(error, "Error al obtener productos");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingTable(false);
        }
      }
    },
    []
  );

  const handleSelectedConvocation = useCallback(async (option) => {
    setSelectedConvocation(option ?? null);
    setSelectedPlan(null);
    setPlans([]);
    setRows([]);
    setRowCount(0);
    setPage(0);
    setSelectedRows([]);
    setEditedRowsMap({});

    if (!option?.value) {
      return;
    }

    try {
      setLoadingPlans(true);
      const planRows = await getPlansByConvocation(option.value);
      setPlans(planRows);
    } catch (error) {
      handleError(error, "Error cargando planes de la jornada");
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const handleSelectedPlan = useCallback((option) => {
    setSelectedPlan(option ?? null);
    setPage(0);
    setSelectedRows([]);
    setEditedRowsMap({});
    setSearchQuery("");
    setDebouncedSearch("");
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  }, []);

  const handleTablePageChange = useCallback((nextPage, nextPageSize) => {
    setPage((nextPage || 1) - 1);
    setPageSize(nextPageSize || PAGE_SIZE);
    setSelectedRows([]);
  }, []);

  const handleRowSelectionChange = useCallback((_keys, records) => {
    setSelectedRows(records || []);
  }, []);

  const handleRowFieldChange = useCallback((rowId, fieldKey, value) => {
    setRows((currentRows) => {
      return currentRows.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        const nextRow = { ...row, [fieldKey]: value };

        setEditedRowsMap((currentMap) => ({
          ...currentMap,
          [String(rowId)]: nextRow,
        }));

        return nextRow;
      });
    });
  }, []);

  const closeApprovalModal = useCallback(() => {
    setShowApprovalModal(false);
    setApprovalAction("approve");
    setApprovalComment("");
  }, []);

  const openApprovalModal = useCallback(() => {
    if (!selectedRows.length) {
      AlertComponent.warning("Validacion", "Selecciona al menos un producto");
      return;
    }

    setShowApprovalModal(true);
  }, [selectedRows.length]);

  const processBatches = useCallback(async (ids, estado, comentario) => {
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const payload = {
        ids: batch,
        estado,
        comentario: comentario || "Productos aprobados exitosamente por ambiental",
      };

      await approveOrDenyEnvironmental(payload);
    }
  }, []);

  const handleApproveSubmit = useCallback(async () => {
    const ids = selectedRows.map((row) => row.id);

    if (!ids.length) {
      closeApprovalModal();
      return;
    }

    const estado = approvalAction === "approve" ? 1 : 0;
    const label = approvalAction === "approve" ? "Aprobado" : "Denegado";

    try {
      setApproving(true);
      await processBatches(ids, estado, approvalComment);
      showAlert("Bien hecho!", `Producto ${label} exitosamente!`);
      closeApprovalModal();
      setSelectedRows([]);
      await loadProducts({
        nextPage: page,
        nextPageSize: pageSize,
        nextSearch: debouncedSearch,
        planId: selectedPlan?.value,
      });
    } catch (error) {
      handleError(error, "Error al aprobar o denegar productos");
    } finally {
      setApproving(false);
    }
  }, [
    approvalAction,
    approvalComment,
    closeApprovalModal,
    debouncedSearch,
    loadProducts,
    page,
    pageSize,
    processBatches,
    selectedPlan?.value,
    selectedRows,
  ]);

  const handleSaveProducts = useCallback(async () => {
    const editedRows = Object.values(editedRowsMap);

    if (!selectedPlan?.value) {
      handleError("Error", "Selecciona un plan para guardar");
      return;
    }

    if (!editedRows.length) {
      AlertComponent.warning("", "No hay productos modificados para guardar.");
      return;
    }

    try {
      setSaving(true);
      const environmentalKeys = environmentalCategories.map((category) => String(category.codigo));
      const products = buildEnvironmentalPayload({ rows: editedRows, environmentalKeys });

      const { status } = await updateEnvironmentalValidation({
        jornada_plan: Number(selectedPlan.value),
        productos: products,
      });

      if (status === ResponseStatusEnum.OK) {
        showAlert("Bien hecho!", "Productos actualizados con exito.");
        setEditedRowsMap({});
        await loadProducts({
          nextPage: page,
          nextPageSize: pageSize,
          nextSearch: debouncedSearch,
          planId: selectedPlan.value,
        });
      }
    } catch (error) {
      handleError(error, "Error al guardar los productos");
    } finally {
      setSaving(false);
    }
  }, [
    debouncedSearch,
    editedRowsMap,
    environmentalCategories,
    loadProducts,
    page,
    pageSize,
    selectedPlan?.value,
  ]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    environmentalCategoriesRef.current = environmentalCategories;
  }, [environmentalCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedPlan?.value || environmentalCategories.length === 0) {
      return;
    }

    loadProducts({
      nextPage: page,
      nextPageSize: pageSize,
      nextSearch: debouncedSearch,
      planId: selectedPlan.value,
    });
  }, [debouncedSearch, environmentalCategories.length, loadProducts, page, pageSize, selectedPlan?.value]);

  return {
    loadingInitial,
    loadingPlans,
    loadingTable,
    saving,
    approving,
    convocationOptions: toConvocationOption(convocations),
    planOptions: toPlanOption(plans),
    selectedConvocation,
    selectedPlan,
    environmentalCategories,
    rows,
    rowCount,
    page,
    pageSize,
    searchQuery,
    showApprovalModal,
    approvalAction,
    approvalComment,
    handleSelectedConvocation,
    handleSelectedPlan,
    handleSearchChange,
    handleTablePageChange,
    handleRowSelectionChange,
    handleRowFieldChange,
    openApprovalModal,
    closeApprovalModal,
    setApprovalAction,
    setApprovalComment,
    handleApproveSubmit,
    handleSaveProducts,
    reloadProducts: () =>
      loadProducts({
        nextPage: page,
        nextPageSize: pageSize,
        nextSearch: debouncedSearch,
        planId: selectedPlan?.value,
      }),
  };
};
