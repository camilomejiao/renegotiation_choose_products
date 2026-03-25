import { useCallback, useEffect, useRef, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { handleError, showAlert } from "../../../helpers/utils/utils";
import {
  approveSupervisionProducts,
  getConvocations,
  getPlansByConvocation,
  getSupervisionProducts,
  getSuppliersByConvocation,
} from "../api/catalogSupervisionValidationApi";
import { normalizeSupervisionRows } from "./normalizeSupervisionRows";

const PAGE_SIZE = 10;
const BATCH_SIZE = 250;

const toOption = (rows = [], labelKey = "nombre") => {
  return rows.map((row) => ({
    value: row.id,
    label: row[labelKey],
  }));
};

export const useCatalogSupervisionValidationPage = () => {
  const requestIdRef = useRef(0);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [approving, setApproving] = useState(false);

  const [convocations, setConvocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [selectedConvocation, setSelectedConvocation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("approve");
  const [approvalComment, setApprovalComment] = useState("");

  const loadInitialData = useCallback(async () => {
    try {
      setLoadingInitial(true);
      const convocationRows = await getConvocations();
      setConvocations(convocationRows);
    } catch (error) {
      handleError(error, "Error cargando jornadas");
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  const loadProducts = useCallback(
    async ({ nextPage = 0, nextPageSize = PAGE_SIZE, nextSearch = "", planId, supplierId }) => {
      if (!planId || !supplierId) {
        setRows([]);
        setRowCount(0);
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      try {
        setLoadingTable(true);
        const response = await getSupervisionProducts({
          page: nextPage + 1,
          pageSize: nextPageSize,
          planId,
          supplierId,
          search: nextSearch,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (!response.hasSupplierQuote) {
          AlertComponent.info("", "Proveedor no ha llenado la cotizacion de los productos.");
          setRows([]);
          setRowCount(0);
          return;
        }

        setRows(normalizeSupervisionRows(response.rows));
        setRowCount(response.total);
      } catch (error) {
        if (requestId === requestIdRef.current) {
          handleError(error, "Error cargando productos de supervision");
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
    setSelectedSupplier(null);
    setPlans([]);
    setSuppliers([]);
    setRows([]);
    setRowCount(0);
    setPage(0);
    setSelectedRows([]);

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

  const handleSelectedPlan = useCallback(async (option) => {
    setSelectedPlan(option ?? null);
    setSelectedSupplier(null);
    setSuppliers([]);
    setRows([]);
    setRowCount(0);
    setPage(0);
    setSelectedRows([]);
    setSearchQuery("");
    setDebouncedSearch("");

    if (!option?.value || !selectedConvocation?.value) {
      return;
    }

    try {
      setLoadingSuppliers(true);
      const supplierRows = await getSuppliersByConvocation(selectedConvocation.value);
      setSuppliers(supplierRows);
    } catch (error) {
      handleError(error, "Error cargando proveedores de la jornada");
      setSuppliers([]);
    } finally {
      setLoadingSuppliers(false);
    }
  }, [selectedConvocation?.value]);

  const handleSelectedSupplier = useCallback((option) => {
    setSelectedSupplier(option ?? null);
    setRows([]);
    setRowCount(0);
    setPage(0);
    setSelectedRows([]);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((nextPage, nextPageSize) => {
    setPage((nextPage || 1) - 1);
    setPageSize(nextPageSize || PAGE_SIZE);
    setSelectedRows([]);
  }, []);

  const handleRowSelectionChange = useCallback((_keys, records) => {
    setSelectedRows(records || []);
  }, []);

  const closeApprovalModal = useCallback(() => {
    setShowApprovalModal(false);
    setApprovalAction("approve");
    setApprovalComment("");
  }, []);

  const openApprovalModal = useCallback(() => {
    if (!selectedRows.length) {
      AlertComponent.info("", "Por favor seleccione al menos un producto.");
      return;
    }
    setShowApprovalModal(true);
  }, [selectedRows.length]);

  const getOutOfRangeSelected = useCallback(() => {
    return selectedRows.filter((row) => row.isPriceMaxValue);
  }, [selectedRows]);

  const processBatches = useCallback(async (ids, estado, comentario) => {
    for (let index = 0; index < ids.length; index += BATCH_SIZE) {
      const batch = ids.slice(index, index + BATCH_SIZE);
      await approveSupervisionProducts({
        ids: batch,
        estado,
        comentario,
      });
    }
  }, []);

  const handleApproveSubmit = useCallback(async () => {
    const ids = selectedRows.map((row) => row.id);

    if (!ids.length) {
      closeApprovalModal();
      return;
    }

    if (approvalAction === "approve") {
      const outOfRangeRows = getOutOfRangeSelected();
      if (outOfRangeRows.length) {
        AlertComponent.info(
          "No se puede aprobar",
          `Hay ${outOfRangeRows.length} producto(s) con precio superior del rango permitido.`
        );
        return;
      }
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
        supplierId: selectedSupplier?.value,
      });
    } catch (error) {
      handleError(error, "Error al aprobar o denegar en supervision");
    } finally {
      setApproving(false);
    }
  }, [
    approvalAction,
    approvalComment,
    closeApprovalModal,
    debouncedSearch,
    getOutOfRangeSelected,
    loadProducts,
    page,
    pageSize,
    processBatches,
    selectedPlan?.value,
    selectedRows,
    selectedSupplier?.value,
  ]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedPlan?.value || !selectedSupplier?.value) {
      return;
    }

    loadProducts({
      nextPage: page,
      nextPageSize: pageSize,
      nextSearch: debouncedSearch,
      planId: selectedPlan.value,
      supplierId: selectedSupplier.value,
    });
  }, [
    debouncedSearch,
    loadProducts,
    page,
    pageSize,
    selectedPlan?.value,
    selectedSupplier?.value,
  ]);

  return {
    loadingInitial,
    loadingPlans,
    loadingSuppliers,
    loadingTable,
    approving,
    convocationOptions: toOption(convocations, "nombre"),
    planOptions: plans.map((item) => ({ value: item.id, label: item.plan_nombre })),
    supplierOptions: toOption(suppliers, "nombre"),
    selectedConvocation,
    selectedPlan,
    selectedSupplier,
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
    handleSelectedSupplier,
    handleSearchChange,
    handlePageChange,
    handleRowSelectionChange,
    openApprovalModal,
    closeApprovalModal,
    setApprovalAction,
    setApprovalComment,
    handleApproveSubmit,
    reloadProducts: () =>
      loadProducts({
        nextPage: page,
        nextPageSize: pageSize,
        nextSearch: debouncedSearch,
        planId: selectedPlan?.value,
        supplierId: selectedSupplier?.value,
      }),
  };
};
